
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Users, Calendar, Settings, DollarSign, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  // Mock data
  const [clients] = useState([
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "(22) 99999-9999",
      cpf: "123.456.789-00",
      appointments: 3,
      lastAppointment: "2024-03-15"
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao@email.com",
      phone: "(22) 98888-8888",
      cpf: "987.654.321-00",
      appointments: 1,
      lastAppointment: "2024-03-10"
    }
  ]);

  const [appointments] = useState([
    {
      id: 1,
      client: "Maria Silva",
      service: "Anamnese",
      type: "Presencial",
      date: "2024-03-20",
      time: "19:00",
      status: "confirmado",
      price: 160,
      paid: 80
    },
    {
      id: 2,
      client: "João Santos",
      service: "Acompanhamento Quinzenal",
      type: "Online",
      date: "2024-03-22",
      time: "18:30",
      status: "agendado",
      price: 280,
      paid: 140
    }
  ]);

  const [settings, setSettings] = useState({
    anamnese: 160,
    quinzenalOnline: 280,
    quinzenalPresencial: 300,
    mensalOnline: 380,
    mensalPresencial: 400,
    isoladoOnline: 120,
    isoladoPresencial: 150,
    address: "Av Cardoso Moreira, 193, Centro, Itaperuna -RJ CEP 28300-000",
    building: "Edifício Rotary, 2º andar, sala 208",
    startTime: "18:00",
    endTime: "21:00"
  });

  const handleSettingsUpdate = () => {
    toast.success("Configurações atualizadas com sucesso!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
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
              Gerencie clientes, agendamentos e configurações
            </p>
          </div>

          <Tabs defaultValue="clients" className="space-y-6">
            <TabsList className="grid w-full lg:w-fit lg:grid-cols-4 bg-rose-nude-100">
              <TabsTrigger value="clients" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="appointments" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Agendamentos
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                Financeiro
              </TabsTrigger>
            </TabsList>

            {/* Clients Tab */}
            <TabsContent value="clients">
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Clientes Cadastrados
                  </CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Lista de todos os clientes registrados na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clients.map(client => (
                      <div key={client.id} className="border border-rose-nude-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <p className="font-semibold text-rose-nude-800">{client.name}</p>
                            <p className="text-sm text-rose-nude-600">{client.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-rose-nude-600">Telefone</p>
                            <p className="font-medium text-rose-nude-800">{client.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-rose-nude-600">CPF</p>
                            <p className="font-medium text-rose-nude-800">{client.cpf}</p>
                          </div>
                          <div>
                            <p className="text-sm text-rose-nude-600">Consultas</p>
                            <p className="font-medium text-rose-nude-800">{client.appointments}</p>
                            <p className="text-xs text-rose-nude-600">
                              Última: {new Date(client.lastAppointment).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendamentos
                  </CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Todos os agendamentos da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map(appointment => (
                      <div key={appointment.id} className="border border-rose-nude-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-rose-nude-800">{appointment.client}</h4>
                            <p className="text-sm text-rose-nude-600">{appointment.service} - {appointment.type}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-rose-nude-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(appointment.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center text-rose-nude-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center text-rose-nude-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            R$ {appointment.price}
                          </div>
                          <div className="flex items-center text-rose-nude-600">
                            Pago: R$ {appointment.paid}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-rose-nude-200">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Valores dos Serviços
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-rose-nude-700">Anamnese</Label>
                      <Input
                        type="number"
                        value={settings.anamnese}
                        onChange={(e) => setSettings(prev => ({ ...prev, anamnese: Number(e.target.value) }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Quinzenal Online</Label>
                        <Input
                          type="number"
                          value={settings.quinzenalOnline}
                          onChange={(e) => setSettings(prev => ({ ...prev, quinzenalOnline: Number(e.target.value) }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Quinzenal Presencial</Label>
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
                        <Label className="text-rose-nude-700">Mensal Online</Label>
                        <Input
                          type="number"
                          value={settings.mensalOnline}
                          onChange={(e) => setSettings(prev => ({ ...prev, mensalOnline: Number(e.target.value) }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Mensal Presencial</Label>
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
                        <Label className="text-rose-nude-700">Isolado Online</Label>
                        <Input
                          type="number"
                          value={settings.isoladoOnline}
                          onChange={(e) => setSettings(prev => ({ ...prev, isoladoOnline: Number(e.target.value) }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Isolado Presencial</Label>
                        <Input
                          type="number"
                          value={settings.isoladoPresencial}
                          onChange={(e) => setSettings(prev => ({ ...prev, isoladoPresencial: Number(e.target.value) }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-rose-nude-200">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800 flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Localização e Horários
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Início dos Atendimentos</Label>
                        <Input
                          type="time"
                          value={settings.startTime}
                          onChange={(e) => setSettings(prev => ({ ...prev, startTime: e.target.value }))}
                          className="border-rose-nude-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-rose-nude-700">Fim dos Atendimentos</Label>
                        <Input
                          type="time"
                          value={settings.endTime}
                          onChange={(e) => setSettings(prev => ({ ...prev, endTime: e.target.value }))}
                          className="border-rose-nude-200"
                        />
                      </div>
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

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-rose-nude-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-rose-nude-600">Receita Total</p>
                        <p className="text-2xl font-bold text-rose-nude-800">R$ 1.240</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-rose-nude-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-rose-nude-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-rose-nude-600">Clientes Ativos</p>
                        <p className="text-2xl font-bold text-rose-nude-800">12</p>
                      </div>
                      <Users className="w-8 h-8 text-rose-nude-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-rose-nude-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-rose-nude-600">Consultas Este Mês</p>
                        <p className="text-2xl font-bold text-rose-nude-800">8</p>
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
                        <p className="text-2xl font-bold text-rose-nude-800">75%</p>
                      </div>
                      <Clock className="w-8 h-8 text-rose-nude-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
