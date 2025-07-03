import { useState, useEffect } from "react";
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
import { CalendarIcon, Clock, MapPin, Video, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSettings } from "@/hooks/useAdminSettings";

const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { settings } = useAdminSettings();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const timeSlots = [
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedService || (!selectedType && selectedService !== "1")) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const selectedServiceData = settings.services.find(s => s.id === selectedService);
      
      const appointmentData = {
        user_id: user?.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        service: selectedServiceData?.name || 'Serviço não encontrado',
        status: 'agendado',
        type: selectedService === "1" ? null : selectedType, // Set to null for Anamnese, otherwise use selectedType
        notes: notes.trim() || null
      };
      
      console.log('Dados do agendamento:', appointmentData);
      
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
      
      // Aguardar um momento antes de navegar
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado ao realizar agendamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Agendar Consulta</h1>
            <p className="text-lg text-rose-nude-600">
              Bem-vindo(a), {user.full_name || 'Usuário'}! Escolha o melhor horário para sua consulta.
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
                      <Popover>
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
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-rose-nude-700 font-medium">Horário *</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? "default" : "outline"}
                            className={cn(
                              "border-rose-nude-200",
                              selectedTime === time && "bg-rose-nude-500 hover:bg-rose-nude-600"
                            )}
                            onClick={() => setSelectedTime(time)}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
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
                      disabled={isLoading}
                    >
                      {isLoading ? "Agendando..." : "Confirmar Agendamento"}
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
    </div>
  );
};

export default Booking;
