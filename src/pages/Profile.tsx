
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Calendar, Clock, MapPin, CreditCard, User, Phone, Mail } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  // Mock appointments data
  const appointments = [
    {
      id: 1,
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
      service: "Acompanhamento Quinzenal",
      type: "Online",
      date: "2024-04-03",
      time: "18:30",
      status: "agendado",
      price: 280,
      paid: 140
    }
  ];

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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Meu Perfil</h1>
            <p className="text-lg text-rose-nude-600">
              Gerencie suas informações e consultas agendadas
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-rose-nude-600">Nome</p>
                  <p className="font-medium text-rose-nude-800">{user.name}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-rose-nude-600 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </p>
                  <p className="font-medium text-rose-nude-800">{user.email}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-rose-nude-600 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Telefone
                  </p>
                  <p className="font-medium text-rose-nude-800">{user.phone}</p>
                </div>
                
                {user.cpf && (
                  <div className="space-y-2">
                    <p className="text-sm text-rose-nude-600">CPF</p>
                    <p className="font-medium text-rose-nude-800">{user.cpf}</p>
                  </div>
                )}

                <div className="pt-4">
                  <Badge variant="secondary" className="bg-rose-nude-100 text-rose-nude-800">
                    {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Appointments */}
            <div className="lg:col-span-2">
              <Card className="border-rose-nude-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-rose-nude-800 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Minhas Consultas
                    </CardTitle>
                    <CardDescription className="text-rose-nude-600">
                      Histórico e próximas consultas agendadas
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => navigate('/booking')}
                    className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                  >
                    Nova Consulta
                  </Button>
                </CardHeader>
                <CardContent>
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map(appointment => (
                        <div key={appointment.id} className="border border-rose-nude-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-rose-nude-800">{appointment.service}</h4>
                              <p className="text-sm text-rose-nude-600">{appointment.type}</p>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-rose-nude-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(appointment.date).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="flex items-center text-rose-nude-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {appointment.time}
                            </div>
                            <div className="flex items-center text-rose-nude-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {appointment.type}
                            </div>
                            <div className="flex items-center text-rose-nude-600">
                              <CreditCard className="w-4 h-4 mr-2" />
                              R$ {appointment.paid} / R$ {appointment.price}
                            </div>
                          </div>

                          {appointment.type === 'Presencial' && (
                            <div className="mt-3 p-3 bg-rose-nude-50 rounded-lg border border-rose-nude-200">
                              <p className="text-sm text-rose-nude-700">
                                <strong>Local:</strong> Av Cardoso Moreira, 193 - Centro, Itaperuna-RJ<br />
                                Edifício Rotary, 2º andar, sala 208
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-rose-nude-300 mx-auto mb-4" />
                      <p className="text-rose-nude-600 mb-4">Você ainda não tem consultas agendadas</p>
                      <Button 
                        onClick={() => navigate('/booking')}
                        className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white"
                      >
                        Agendar Primeira Consulta
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Important Info */}
          <Card className="mt-8 border-rose-nude-200 bg-rose-nude-50">
            <CardHeader>
              <CardTitle className="text-rose-nude-800">Políticas Importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-rose-nude-700">
              <p>• Remarcações devem ser feitas com 48h de antecedência</p>
              <p>• Faltas ou atrasos injustificáveis não têm reembolso</p>
              <p>• O pagamento de 50% é obrigatório no ato do agendamento</p>
              <p>• Em caso de dúvidas, entre em contato conosco</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
