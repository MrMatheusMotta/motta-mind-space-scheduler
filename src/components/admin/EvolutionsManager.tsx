import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Evolution {
  id: string;
  appointment_id: string;
  user_id: string;
  notes: string;
  created_at: string;
  created_by: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  user_id: string;
  status: string;
}

const EvolutionsManager = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAppointments();
    fetchEvolutions();
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name');

    if (!error && data) {
      const profileMap = data.reduce((acc, p) => {
        acc[p.id] = p.full_name || 'Sem nome';
        return acc;
      }, {} as Record<string, string>);
      setProfiles(profileMap);
    }
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .in('status', ['confirmado', 'concluido'])
      .order('date', { ascending: false })
      .order('time', { ascending: false });

    if (error) {
      console.error('Erro ao buscar agendamentos:', error);
      toast.error("Erro ao carregar agendamentos");
      return;
    }

    setAppointments(data || []);
  };

  const fetchEvolutions = async () => {
    const { data, error } = await supabase
      .from('evolutions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar evoluções:', error);
      return;
    }

    setEvolutions(data || []);
  };

  const handleSaveEvolution = async () => {
    if (!selectedAppointment || !notes.trim()) {
      toast.error("Selecione um agendamento e escreva a evolução");
      return;
    }

    setLoading(true);

    try {
      const appointment = appointments.find(a => a.id === selectedAppointment);
      if (!appointment) {
        toast.error("Agendamento não encontrado");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const { error } = await supabase
        .from('evolutions')
        .insert({
          appointment_id: selectedAppointment,
          user_id: appointment.user_id,
          notes: notes.trim(),
          created_by: userData.user.id
        });

      if (error) {
        console.error('Erro ao salvar evolução:', error);
        toast.error("Erro ao salvar evolução");
        return;
      }

      toast.success("Evolução salva com sucesso!");
      setNotes("");
      setSelectedAppointment("");
      fetchEvolutions();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro ao salvar evolução");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-rose-nude-800 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Nova Evolução de Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Selecionar Consulta</Label>
            <select
              value={selectedAppointment}
              onChange={(e) => setSelectedAppointment(e.target.value)}
              className="w-full border border-rose-nude-200 rounded-md p-2"
            >
              <option value="">Selecione uma consulta...</option>
              {appointments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {format(new Date(apt.date), "dd/MM/yyyy", { locale: ptBR })} - {apt.time} - {profiles[apt.user_id] || 'Carregando...'} - {apt.service}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Evolução da Consulta</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva a evolução do paciente durante a consulta..."
              className="min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleSaveEvolution}
            disabled={loading || !selectedAppointment || !notes.trim()}
            className="w-full bg-rose-nude-500 hover:bg-rose-nude-600"
          >
            {loading ? "Salvando..." : "Salvar Evolução"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-rose-nude-800">Histórico de Evoluções</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evolutions.length === 0 ? (
              <p className="text-center text-rose-nude-600 py-8">
                Nenhuma evolução registrada ainda
              </p>
            ) : (
              evolutions.map((evolution) => {
                const appointment = appointments.find(a => a.id === evolution.appointment_id);
                return (
                  <Card key={evolution.id} className="border-rose-nude-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-rose-nude-600">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{profiles[evolution.user_id] || 'Carregando...'}</span>
                          </div>
                          {appointment && (
                            <div className="flex items-center gap-2 text-sm text-rose-nude-600">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })} às {appointment.time}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-rose-nude-500">
                          {format(new Date(evolution.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <div className="mt-3 p-3 bg-rose-nude-50 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{evolution.notes}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvolutionsManager;
