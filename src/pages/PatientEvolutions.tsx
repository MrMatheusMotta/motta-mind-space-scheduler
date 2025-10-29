import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Calendar, User, FileText, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Evolution {
  id: string;
  appointment_id: string;
  user_id: string;
  notes: string;
  created_at: string;
  created_by: string;
  appointment?: {
    date: string;
    time: string;
    service: string;
  };
}

interface PatientProfile {
  id: string;
  full_name: string;
  phone: string;
  cpf: string;
}

const PatientEvolutions = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("userId");
  
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newNotes, setNewNotes] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }
    
    if (!isLoading && !isAdmin()) {
      toast.error("Acesso restrito a administradores");
      navigate("/");
      return;
    }

    if (!patientId) {
      toast.error("ID do paciente não fornecido");
      navigate("/my-appointments");
      return;
    }
  }, [user, isLoading, isAdmin, navigate, patientId]);

  useEffect(() => {
    if (user && isAdmin() && patientId) {
      fetchPatientData();
      fetchEvolutions();
      fetchAppointments();
    }
  }, [user, patientId]);

  const fetchPatientData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, cpf')
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do paciente:', error);
        toast.error("Erro ao carregar dados do paciente");
        return;
      }

      setPatient(data);
    } catch (error) {
      console.error('Erro:', error);
      toast.error("Erro ao carregar dados do paciente");
    }
  };

  const fetchEvolutions = async () => {
    try {
      setLoading(true);
      const { data: evolutionsData, error } = await supabase
        .from('evolutions')
        .select('*')
        .eq('user_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar evoluções:', error);
        toast.error("Erro ao carregar evoluções");
        return;
      }

      // Buscar appointments relacionados
      if (evolutionsData && evolutionsData.length > 0) {
        const appointmentIds = [...new Set(evolutionsData.map(e => e.appointment_id))];
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('id, date, time, service')
          .in('id', appointmentIds);

        // Combinar dados
        const evolutionsWithAppointments = evolutionsData.map(evo => ({
          ...evo,
          appointment: appointmentsData?.find(apt => apt.id === evo.appointment_id)
        }));

        setEvolutions(evolutionsWithAppointments);
      } else {
        setEvolutions([]);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error("Erro ao carregar evoluções");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, date, time, service, status')
        .eq('user_id', patientId)
        .in('status', ['realizado', 'confirmado'])
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSaveEvolution = async () => {
    if (!newNotes.trim()) {
      toast.error("Por favor, preencha as anotações da evolução");
      return;
    }

    if (!selectedAppointmentId) {
      toast.error("Por favor, selecione o agendamento relacionado");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('evolutions')
        .insert({
          appointment_id: selectedAppointmentId,
          user_id: patientId,
          notes: newNotes.trim(),
          created_by: user?.id
        });

      if (error) {
        console.error('Erro ao salvar evolução:', error);
        toast.error("Erro ao salvar evolução");
        return;
      }

      toast.success("Evolução salva com sucesso!");
      setNewNotes("");
      setSelectedAppointmentId("");
      setShowNewForm(false);
      fetchEvolutions();
    } catch (error) {
      console.error('Erro:', error);
      toast.error("Erro ao salvar evolução");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50 flex items-center justify-center">
        <p className="text-rose-nude-600">Carregando...</p>
      </div>
    );
  }

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate("/my-appointments")}
              variant="outline"
              className="border-rose-nude-200 text-rose-nude-600 hover:bg-rose-nude-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Evoluções do Paciente
              </h1>
              {patient && (
                <p className="text-lg text-rose-nude-600">
                  {patient.full_name}
                </p>
              )}
            </div>
            <Button
              onClick={() => setShowNewForm(!showNewForm)}
              className="bg-rose-nude-500 hover:bg-rose-nude-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Evolução
            </Button>
          </div>

          {/* Informações do Paciente */}
          {patient && (
            <Card className="border-rose-nude-200 mb-6">
              <CardHeader>
                <CardTitle className="text-rose-nude-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Dados do Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-rose-nude-600 font-medium">Nome Completo</p>
                    <p className="text-rose-nude-800">{patient.full_name || 'Não informado'}</p>
                  </div>
                  {patient.phone && (
                    <div>
                      <p className="text-sm text-rose-nude-600 font-medium">Telefone</p>
                      <p className="text-rose-nude-800">{patient.phone}</p>
                    </div>
                  )}
                  {patient.cpf && (
                    <div>
                      <p className="text-sm text-rose-nude-600 font-medium">CPF</p>
                      <p className="text-rose-nude-800">{patient.cpf}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulário de Nova Evolução */}
          {showNewForm && (
            <Card className="border-rose-nude-300 mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-rose-nude-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Registrar Nova Evolução
                </CardTitle>
                <CardDescription>
                  Registre o progresso e observações da sessão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Agendamento Relacionado *</Label>
                  <select
                    value={selectedAppointmentId}
                    onChange={(e) => setSelectedAppointmentId(e.target.value)}
                    className="w-full border border-rose-nude-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-rose-nude-400"
                  >
                    <option value="">Selecione o agendamento</option>
                    {appointments.map((apt) => (
                      <option key={apt.id} value={apt.id}>
                        {apt.service} - {format(new Date(apt.date + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })} às {apt.time.slice(0, 5)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evolution-notes">Evolução / Notas da Sessão *</Label>
                  <Textarea
                    id="evolution-notes"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Registre aqui as observações da sessão:
• Estado emocional do paciente
• Temas abordados
• Técnicas utilizadas
• Progressos observados
• Tarefas propostas
• Próximos passos"
                    rows={12}
                    className="border-rose-nude-200 focus:border-rose-nude-400"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewForm(false);
                      setNewNotes("");
                      setSelectedAppointmentId("");
                    }}
                    className="border-rose-nude-200"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveEvolution}
                    disabled={saving}
                    className="bg-rose-nude-500 hover:bg-rose-nude-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Salvando..." : "Salvar Evolução"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Evoluções */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-rose-nude-800 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Histórico de Evoluções ({evolutions.length})
            </h2>

            {evolutions.length === 0 ? (
              <Card className="border-rose-nude-200">
                <CardContent className="py-8 text-center">
                  <FileText className="w-12 h-12 mx-auto text-rose-nude-400 mb-4" />
                  <p className="text-rose-nude-600">Nenhuma evolução registrada ainda</p>
                  <Button
                    onClick={() => setShowNewForm(true)}
                    className="mt-4 bg-rose-nude-500 hover:bg-rose-nude-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Primeira Evolução
                  </Button>
                </CardContent>
              </Card>
            ) : (
              evolutions.map((evolution) => (
                <Card key={evolution.id} className="border-rose-nude-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-rose-nude-800 text-lg">
                          {evolution.appointment?.service || 'Sessão'}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          {evolution.appointment && (
                            <>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(evolution.appointment.date + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                              <span>{evolution.appointment.time.slice(0, 5)}</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <Badge className="bg-rose-nude-100 text-rose-nude-800">
                        {format(new Date(evolution.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-rose-nude-700 whitespace-pre-wrap">
                        {evolution.notes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientEvolutions;
