import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Plus, User, UserPlus } from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useAvailableTimeSlots } from "@/hooks/useAvailableTimeSlots";
import QuickPatientRegister from "./QuickPatientRegister";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
}

const CreateAppointmentModal = ({ onAppointmentCreated }: { onAppointmentCreated: () => void }) => {
  const { settings } = useAdminSettings();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [clients, setClients] = useState<Profile[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [showQuickRegister, setShowQuickRegister] = useState(false);

  const timeSlots = useMemo(() => [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00"
  ], []);

  const { availableSlots, loading: loadingSlots } = useAvailableTimeSlots(selectedDate, timeSlots);

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open]);

  const fetchClients = async () => {
    setLoadingClients(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .order('full_name');

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        toast.error("Erro ao carregar lista de clientes");
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoadingClients(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedService("");
    setSelectedType("");
    setSelectedClientId("");
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedService || !selectedClientId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const selectedServiceData = settings.services.find(s => s.id.toString() === selectedService);
      
      // Verificar se o horário está disponível
      const checkDate = format(selectedDate, 'yyyy-MM-dd');
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('date', checkDate)
        .eq('time', selectedTime)
        .in('status', ['agendado', 'confirmado']);

      if (checkError) {
        console.error('Erro ao verificar disponibilidade:', checkError);
        toast.error('Erro ao verificar disponibilidade do horário');
        return;
      }

      if (existingAppointments && existingAppointments.length > 0) {
        toast.error('Este horário já está ocupado. Por favor, escolha outro horário.');
        return;
      }

      const appointmentData = {
        user_id: selectedClientId,
        date: checkDate,
        time: selectedTime,
        service: selectedServiceData?.name || 'Serviço não encontrado',
        status: 'confirmado', // Admin já confirma o agendamento diretamente
        type: selectedService === "1" ? null : selectedType,
        notes: notes.trim() || null
      };
      
      console.log('Dados do agendamento (admin):', appointmentData);
      
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select();

      if (error) {
        console.error('Erro detalhado:', error);
        toast.error(`Erro ao criar agendamento: ${error.message}`);
        return;
      }

      console.log('Agendamento criado com sucesso pelo admin:', data);
      toast.success("Agendamento criado com sucesso!");
      
      setOpen(false);
      resetForm();
      onAppointmentCreated();
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado ao criar agendamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedServiceData = settings.services.find(s => s.id.toString() === selectedService);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-rose-nude-800">Criar Agendamento para Cliente</DialogTitle>
          <DialogDescription className="text-rose-nude-600">
            Crie um novo agendamento em nome de um cliente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção do Cliente */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="client" className="text-rose-nude-700">Cliente *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowQuickRegister(true)}
                className="text-rose-nude-600 border-rose-nude-300"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Novo Paciente
              </Button>
            </div>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder={loadingClients ? "Carregando clientes..." : "Selecione um cliente"} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {client.full_name || 'Nome não informado'}
                      {client.phone && <span className="text-sm text-muted-foreground ml-2">({client.phone})</span>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seleção do Serviço */}
          <div className="space-y-2">
            <Label htmlFor="service" className="text-rose-nude-700">Serviço *</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {settings.services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Modalidade (apenas se não for avaliação) */}
          {selectedService && selectedService !== "1" && (
            <div className="space-y-2">
              <Label htmlFor="type" className="text-rose-nude-700">Modalidade *</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Seleção da Data */}
          <div className="space-y-2">
            <Label className="text-rose-nude-700">Data *</Label>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => isBefore(date, startOfDay(new Date()))}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Seleção do Horário */}
          <div className="space-y-2">
            <Label className="text-rose-nude-700">Horário *</Label>
            {loadingSlots ? (
              <div className="text-center py-4 text-rose-nude-600">
                Verificando horários disponíveis...
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-4 text-rose-nude-600">
                Nenhum horário disponível para esta data.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isAvailable = availableSlots.includes(time);
                  return (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => isAvailable && setSelectedTime(time)}
                      disabled={!isAvailable}
                      className={cn(
                        selectedTime === time ? "bg-rose-nude-500 hover:bg-rose-nude-600" : "",
                        !isAvailable && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {time}
                      {!isAvailable && " (Ocupado)"}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-rose-nude-700">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações adicionais sobre o agendamento..."
              className="min-h-[80px]"
            />
          </div>

          {/* Resumo do Agendamento */}
          {selectedService && selectedDate && selectedTime && selectedClientId && (
            <Card className="border-rose-nude-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-rose-nude-800 mb-2">Resumo do Agendamento</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-rose-nude-600">Cliente:</span>
                    <span>{clients.find(c => c.id === selectedClientId)?.full_name || 'Cliente selecionado'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-nude-600">Serviço:</span>
                    <span>{selectedServiceData?.name}</span>
                  </div>
                  {selectedType && (
                    <div className="flex justify-between">
                      <span className="text-rose-nude-600">Modalidade:</span>
                      <span className="capitalize">{selectedType}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-rose-nude-600">Data:</span>
                    <span>{format(selectedDate, "PPP", { locale: ptBR })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-nude-600">Horário:</span>
                    <span>{selectedTime}</span>
                  </div>
                  {selectedServiceData && (
                    <div className="flex justify-between font-medium">
                      <span className="text-rose-nude-600">Valor:</span>
                      <span>R$ {selectedServiceData.price.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <Badge className="mt-2 bg-green-100 text-green-800">
                  Status: Confirmado
                </Badge>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-rose-nude-300 text-rose-nude-700"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !selectedDate || !selectedTime || !selectedService || !selectedClientId}
              className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
            >
              {isLoading ? "Criando..." : "Criar Agendamento"}
            </Button>
          </div>
        </form>
      </DialogContent>

      <QuickPatientRegister
        open={showQuickRegister}
        onOpenChange={setShowQuickRegister}
        onPatientCreated={(userId, name) => {
          setSelectedClientId(userId);
          fetchClients();
          toast.success(`Paciente ${name} cadastrado e selecionado!`);
        }}
      />
    </Dialog>
  );
};

export default CreateAppointmentModal;