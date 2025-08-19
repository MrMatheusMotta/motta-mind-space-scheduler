import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Video, MapPin, History, ArrowLeft, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  type: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
}

const MyAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, [user, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching appointments for user:', user?.id);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: true });

      console.log('Appointments query result:', { data, error, userExists: !!user });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast.error("Erro ao carregar agendamentos");
        return;
      }

      console.log('Appointments fetched successfully:', data);
      setAppointments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'realizado': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelado' })
        .eq('id', appointmentId)
        .eq('user_id', user?.id); // Garantir que só pode cancelar próprios agendamentos

      if (error) {
        console.error('Error canceling appointment:', error);
        toast.error("Erro ao cancelar agendamento");
        return;
      }

      toast.success("Agendamento cancelado com sucesso!");
      fetchAppointments(); // Recarregar lista
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao cancelar agendamento");
    }
  };

  const isUpcoming = (appointment: Appointment) => {
    const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
    return appointmentDate >= new Date() && appointment.status !== 'realizado' && appointment.status !== 'cancelado';
  };

  const upcomingAppointments = appointments.filter(isUpcoming);
  const historyAppointments = appointments.filter(app => !isUpcoming(app));

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-rose-nude-200 text-rose-nude-600 hover:bg-rose-nude-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Meus Agendamentos</h1>
              <p className="text-lg text-rose-nude-600">
                Acompanhe suas consultas e histórico de atendimentos
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6">
            <Button
              onClick={() => setActiveTab('upcoming')}
              variant={activeTab === 'upcoming' ? 'default' : 'outline'}
              className={activeTab === 'upcoming' 
                ? 'bg-rose-nude-500 hover:bg-rose-nude-600' 
                : 'border-rose-nude-200 text-rose-nude-600 hover:bg-rose-nude-50'
              }
            >
              <Calendar className="w-4 h-4 mr-2" />
              Próximas Consultas ({upcomingAppointments.length})
            </Button>
            <Button
              onClick={() => setActiveTab('history')}
              variant={activeTab === 'history' ? 'default' : 'outline'}
              className={activeTab === 'history' 
                ? 'bg-rose-nude-500 hover:bg-rose-nude-600' 
                : 'border-rose-nude-200 text-rose-nude-600 hover:bg-rose-nude-50'
              }
            >
              <History className="w-4 h-4 mr-2" />
              Histórico ({historyAppointments.length})
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-rose-nude-600">Carregando agendamentos...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'upcoming' ? (
                upcomingAppointments.length === 0 ? (
                  <Card className="border-rose-nude-200">
                    <CardContent className="py-8 text-center">
                      <Calendar className="w-12 h-12 mx-auto text-rose-nude-400 mb-4" />
                      <p className="text-rose-nude-600">Nenhuma consulta agendada</p>
                      <Button
                        onClick={() => navigate("/booking")}
                        className="mt-4 bg-rose-nude-500 hover:bg-rose-nude-600"
                      >
                        Agendar Consulta
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id} className="border-rose-nude-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-rose-nude-800">
                                {appointment.service}
                              </h3>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status || 'agendado'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-rose-nude-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(appointment.date)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {formatTime(appointment.time)}
                              </div>
                              {appointment.type && (
                                <div className="flex items-center gap-2">
                                  {appointment.type === 'online' ? (
                                    <Video className="w-4 h-4" />
                                  ) : (
                                    <MapPin className="w-4 h-4" />
                                  )}
                                  {appointment.type === 'online' ? 'Online' : 'Presencial'}
                                </div>
                              )}
                            </div>
                            
                            {appointment.notes && (
                              <p className="text-sm text-rose-nude-600 bg-rose-nude-50 p-3 rounded">
                                <strong>Observações:</strong> {appointment.notes}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            {appointment.type === 'online' && appointment.status === 'confirmado' && (
                              <Button
                                onClick={() => navigate("/videocall")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Entrar na Consulta
                              </Button>
                            )}
                            
                            {(appointment.status === 'agendado' || appointment.status === 'confirmado') && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancelar
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                                      Cancelar Consulta
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="space-y-2">
                                      <p>Tem certeza de que deseja cancelar esta consulta?</p>
                                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-sm text-amber-800 font-medium">
                                          ⚠️ <strong>Importante:</strong> O valor do adiantamento pago não será reembolsado conforme nossa política de cancelamento.
                                        </p>
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        <p><strong>Consulta:</strong> {appointment.service}</p>
                                        <p><strong>Data:</strong> {formatDate(appointment.date)}</p>
                                        <p><strong>Horário:</strong> {formatTime(appointment.time)}</p>
                                      </div>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Manter Consulta</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => cancelAppointment(appointment.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Sim, Cancelar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )
              ) : (
                historyAppointments.length === 0 ? (
                  <Card className="border-rose-nude-200">
                    <CardContent className="py-8 text-center">
                      <History className="w-12 h-12 mx-auto text-rose-nude-400 mb-4" />
                      <p className="text-rose-nude-600">Nenhum histórico de consultas</p>
                    </CardContent>
                  </Card>
                ) : (
                  historyAppointments.map((appointment) => (
                    <Card key={appointment.id} className="border-rose-nude-200">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-rose-nude-800">
                                {appointment.service}
                              </h3>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status || 'agendado'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-rose-nude-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(appointment.date)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {formatTime(appointment.time)}
                              </div>
                              {appointment.type && (
                                <div className="flex items-center gap-2">
                                  {appointment.type === 'online' ? (
                                    <Video className="w-4 h-4" />
                                  ) : (
                                    <MapPin className="w-4 h-4" />
                                  )}
                                  {appointment.type === 'online' ? 'Online' : 'Presencial'}
                                </div>
                              )}
                            </div>
                            
                            {appointment.notes && (
                              <p className="text-sm text-rose-nude-600 bg-rose-nude-50 p-3 rounded">
                                <strong>Observações:</strong> {appointment.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;