import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Users, Calendar, Settings, DollarSign, MapPin, Clock, Edit, Trash2, Eye, Phone, Mail, FileText, Image, Save } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  // Mock data expandido
  const [clients] = useState([
    {
      id: 1,
      name: "Maria Silva Santos",
      email: "maria.silva@email.com",
      phone: "(22) 99999-9999",
      cpf: "123.456.789-00",
      birthDate: "1985-03-15",
      address: "Rua das Flores, 123 - Centro, Itaperuna-RJ",
      appointments: 8,
      lastAppointment: "2024-03-15",
      totalSpent: 1240,
      status: "ativo"
    },
    {
      id: 2,
      name: "João Pedro Santos",
      email: "joao.santos@email.com",
      phone: "(22) 98888-8888",
      cpf: "987.654.321-00",
      birthDate: "1990-07-22",
      address: "Av. Principal, 456 - Niterói, Itaperuna-RJ",
      appointments: 3,
      lastAppointment: "2024-03-10",
      totalSpent: 480,
      status: "ativo"
    },
    {
      id: 3,
      name: "Ana Costa Oliveira",
      email: "ana.costa@email.com",
      phone: "(22) 97777-7777",
      cpf: "456.789.123-00",
      birthDate: "1988-11-08",
      address: "Rua da Paz, 789 - Jardim Bela Vista, Itaperuna-RJ",
      appointments: 12,
      lastAppointment: "2024-03-18",
      totalSpent: 1920,
      status: "ativo"
    }
  ]);

  const [appointments] = useState([
    {
      id: 1,
      client: "Maria Silva Santos",
      clientId: 1,
      service: "Anamnese",
      type: "Presencial",
      date: "2024-03-20",
      time: "19:00",
      status: "confirmado",
      price: 160,
      paid: 80,
      paymentMethod: "PIX",
      notes: "Primeira consulta - ansiedade"
    },
    {
      id: 2,
      client: "João Pedro Santos",
      clientId: 2,
      service: "Acompanhamento Quinzenal",
      type: "Online",
      date: "2024-03-22",
      time: "18:30",
      status: "agendado",
      price: 280,
      paid: 140,
      paymentMethod: "PIX",
      notes: "Sessão de acompanhamento"
    },
    {
      id: 3,
      client: "Ana Costa Oliveira",
      clientId: 3,
      service: "Acompanhamento Mensal",
      type: "Presencial",
      date: "2024-03-25",
      time: "20:00",
      status: "confirmado",
      price: 400,
      paid: 200,
      paymentMethod: "PIX",
      notes: "Terapia cognitivo-comportamental"
    }
  ]);

  const [settings, setSettings] = useState({
    // Valores dos serviços
    anamnese: 160,
    quinzenalOnline: 280,
    quinzenalPresencial: 300,
    mensalOnline: 380,
    mensalPresencial: 400,
    isoladoOnline: 120,
    isoladoPresencial: 150,
    
    // Informações da clínica
    address: "Av Cardoso Moreira, 193, Centro, Itaperuna -RJ CEP 28300-000",
    building: "Edifício Rotary, 2º andar, sala 208",
    phone: "(22) 99972-3737",
    email: "psicologadaianesilva@outlook.com",
    crp: "CRP-RJ 52221",
    
    // Horários de funcionamento
    startTime: "18:00",
    endTime: "21:00",
    workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    
    // Configurações de pagamento
    pixKey: "12345678900",
    pixKeyType: "cpf",
    pixQrCode: "",
    anticipationPercentage: 50,
    
    // Configurações de agendamento
    slotDuration: 60,
    bufferTime: 0,
    maxAdvanceDays: 30,
    
    // Mensagens automáticas
    confirmationMessage: "Sua consulta foi confirmada! Nos vemos em breve.",
    reminderMessage: "Lembrete: Você tem uma consulta agendada para amanhã às {time}.",
    cancellationMessage: "Sua consulta foi cancelada. Entre em contato para reagendar."
  });

  // Content management state
  const [siteContent, setSiteContent] = useState({
    heroTitle: "Terapia Cognitiva Comportamental",
    heroSubtitle: "Transforme sua vida com acompanhamento profissional especializado em TCC",
    aboutTitle: "Sobre Daiane Motta",
    aboutDescription: "Terapeuta Cognitiva Comportamental (TCC) especializada em ansiedade, depressão e transtornos do humor.",
    aboutExperience: "5+ anos de experiência",
    aboutSpecialties: "Ansiedade, Depressão, Autoestima, Relacionamentos",
    aboutEducation: "Formação em Terapia Cognitiva Comportamental",
    servicesTitle: "Nossos Serviços",
    testimonialsTitle: "Depoimentos de Pacientes"
  });

  const [images, setImages] = useState({
    heroImage: "",
    aboutImage: "",
    serviceImages: ["", "", ""]
  });

  // Configurações específicas para horários
  const [scheduleSettings, setScheduleSettings] = useState({
    monday: { enabled: true, start: "18:00", end: "21:00", slots: ["18:00", "19:00", "20:00"] },
    tuesday: { enabled: true, start: "18:00", end: "21:00", slots: ["18:00", "19:00", "20:00"] },
    wednesday: { enabled: true, start: "18:00", end: "21:00", slots: ["18:00", "19:00", "20:00"] },
    thursday: { enabled: true, start: "18:00", end: "21:00", slots: ["18:00", "19:00", "20:00"] },
    friday: { enabled: true, start: "18:00", end: "21:00", slots: ["18:00", "19:00", "20:00"] },
    saturday: { enabled: false, start: "09:00", end: "12:00", slots: [] },
    sunday: { enabled: false, start: "09:00", end: "12:00", slots: [] }
  });

  const handleSettingsUpdate = () => {
    toast.success("Configurações atualizadas com sucesso!");
  };

  const handleContentUpdate = () => {
    toast.success("Conteúdo do site atualizado com sucesso!");
  };

  const handleImageUpload = (section: string, index?: number) => {
    // Simulate image upload
    toast.success("Imagem carregada com sucesso!");
  };

  const handleScheduleUpdate = () => {
    toast.success("Horários atualizados com sucesso!");
  };

  const addTimeSlot = (day: string, time: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        slots: [...prev[day as keyof typeof prev].slots, time].sort()
      }
    }));
  };

  const removeTimeSlot = (day: string, time: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        slots: prev[day as keyof typeof prev].slots.filter(slot => slot !== time)
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      case 'concluido': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClientStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Painel Administrativo</h1>
            <p className="text-lg text-rose-nude-600">
              Gerencie clientes, agendamentos, horários, valores e conteúdo do site
            </p>
          </div>

          <Tabs defaultValue="clients" className="space-y-6">
            <TabsList className="grid w-full lg:w-fit lg:grid-cols-7 bg-rose-nude-100">
              <TabsTrigger value="clients" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="appointments" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Agendamentos
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <Clock className="w-4 h-4 mr-2" />
                Horários
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Pagamento
              </TabsTrigger>
              <TabsTrigger value="financial" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Financeiro
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" />
                Conteúdo
              </TabsTrigger>
            </TabsList>

            {/* Clients Tab */}
            <TabsContent value="clients">
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Clientes Cadastrados ({clients.length})
                    </div>
                    <Button className="bg-rose-nude-500 hover:bg-rose-nude-600">
                      Novo Cliente
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Gestão completa da base de clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Consultas</TableHead>
                        <TableHead>Última Consulta</TableHead>
                        <TableHead>Total Gasto</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map(client => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-rose-nude-800">{client.name}</p>
                              <p className="text-sm text-rose-nude-600">CPF: {client.cpf}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Phone className="w-4 h-4 mr-1" />
                                {client.phone}
                              </div>
                              <div className="flex items-center text-sm">
                                <Mail className="w-4 h-4 mr-1" />
                                {client.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{client.appointments}</TableCell>
                          <TableCell>
                            {new Date(client.lastAppointment).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="font-medium">
                            R$ {client.totalSpent.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Badge className={getClientStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Agendamentos ({appointments.length})
                    </div>
                    <Button className="bg-rose-nude-500 hover:bg-rose-nude-600">
                      Novo Agendamento
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Controle total dos agendamentos da clínica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map(appointment => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-rose-nude-800">{appointment.client}</p>
                              <p className="text-sm text-rose-nude-600">{appointment.notes}</p>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>
                            <div>
                              <p>{new Date(appointment.date).toLocaleDateString('pt-BR')}</p>
                              <p className="text-sm text-rose-nude-600">{appointment.time}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{appointment.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">R$ {appointment.price}</p>
                              <p className="text-sm text-green-600">Pago: R$ {appointment.paid}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              {appointment.paymentMethod}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Nova aba de Horários */}
            <TabsContent value="schedule">
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Gestão de Horários de Atendimento
                  </CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Configure os dias e horários disponíveis para agendamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(scheduleSettings).map(([day, config]) => (
                    <Card key={day} className="border-rose-nude-100">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg capitalize text-rose-nude-800">
                            {day === 'monday' ? 'Segunda-feira' :
                             day === 'tuesday' ? 'Terça-feira' :
                             day === 'wednesday' ? 'Quarta-feira' :
                             day === 'thursday' ? 'Quinta-feira' :
                             day === 'friday' ? 'Sexta-feira' :
                             day === 'saturday' ? 'Sábado' : 'Domingo'}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Ativo</Label>
                            <input
                              type="checkbox"
                              checked={config.enabled}
                              onChange={(e) => setScheduleSettings(prev => ({
                                ...prev,
                                [day]: { ...config, enabled: e.target.checked }
                              }))}
                              className="rounded"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      {config.enabled && (
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm text-rose-nude-700">Início</Label>
                              <Input
                                type="time"
                                value={config.start}
                                onChange={(e) => setScheduleSettings(prev => ({
                                  ...prev,
                                  [day]: { ...config, start: e.target.value }
                                }))}
                                className="border-rose-nude-200"
                              />
                            </div>
                            <div>
                              <Label className="text-sm text-rose-nude-700">Fim</Label>
                              <Input
                                type="time"
                                value={config.end}
                                onChange={(e) => setScheduleSettings(prev => ({
                                  ...prev,
                                  [day]: { ...config, end: e.target.value }
                                }))}
                                className="border-rose-nude-200"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-rose-nude-700 mb-2 block">
                              Horários Disponíveis ({config.slots.length})
                            </Label>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {config.slots.map((slot) => (
                                <Badge 
                                  key={slot} 
                                  variant="secondary" 
                                  className="bg-rose-nude-100 text-rose-nude-800 flex items-center gap-1"
                                >
                                  {slot}
                                  <button
                                    onClick={() => removeTimeSlot(day, slot)}
                                    className="ml-1 text-red-600 hover:text-red-800"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                type="time"
                                placeholder="Novo horário"
                                className="border-rose-nude-200 flex-1"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    const input = e.target as HTMLInputElement;
                                    if (input.value && !config.slots.includes(input.value)) {
                                      addTimeSlot(day, input.value);
                                      input.value = '';
                                    }
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                                  if (input?.value && !config.slots.includes(input.value)) {
                                    addTimeSlot(day, input.value);
                                    input.value = '';
                                  }
                                }}
                                className="bg-rose-nude-500 hover:bg-rose-nude-600"
                              >
                                Adicionar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                  
                  <div className="flex justify-center pt-4">
                    <Button 
                      onClick={handleScheduleUpdate}
                      className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white px-8"
                    >
                      Salvar Horários
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab atualizada */}
            <TabsContent value="settings">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Valores dos Serviços */}
                <Card className="border-rose-nude-200">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Valores dos Serviços
                    </CardTitle>
                    <CardDescription>
                      Ajuste os preços de todos os serviços oferecidos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Anamnese (R$)</Label>
                      <Input
                        type="number"
                        value={settings.anamnese}
                        onChange={(e) => setSettings(prev => ({ ...prev, anamnese: Number(e.target.value) }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Quinzenal Online (R$)</Label>
                        <Input
                          type="number"
                          value={settings.quinzenalOnline}
                          onChange={(e) => setSettings(prev => ({ ...prev, quinzenalOnline: Number(e.target.value) }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Quinzenal Presencial (R$)</Label>
                        <Input
                          type="number"
                          value={settings.quinzenalPresencial}
                          onChange={(e) => setSettings(prev => ({ ...prev, quinzenalPresencial: Number(e.target.value) }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Mensal Online (R$)</Label>
                        <Input
                          type="number"
                          value={settings.mensalOnline}
                          onChange={(e) => setSettings(prev => ({ ...prev, mensalOnline: Number(e.target.value) }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Mensal Presencial (R$)</Label>
                        <Input
                          type="number"
                          value={settings.mensalPresencial}
                          onChange={(e) => setSettings(prev => ({ ...prev, mensalPresencial: Number(e.target.value) }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Isolado Online (R$)</Label>
                        <Input
                          type="number"
                          value={settings.isoladoOnline}
                          onChange={(e) => setSettings(prev => ({ ...prev, isoladoOnline: Number(e.target.value) }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Isolado Presencial (R$)</Label>
                        <Input
                          type="number"
                          value={settings.isoladoPresencial}
                          onChange={(e) => setSettings(prev => ({ ...prev, isoladoPresencial: Number(e.target.value) }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Porcentagem de Antecipação (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.anticipationPercentage}
                        onChange={(e) => setSettings(prev => ({ ...prev, anticipationPercentage: Number(e.target.value) }))}
                        className="border-rose-nude-200"
                      />
                      <p className="text-xs text-rose-nude-600">
                        Valor que deve ser pago no ato do agendamento
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações da Clínica */}
                <Card className="border-rose-nude-200">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Informações da Clínica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">CRP</Label>
                      <Input
                        value={settings.crp}
                        onChange={(e) => setSettings(prev => ({ ...prev, crp: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Telefone</Label>
                      <Input
                        value={settings.phone}
                        onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">E-mail</Label>
                      <Input
                        value={settings.email}
                        onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Endereço</Label>
                      <Input
                        value={settings.address}
                        onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Edifício/Sala</Label>
                      <Input
                        value={settings.building}
                        onChange={(e) => setSettings(prev => ({ ...prev, building: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Duração das Consultas (min)</Label>
                      <Select value={settings.slotDuration.toString()} onValueChange={(value) => setSettings(prev => ({ ...prev, slotDuration: Number(value) }))}>
                        <SelectTrigger className="border-rose-nude-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="45">45 minutos</SelectItem>
                          <SelectItem value="60">60 minutos</SelectItem>
                          <SelectItem value="90">90 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Intervalo entre consultas (min)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={settings.bufferTime}
                        onChange={(e) => setSettings(prev => ({ ...prev, bufferTime: Number(e.target.value) }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Máximo de dias para agendamento</Label>
                      <Input
                        type="number"
                        min="1"
                        value={settings.maxAdvanceDays}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxAdvanceDays: Number(e.target.value) }))}
                        className="border-rose-nude-200"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleSettingsUpdate}
                  className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white px-8"
                >
                  Salvar Configurações
                </Button>
              </div>
            </TabsContent>

            {/* Nova aba de Pagamento */}
            <TabsContent value="payment">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-rose-nude-200">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800">Configurações PIX</CardTitle>
                    <CardDescription>
                      Configure a chave PIX e QR Code para pagamentos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Tipo de Chave PIX</Label>
                      <Select value={settings.pixKeyType} onValueChange={(value) => setSettings(prev => ({ ...prev, pixKeyType: value }))}>
                        <SelectTrigger className="border-rose-nude-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="cnpj">CNPJ</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="phone">Telefone</SelectItem>
                          <SelectItem value="random">Chave Aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Chave PIX</Label>
                      <Input
                        value={settings.pixKey}
                        onChange={(e) => setSettings(prev => ({ ...prev, pixKey: e.target.value }))}
                        className="border-rose-nude-200"
                        placeholder="Digite sua chave PIX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">QR Code PIX</Label>
                      <div className="border-2 border-dashed border-rose-nude-200 rounded-lg p-6 text-center">
                        {settings.pixQrCode ? (
                          <div className="space-y-2">
                            <img src={settings.pixQrCode} alt="QR Code PIX" className="mx-auto max-w-48" />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSettings(prev => ({ ...prev, pixQrCode: '' }))}
                            >
                              Remover QR Code
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Image className="w-12 h-12 mx-auto text-rose-nude-400" />
                            <p className="text-sm text-rose-nude-600">QR Code não configurado</p>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    setSettings(prev => ({ ...prev, pixQrCode: e.target?.result as string }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="border-rose-nude-200"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-rose-nude-200">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800">Mensagens Automáticas</CardTitle>
                    <CardDescription>
                      Configure as mensagens enviadas automaticamente
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Mensagem de Confirmação</Label>
                      <Textarea
                        value={settings.confirmationMessage}
                        onChange={(e) => setSettings(prev => ({ ...prev, confirmationMessage: e.target.value }))}
                        className="border-rose-nude-200"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Mensagem de Lembrete</Label>
                      <Textarea
                        value={settings.reminderMessage}
                        onChange={(e) => setSettings(prev => ({ ...prev, reminderMessage: e.target.value }))}
                        className="border-rose-nude-200"
                        rows={3}
                      />
                      <p className="text-xs text-rose-nude-600">
                        Use {"{time}"} para inserir o horário automaticamente
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Mensagem de Cancelamento</Label>
                      <Textarea
                        value={settings.cancellationMessage}
                        onChange={(e) => setSettings(prev => ({ ...prev, cancellationMessage: e.target.value }))}
                        className="border-rose-nude-200"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-rose-nude-200 mt-6">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800">Integração de Pagamento (Futuro)</CardTitle>
                  <CardDescription>
                    Configurações para integração automática de confirmação de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-rose-nude-50 p-4 rounded-lg border border-rose-nude-200">
                    <h4 className="font-medium text-rose-nude-800 mb-2">Recursos Planejados:</h4>
                    <ul className="text-sm text-rose-nude-600 space-y-1">
                      <li>• Integração com API de pagamento para confirmação automática</li>
                      <li>• Notificações em tempo real de pagamentos recebidos</li>
                      <li>• Geração automática de recibos</li>
                      <li>• Controle de inadimplência</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-rose-nude-700">API de Pagamento</Label>
                    <Select disabled>
                      <SelectTrigger className="border-rose-nude-200">
                        <SelectValue placeholder="Em desenvolvimento..." />
                      </SelectTrigger>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-rose-nude-700">Token de Integração</Label>
                    <Input
                      placeholder="Token será configurado futuramente"
                      disabled
                      className="border-rose-nude-200"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center mt-6">
                <Button 
                  onClick={() => toast.success("Configurações de pagamento salvas!")}
                  className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white px-8"
                >
                  Salvar Configurações de Pagamento
                </Button>
              </div>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="border-rose-nude-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-rose-nude-600">Receita Total</p>
                        <p className="text-2xl font-bold text-rose-nude-800">R$ 3.640</p>
                        <p className="text-sm text-green-600">+15% este mês</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-rose-nude-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-rose-nude-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-rose-nude-600">Pagamentos Pendentes</p>
                        <p className="text-2xl font-bold text-rose-nude-800">R$ 420</p>
                        <p className="text-sm text-yellow-600">3 clientes</p>
                      </div>
                      <Clock className="w-8 h-8 text-rose-nude-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-rose-nude-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-rose-nude-600">Consultas Este Mês</p>
                        <p className="text-2xl font-bold text-rose-nude-800">23</p>
                        <p className="text-sm text-green-600">+8% vs mês anterior</p>
                      </div>
                      <Calendar className="w-8 h-8 text-rose-nude-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-rose-nude-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-rose-nude-600">Taxa de Ocupação</p>
                        <p className="text-2xl font-bold text-rose-nude-800">87%</p>
                        <p className="text-sm text-green-600">Excelente</p>
                      </div>
                      <Users className="w-8 h-8 text-rose-nude-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800">Relatório Financeiro Detalhado</CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Acompanhe o desempenho financeiro da clínica
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Valor Pago</TableHead>
                        <TableHead>Pendente</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map(appointment => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">{appointment.client}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>{new Date(appointment.date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="font-medium">R$ {appointment.price}</TableCell>
                          <TableCell className="text-green-600">R$ {appointment.paid}</TableCell>
                          <TableCell className="text-orange-600">
                            R$ {appointment.price - appointment.paid}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Management Tab */}
            <TabsContent value="content">
              <div className="space-y-6">
                {/* Hero Section */}
                <Card className="border-rose-nude-200">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Seção Principal (Hero)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Título Principal</Label>
                      <Input
                        value={siteContent.heroTitle}
                        onChange={(e) => setSiteContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Subtítulo</Label>
                      <Textarea
                        value={siteContent.heroSubtitle}
                        onChange={(e) => setSiteContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Imagem Principal</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="file" accept="image/*" className="border-rose-nude-200" />
                        <Button onClick={() => handleImageUpload('hero')} size="sm">
                          <Image className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* About Section */}
                <Card className="border-rose-nude-200">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800">Seção Sobre Mim</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Título</Label>
                      <Input
                        value={siteContent.aboutTitle}
                        onChange={(e) => setSiteContent(prev => ({ ...prev, aboutTitle: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Descrição</Label>
                      <Textarea
                        value={siteContent.aboutDescription}
                        onChange={(e) => setSiteContent(prev => ({ ...prev, aboutDescription: e.target.value }))}
                        className="border-rose-nude-200"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Experiência</Label>
                        <Input
                          value={siteContent.aboutExperience}
                          onChange={(e) => setSiteContent(prev => ({ ...prev, aboutExperience: e.target.value }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Especialidades</Label>
                        <Input
                          value={siteContent.aboutSpecialties}
                          onChange={(e) => setSiteContent(prev => ({ ...prev, aboutSpecialties: e.target.value }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Formação</Label>
                      <Textarea
                        value={siteContent.aboutEducation}
                        onChange={(e) => setSiteContent(prev => ({ ...prev, aboutEducation: e.target.value }))}
                        className="border-rose-nude-200"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Foto de Perfil</Label>
                      <div className="flex items-center space-x-2">
                        <Input type="file" accept="image/*" className="border-rose-nude-200" />
                        <Button onClick={() => handleImageUpload('about')} size="sm">
                          <Image className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Services Section */}
                <Card className="border-rose-nude-200">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800">Seção Serviços</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Título da Seção</Label>
                      <Input
                        value={siteContent.servicesTitle}
                        onChange={(e) => setSiteContent(prev => ({ ...prev, servicesTitle: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Imagens dos Serviços</Label>
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-sm text-rose-nude-600 min-w-[100px]">Serviço {index + 1}:</span>
                          <Input type="file" accept="image/*" className="border-rose-nude-200" />
                          <Button onClick={() => handleImageUpload('service', index)} size="sm">
                            <Image className="w-4 h-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Testimonials Section */}
                <Card className="border-rose-nude-200">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800">Seção Depoimentos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Título da Seção</Label>
                      <Input
                        value={siteContent.testimonialsTitle}
                        onChange={(e) => setSiteContent(prev => ({ ...prev, testimonialsTitle: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button 
                    onClick={handleContentUpdate}
                    className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white px-8"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações no Conteúdo
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
