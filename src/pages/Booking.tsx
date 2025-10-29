
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, MapPin, Video, CheckCircle, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useAvailableTimeSlots } from "@/hooks/useAvailableTimeSlots";
import QuickPatientRegister from "@/components/admin/QuickPatientRegister";

interface Profile {
  id: string;
  full_name: string;
  phone: string;
}

const Booking = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { settings } = useAdminSettings();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [patients, setPatients] = useState<Profile[]>([]);
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const timeSlots = useMemo(() => [
    "18:00", "19:00", "20:00", "21:00"
  ], []);

  const { availableSlots, loading: loadingSlots } = useAvailableTimeSlots(selectedDate, timeSlots);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Buscar pacientes se for admin
  useEffect(() => {
    if (isAdmin() && user) {
      fetchPatients();
    }
  }, [user]);

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .order('full_name');

      if (error) {
        console.error('Erro ao buscar pacientes:', error);
        toast.error('Erro ao carregar lista de pacientes');
        return;
      }

      setPatients(data || []);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      toast.error('Erro ao carregar lista de pacientes');
    } finally {
      setLoadingPatients(false);
    }
  };

  const handlePatientCreated = (userId: string, name: string) => {
    setSelectedPatientId(userId);
    toast.success(`Paciente ${name} selecionado para o agendamento`);
    fetchPatients(); // Recarregar lista
  };

  // Show loading state while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50 flex items-center justify-center">
        <p className="text-rose-nude-600">Carregando...</p>
      </div>
    );
  }

  // If not loading and no user, component will be redirected by useEffect above
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50 flex items-center justify-center">
        <p className="text-rose-nude-600">Redirecionando...</p>
      </div>
    );
  }

  const getCurrentPrice = () => {
    const service = settings.services.find(s => s.id === selectedService);
    if (!service) return 0;
    
    if (selectedService === "1") return service.price; // Anamnese only has one price
    
    return selectedType === "online" ? 
      (service.priceOnline || service.price) : 
      service.price;
  };

  const getAdvanceAmount = () => {
    const totalPrice = getCurrentPrice();
    return (totalPrice * settings.payment.advancePercentage) / 100;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setCalendarOpen(false); // Close calendar automatically after selection
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (isAdmin() && !selectedPatientId) {
      toast.error("Selecione um paciente para o agendamento");
      return;
    }
    
    if (!selectedDate || !selectedTime || !selectedService || (!selectedType && selectedService !== "1")) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setBookingLoading(true);

    try {
      const selectedServiceData = settings.services.find(s => s.id === selectedService);
      
      const appointmentData = {
        user_id: isAdmin() ? selectedPatientId : user?.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        service: selectedServiceData?.name || 'Serviço não encontrado',
        status: 'agendado',
        type: selectedService === "1" ? null : selectedType,
        notes: notes.trim() || null,
        created_by_admin: isAdmin() ? user?.id : null
      };
      
      console.log('Dados do agendamento:', appointmentData);
      
      // Verificação de disponibilidade (bypass RLS) via RPC
      const { data: isFree, error: rpcError } = await supabase.rpc('is_slot_available', {
        check_date: appointmentData.date,
        check_time: `${appointmentData.time}:00`,
        exclude_appointment_id: null
      });

      if (rpcError) {
        console.error('Erro ao verificar disponibilidade (RPC):', rpcError);
        toast.error('Erro ao verificar disponibilidade do horário');
        setBookingLoading(false);
        return;
      }

      if (!isFree) {
        toast.error('Este horário já está ocupado. Por favor, escolha outro horário.');
        setBookingLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select();

      if (error) {
        console.error('Erro detalhado:', error);
        toast.error(`Erro ao realizar agendamento: ${error.message}`);
        return;
      }

      console.log('Agendamento criado com sucesso:', data);
      toast.success("Agendamento realizado com sucesso!");
      
      // Criar dados do agendamento para a página de pagamento
      const appointmentId = data[0]?.id;
      const paymentData = {
        appointmentId,
        service: selectedServiceData?.name,
        date: format(selectedDate, "PPP", { locale: ptBR }),
        time: selectedTime,
        type: selectedService !== "1" ? selectedType : null,
        totalPrice: getCurrentPrice(),
        advanceAmount: getAdvanceAmount(),
        advancePercentage: settings.payment.advancePercentage
      };
      
      // Salvar dados temporariamente no localStorage para a página de pagamento
      localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
      
      // Navegar para página de pagamento
      setTimeout(() => {
        navigate("/payment");
      }, 1500);
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado ao realizar agendamento. Tente novamente.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (!user) return null;

  const getUserFirstName = () => {
    if (!user) return 'Usuário';
    
    if (user.full_name) {
      const firstName = user.full_name.trim().split(' ')[0];
      return firstName || 'Usuário';
    }
    
    return 'Usuário';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">
              Agendar Consulta
            </h1>
            <p className="text-lg text-rose-nude-600">
              {isAdmin() 
                ? "Bem-vindo(a), Dra. Daiane! Agende uma consulta para um paciente." 
                : `Bem-vindo(a), ${getUserFirstName()}! Escolha o melhor horário para sua consulta.`
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-rose-nude-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800">Detalhes do Agendamento</CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Preencha as informações abaixo para agendar sua consulta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {isAdmin() && (
                      <div className="space-y-3 pb-4 border-b border-rose-nude-200">
                        <Label className="text-rose-nude-700 font-medium">Paciente *</Label>
                        <div className="flex gap-2">
                          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                            <SelectTrigger className="border-rose-nude-200 flex-1">
                              <SelectValue placeholder={loadingPatients ? "Carregando pacientes..." : "Selecione o paciente"} />
                            </SelectTrigger>
                            <SelectContent>
                              {patients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{patient.full_name}</span>
                                    {patient.phone && (
                                      <span className="text-sm text-rose-nude-600">{patient.phone}</span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowQuickRegister(true)}
                            className="border-rose-nude-300 hover:bg-rose-nude-50"
                          >
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label className="text-rose-nude-700 font-medium">Tipo de Serviço *</Label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="border-rose-nude-200">
                          <SelectValue placeholder="Selecione o tipo de consulta" />
                        </SelectTrigger>
                        <SelectContent>
                          {settings.services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              <div className="flex flex-col w-full">
                                <span className="font-medium">{service.name}</span>
                                <span className="text-sm text-rose-nude-600 text-left mt-1">{service.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedService && selectedService !== "1" && (
                      <div className="space-y-3">
                        <Label className="text-rose-nude-700 font-medium">Modalidade *</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Card 
                            className={cn(
                              "cursor-pointer transition-all border-2",
                              selectedType === "online" 
                                ? "border-rose-nude-500 bg-rose-nude-50" 
                                : "border-rose-nude-200 hover:border-rose-nude-300"
                            )}
                            onClick={() => setSelectedType("online")}
                          >
                            <CardContent className="p-4 text-center">
                              <Video className="w-8 h-8 mx-auto mb-2 text-rose-nude-600" />
                              <h3 className="font-medium text-rose-nude-800">Online</h3>
                              <p className="text-sm text-rose-nude-600">Via videoconferência</p>
                            </CardContent>
                          </Card>
                          
                          <Card 
                            className={cn(
                              "cursor-pointer transition-all border-2",
                              selectedType === "presencial" 
                                ? "border-rose-nude-500 bg-rose-nude-50" 
                                : "border-rose-nude-200 hover:border-rose-nude-300"
                            )}
                            onClick={() => setSelectedType("presencial")}
                          >
                            <CardContent className="p-4 text-center">
                              <MapPin className="w-8 h-8 mx-auto mb-2 text-rose-nude-600" />
                              <h3 className="font-medium text-rose-nude-800">Presencial</h3>
                              <p className="text-sm text-rose-nude-600">No consultório</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label className="text-rose-nude-700 font-medium">Data da Consulta *</Label>
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal border-rose-nude-200",
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
                            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                            initialFocus
                            locale={ptBR}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-rose-nude-700 font-medium">Horário *</Label>
                      {loadingSlots ? (
                        <div className="text-center py-4 text-rose-nude-600">
                          Verificando horários disponíveis...
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="text-center py-4 text-rose-nude-600">
                          Nenhum horário disponível para esta data. Escolha outra data.
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-3">
                          {timeSlots.map((time) => {
                            const isAvailable = availableSlots.includes(time);
                            return (
                              <Button
                                key={time}
                                type="button"
                                variant={selectedTime === time ? "default" : "outline"}
                                className={cn(
                                  "border-rose-nude-200",
                                  selectedTime === time && "bg-rose-nude-500 hover:bg-rose-nude-600",
                                  !isAvailable && "opacity-50 cursor-not-allowed bg-gray-100"
                                )}
                                onClick={() => isAvailable && setSelectedTime(time)}
                                disabled={!isAvailable}
                              >
                                <Clock className="w-4 h-4 mr-2" />
                                {time}
                                {!isAvailable && " (Ocupado)"}
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="notes" className="text-rose-nude-700 font-medium">
                        Observações (Opcional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Compartilhe informações adicionais que possam ser úteis para a consulta..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="border-rose-nude-200 focus:border-rose-nude-400"
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white py-3"
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? "Agendando..." : "Confirmar Agendamento"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-rose-nude-200 shadow-lg sticky top-8">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800">Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedService && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-rose-nude-600">Serviço:</span>
                        <span className="text-sm font-medium text-right">
                          {settings.services.find(s => s.id === selectedService)?.name}
                        </span>
                      </div>
                      
                      {selectedType && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-rose-nude-600">Modalidade:</span>
                          <span className="text-sm font-medium capitalize">{selectedType}</span>
                        </div>
                      )}
                      
                      {selectedDate && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-rose-nude-600">Data:</span>
                          <span className="text-sm font-medium">
                            {format(selectedDate, "PPP", { locale: ptBR })}
                          </span>
                        </div>
                      )}
                      
                      {selectedTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-rose-nude-600">Horário:</span>
                          <span className="text-sm font-medium">{selectedTime}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-3 mt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-rose-nude-600">Valor Total:</span>
                          <span className="text-sm font-medium">
                            R$ {getCurrentPrice().toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-rose-nude-600">
                            Adiantamento ({settings.payment.advancePercentage}%):
                          </span>
                          <span className="text-lg font-bold text-rose-nude-800">
                            R$ {getAdvanceAmount().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!selectedService && (
                    <p className="text-sm text-rose-nude-600 text-center py-8">
                      Selecione um serviço para ver o resumo
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-rose-nude-200 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-rose-nude-600">
                    <p className="font-medium">{settings.clinic.address}</p>
                    <p>{settings.clinic.city}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <QuickPatientRegister
        open={showQuickRegister}
        onOpenChange={setShowQuickRegister}
        onPatientCreated={handlePatientCreated}
      />
    </div>
  );
};

export default Booking;
