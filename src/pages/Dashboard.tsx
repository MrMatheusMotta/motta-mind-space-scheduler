
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Calendar, DollarSign, Clock, Star, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const [realData, setRealData] = useState({
    totalAppointments: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    appointmentsByMonth: [] as any[],
  });
  const [recentAppointments, setRecentAppointments] = useState<{id:string; user_id:string; service:string; date:string; time:string; name:string}[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*');

      if (appointmentsError) throw appointmentsError;

      const totalAppointments = appointmentsData?.length || 0;
      const uniqueClients = new Set(appointmentsData?.map(a => a.user_id)).size;

      // Últimos agendamentos (com nomes)
      const { data: recentData, error: recentError } = await supabase
        .from('appointments')
        .select('id, user_id, service, date, time')
        .order('created_at', { ascending: false })
        .limit(8);

      if (recentError) throw recentError;

      const recentUserIds = [...new Set((recentData || []).map(r => r.user_id))];
      let namesMap: Record<string, string> = {};
      if (recentUserIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', recentUserIds);
        if (!profilesError && profilesData) {
          namesMap = profilesData.reduce((acc, p) => {
            acc[p.id] = p.full_name || 'Sem nome';
            return acc;
          }, {} as Record<string, string>);
        }
      }

      setRecentAppointments((recentData || []).map(r => ({
        ...r,
        name: namesMap[r.user_id] || 'Sem nome',
      })));

      setRealData({
        totalAppointments,
        activeClients: uniqueClients,
        monthlyRevenue: 0, // Pode ser calculado se houver dados de pagamento
        appointmentsByMonth: [],
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  // Mock analytics data
  const monthlyRevenue = [
    { month: 'Jan', revenue: 3200, appointments: 20 },
    { month: 'Fev', revenue: 4100, appointments: 26 },
    { month: 'Mar', revenue: 3800, appointments: 24 },
    { month: 'Abr', revenue: 4500, appointments: 28 },
    { month: 'Mai', revenue: 5200, appointments: 32 },
    { month: 'Jun', revenue: 4800, appointments: 30 }
  ];

  const serviceDistribution = [
    { name: 'Anamnese', value: 35, color: '#e3806a' },
    { name: 'Quinzenal', value: 30, color: '#cf6550' },
    { name: 'Mensal', value: 25, color: '#b5917d' },
    { name: 'Isolado', value: 10, color: '#d7c4b8' }
  ];

  const weeklyAppointments = [
    { day: 'Seg', appointments: 0 },
    { day: 'Ter', appointments: 4 },
    { day: 'Qua', appointments: 6 },
    { day: 'Qui', appointments: 5 },
    { day: 'Sex', appointments: 7 },
    { day: 'Sáb', appointments: 0 },
    { day: 'Dom', appointments: 0 }
  ];

  const kpis = [
    {
      title: "Receita Mensal",
      value: "R$ 4.800",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Clientes Ativos",
      value: realData.activeClients.toString(),
      change: "+3",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Taxa de Ocupação",
      value: "85%",
      change: "+5%",
      trend: "up",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Satisfação Média",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-yellow-600"
    }
  ];

  const alerts = [
    {
      type: "warning",
      message: "3 clientes não compareceram nas últimas 2 semanas",
      action: "Revisar política de faltas"
    },
    {
      type: "info",
      message: "Horário das 19h tem maior demanda",
      action: "Considerar abrir mais slots"
    },
    {
      type: "success",
      message: "Meta mensal de receita atingida",
      action: "Parabenizar equipe"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Dashboard Analytics</h1>
            <p className="text-lg text-rose-nude-600">
              Insights e métricas para otimizar seu consultório
            </p>
          </div>

          {/* KPIs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, index) => (
              <Card key={index} className="border-rose-nude-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-rose-nude-600">{kpi.title}</p>
                      <p className="text-2xl font-bold text-rose-nude-800">{kpi.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className={`text-sm ${kpi.color}`}>{kpi.change}</span>
                      </div>
                    </div>
                    <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800">Receita e Agendamentos Mensais</CardTitle>
                <CardDescription className="text-rose-nude-600">
                  Evolução da receita e número de consultas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4c2ad" />
                    <XAxis dataKey="month" stroke="#cf6550" />
                    <YAxis stroke="#cf6550" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fef7f5',
                        border: '1px solid #f4c2ad',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#e3806a" 
                      strokeWidth={3}
                      name="Receita (R$)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="appointments" 
                      stroke="#b5917d" 
                      strokeWidth={3}
                      name="Agendamentos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Service Distribution */}
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800">Distribuição de Serviços</CardTitle>
                <CardDescription className="text-rose-nude-600">
                  Porcentagem de cada tipo de serviço
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Últimos Agendamentos */}
          <Card className="border-rose-nude-200 mb-8">
            <CardHeader>
              <CardTitle className="text-rose-nude-800">Últimos agendamentos</CardTitle>
              <CardDescription className="text-rose-nude-600">Clique no paciente para ver evoluções</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAppointments.length === 0 ? (
                <p className="text-rose-nude-600">Sem agendamentos recentes</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recentAppointments.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => navigate(`/admin-panel?tab=evolutions&userId=${a.user_id}`)}
                      className="text-left p-3 rounded-lg border border-rose-nude-200 bg-rose-nude-50 hover:bg-rose-nude-100 transition-colors"
                    >
                      <div className="text-sm font-medium text-rose-nude-800">{a.name}</div>
                      <div className="text-xs text-rose-nude-600">{a.service}</div>
                      <div className="text-xs text-rose-nude-600">{new Date(a.date + 'T00:00:00').toLocaleDateString('pt-BR')} às {a.time.slice(0,5)}</div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Schedule */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800">Agendamentos por Dia da Semana</CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Distribuição semanal de consultas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyAppointments}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4c2ad" />
                      <XAxis dataKey="day" stroke="#cf6550" />
                      <YAxis stroke="#cf6550" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fef7f5',
                          border: '1px solid #f4c2ad',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="appointments" fill="#e3806a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Alertas e Insights
                </CardTitle>
                <CardDescription className="text-rose-nude-600">
                  Pontos de atenção e oportunidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index} className="p-3 rounded-lg border border-rose-nude-200 bg-rose-nude-50">
                    <div className="flex items-start space-x-2">
                      <Badge 
                        variant={alert.type === 'warning' ? 'destructive' : alert.type === 'success' ? 'default' : 'secondary'}
                        className="mt-0.5"
                      >
                        {alert.type}
                      </Badge>
                      <div>
                        <p className="text-sm text-rose-nude-800 font-medium">
                          {alert.message}
                        </p>
                        <p className="text-xs text-rose-nude-600 mt-1">
                          {alert.action}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800 text-lg">Taxa de Comparecimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-rose-nude-600">Meta: 90%</span>
                    <span className="text-rose-nude-800 font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                  <p className="text-xs text-rose-nude-600">-3% da meta mensal</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800 text-lg">Tempo Médio de Sessão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-rose-nude-800">52 min</p>
                  <p className="text-sm text-rose-nude-600">
                    <span className="text-green-600">+2 min</span> vs. mês anterior
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800 text-lg">Clientes Recorrentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-rose-nude-800">78%</p>
                  <p className="text-sm text-rose-nude-600">
                    <span className="text-green-600">+5%</span> de retenção
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
