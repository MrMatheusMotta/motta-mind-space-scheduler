
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import { CalendarIcon, Clock, MapPin, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedService, setSelectedService] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const services = [
    {
      id: "anamnese",
      name: "Anamnese",
      price: 160,
      description: "Primeira consulta detalhada"
    },
    {
      id: "quinzenal",
      name: "Acompanhamento Quinzenal",
      priceOnline: 280,
      pricePresencial: 300,
      description: "Sessões a cada 15 dias"
    },
    {
      id: "mensal",
      name: "Acompanhamento Mensal",
      priceOnline: 380,
      pricePresencial: 400,
      description: "Sessões mensais"
    },
    {
      id: "isolado",
      name: "Atendimento Isolado",
      priceOnline: 120,
      pricePresencial: 150,
      description: "Consulta pontual"
    }
  ];

  const timeSlots = [
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
  ];

  const getServicePrice = () => {
    const service = services.find(s => s.id === selectedService);
    if (!service) return 0;
    
    if (service.id === "anamnese") return service.price;
    
    return selectedType === "online" 
      ? service.priceOnline || 0
      : service.pricePresencial || 0;
  };

  const getDepositAmount = () => {
    return getServicePrice() * 0.5;
  };

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (selectedService !== "anamnese" && !selectedType) {
      toast.error("Por favor, selecione o tipo de atendimento");
      return;
    }

    setShowPayment(true);
  };

  const handlePayment = () => {
    // Simulate payment processing
    toast.success("Agendamento confirmado! Você receberá um email com os detalhes.");
    navigate("/profile");
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Agendar Consulta</h1>
            <p className="text-lg text-rose-nude-600">
              Escolha o serviço e horário que melhor se adequa às suas necessidades
            </p>
          </div>

          {!showPayment ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Booking Form */}
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800">Detalhes do Agendamento</CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Preencha as informações para agendar sua consulta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-rose-nude-700">
                      Serviço *
                    </label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="border-rose-nude-200">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>{service.name}</span>
                              <span className="text-rose-nude-600 ml-4">
                                {service.price ? 
                                  `R$ ${service.price}` : 
                                  `R$ ${service.priceOnline} - R$ ${service.pricePresencial}`
                                }
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Selection (only if not anamnese) */}
                  {selectedService && selectedService !== "anamnese" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-rose-nude-700">
                        Tipo de Atendimento *
                      </label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="border-rose-nude-200">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">
                            Online - R$ {selectedServiceData?.priceOnline}
                          </SelectItem>
                          <SelectItem value="presencial">
                            Presencial - R$ {selectedServiceData?.pricePresencial}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-rose-nude-700">
                      Data *
                    </label>
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
                          {selectedDate ? (
                            format(selectedDate, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => 
                            date < new Date() || !isWeekday(date)
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-rose-nude-600">
                      Disponível apenas em dias úteis após às 18h
                    </p>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-rose-nude-700">
                      Horário *
                    </label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="border-rose-nude-200">
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleBooking}
                    className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                    disabled={!selectedService || !selectedDate || !selectedTime}
                  >
                    Continuar para Pagamento
                  </Button>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800">Resumo do Agendamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-rose-nude-600">Paciente</p>
                    <p className="font-medium text-rose-nude-800">{user.name}</p>
                  </div>

                  {selectedService && (
                    <div className="space-y-2">
                      <p className="text-sm text-rose-nude-600">Serviço</p>
                      <p className="font-medium text-rose-nude-800">
                        {selectedServiceData?.name}
                      </p>
                      <p className="text-sm text-rose-nude-600">
                        {selectedServiceData?.description}
                      </p>
                    </div>
                  )}

                  {selectedType && (
                    <div className="space-y-2">
                      <p className="text-sm text-rose-nude-600">Tipo</p>
                      <p className="font-medium text-rose-nude-800 capitalize">
                        {selectedType}
                      </p>
                    </div>
                  )}

                  {selectedDate && (
                    <div className="space-y-2">
                      <p className="text-sm text-rose-nude-600">Data</p>
                      <p className="font-medium text-rose-nude-800">
                        {format(selectedDate, "PPP", { locale: ptBR })}
                      </p>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="space-y-2">
                      <p className="text-sm text-rose-nude-600">Horário</p>
                      <p className="font-medium text-rose-nude-800">{selectedTime}</p>
                    </div>
                  )}

                  {selectedService && (
                    <div className="pt-4 border-t border-rose-nude-200 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-rose-nude-600">Valor total:</span>
                        <span className="font-medium text-rose-nude-800">
                          R$ {getServicePrice().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-rose-nude-600">Pagamento antecipado (50%):</span>
                        <span className="font-bold text-rose-nude-800">
                          R$ {getDepositAmount().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Payment Section */
            <Card className="max-w-md mx-auto border-rose-nude-200">
              <CardHeader className="text-center">
                <CardTitle className="text-rose-nude-800 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pagamento via PIX
                </CardTitle>
                <CardDescription className="text-rose-nude-600">
                  Pague 50% do valor agora para confirmar seu agendamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="w-48 h-48 bg-rose-nude-100 border-2 border-dashed border-rose-nude-300 rounded-lg mx-auto flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-rose-nude-200 rounded-lg mx-auto mb-2"></div>
                      <p className="text-sm text-rose-nude-600">QR Code PIX</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-2xl text-rose-nude-800">
                      R$ {getDepositAmount().toFixed(2)}
                    </p>
                    <p className="text-sm text-rose-nude-600">
                      Chave PIX: <strong>contato@daianemotta.com</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-rose-nude-50 p-4 rounded-lg border border-rose-nude-200">
                  <h4 className="font-medium text-rose-nude-800 mb-2">Instruções:</h4>
                  <ul className="text-sm text-rose-nude-600 space-y-1">
                    <li>• Escaneie o QR Code ou use a chave PIX</li>
                    <li>• Confirme o valor de R$ {getDepositAmount().toFixed(2)}</li>
                    <li>• Após o pagamento, clique em "Confirmar Pagamento"</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handlePayment}
                    className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                  >
                    Confirmar Pagamento
                  </Button>
                  <Button 
                    onClick={() => setShowPayment(false)}
                    variant="outline"
                    className="w-full border-rose-nude-300 text-rose-nude-700"
                  >
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
