import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Video, MapPin, User, Phone, Mail, CheckCircle, X, Edit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import CreateAppointmentModal from "./CreateAppointmentModal";

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  type: string | null;
  status: string | null;
  notes: string | null;
  user_id: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    phone: string | null;
  } | null;
}

const AppointmentsManager = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('AppointmentsManager: Fetching all appointments for admin');
      
      // Buscar todos os agendamentos
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      console.log('AppointmentsManager: Query result:', { appointmentsData, appointmentsError });

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        toast.error("Erro ao carregar agendamentos");
        return;
      }

      // Depois buscar os perfis dos usuários
      const userIds = appointmentsData?.map(app => app.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, phone')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combinar os dados
      const appointmentsWithProfiles = appointmentsData?.map(appointment => ({
        ...appointment,
        profiles: profilesData?.find(profile => profile.id === appointment.user_id) || null
      })) || [];

      setAppointments(appointmentsWithProfiles);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error updating appointment:', error);
        toast.error("Erro ao atualizar status do agendamento");
        return;
      }

      toast.success("Status atualizado com sucesso!");
      fetchAppointments();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Erro ao atualizar status do agendamento");
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'realizado': return 'bg-purple-100 text-purple-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  const filteredAppointments = appointments.filter(appointment => 
    statusFilter === "all" || appointment.status === statusFilter
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-rose-nude-800">Gerenciar Agendamentos</h2>
          <p className="text-rose-nude-600">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Gerenciar Agendamentos</h2>
        <p className="text-rose-nude-600">Visualize e gerencie todos os agendamentos dos pacientes.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="agendado">Agendado</SelectItem>
            <SelectItem value="confirmado">Confirmado</SelectItem>
            <SelectItem value="realizado">Realizado</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <CreateAppointmentModal onAppointmentCreated={fetchAppointments} />
          
          <Button 
            onClick={fetchAppointments}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Atualizar Lista
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAppointments.length === 0 ? (
          <Card className="border-rose-nude-200">
            <CardContent className="py-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-rose-nude-400 mb-4" />
              <p className="text-rose-nude-600">
                Nenhum agendamento encontrado para o filtro selecionado
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="border-rose-nude-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col space-y-4">
                  {/* Header com serviço e status */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-rose-nude-800">
                        {appointment.service}
                      </h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status || 'agendado'}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select 
                        value={appointment.status || 'agendado'} 
                        onValueChange={(newStatus) => updateAppointmentStatus(appointment.id, newStatus)}
                      >
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agendado">Agendado</SelectItem>
                          <SelectItem value="confirmado">Confirmado</SelectItem>
                          <SelectItem value="realizado">Realizado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Informações do agendamento */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-rose-nude-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-nude-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(appointment.time)}</span>
                    </div>
                    {appointment.type && (
                      <div className="flex items-center gap-2 text-rose-nude-600">
                        {appointment.type === 'online' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span>{appointment.type === 'online' ? 'Online' : 'Presencial'}</span>
                      </div>
                    )}
                  </div>

                  {/* Informações do paciente */}
                  <div className="p-3 bg-rose-nude-50 rounded-lg">
                    <h4 className="font-medium text-rose-nude-800 mb-2">Informações do Paciente</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-rose-nude-600">
                        <User className="w-4 h-4" />
                        <span>{appointment.profiles?.full_name || 'Nome não informado'}</span>
                      </div>
                      {appointment.profiles?.phone && (
                        <div className="flex items-center gap-2 text-rose-nude-600">
                          <Phone className="w-4 h-4" />
                          <span>{appointment.profiles.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Observações */}
                  {appointment.notes && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-medium text-amber-800 mb-1">Observações:</h4>
                      <p className="text-sm text-amber-700">{appointment.notes}</p>
                    </div>
                  )}

                  {/* Data de criação */}
                  <div className="text-xs text-gray-500 border-t pt-2">
                    Agendado em: {new Date(appointment.created_at).toLocaleString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentsManager;