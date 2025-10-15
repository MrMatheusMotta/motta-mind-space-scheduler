import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Clock, MapPin, Phone, Mail, Star, Heart, Brain, Users, CheckCircle, Shield, Calendar, CalendarCheck, Video } from "lucide-react";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useHomeContent } from "@/hooks/useHomeContent";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { settings } = useAdminSettings();
  const { homeContent } = useHomeContent();
  const { user } = useAuth();
  const [userAppointments, setUserAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [realTestimonials, setRealTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserAppointments();
    }
    fetchApprovedTestimonials();
  }, [user]);

  const fetchApprovedTestimonials = async () => {
    try {
      setLoadingTestimonials(true);

      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching testimonials:', error);
        setRealTestimonials([]);
        return;
      }

      setRealTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setRealTestimonials([]);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const fetchUserAppointments = async () => {
    try {
      setLoadingAppointments(true);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('time', { ascending: true })
        .limit(3);

      if (!error && data) {
        setUserAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr) => {
    return timeStr.slice(0, 5);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'realizado': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const iconMap = {
    "Terapia Cognitiva Comportamental": Brain,
    "Atendimento Especializado": Users,
    "Acolhimento Humanizado": Heart,
    "Sigilo Profissional": Shield
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-stretch">
              <div className="text-center lg:text-left space-y-6 flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight">
                  {homeContent.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-rose-nude-600 leading-relaxed">
                  {homeContent.hero.subtitle}
                </p>
                
                <div className="p-6 bg-rose-nude-100 rounded-lg border border-rose-nude-200 mb-6">
                  <p className="text-rose-nude-800 font-semibold text-center">
                    {homeContent.hero.exclusiveMessage}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild size="lg" className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white py-3 px-6">
                    <Link to="/booking">
                      <Calendar className="w-5 h-5 mr-2" />
                      Agendar Consulta
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-rose-nude-300 text-rose-nude-700 hover:bg-rose-nude-50 py-3 px-6">
                    <Link to="/about">Conheça Meu Trabalho</Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative flex items-center justify-center">
                <div className="bg-gradient-to-br from-rose-nude-200 to-rose-nude-300 rounded-2xl p-6 md:p-8 text-center shadow-xl w-full max-w-sm mx-auto h-full flex flex-col justify-center">
                  <div 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundImage: homeContent.hero.profileImage 
                        ? `url(${homeContent.hero.profileImage})` 
                        : 'linear-gradient(135deg, hsl(var(--rose-nude-400)), hsl(var(--rose-nude-600)))',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!homeContent.hero.profileImage && (
                      <span className="text-white font-bold text-4xl md:text-6xl">DM</span>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-rose-nude-800 mb-2">Daiane Motta</h3>
                  <p className="text-rose-nude-700 mb-4">Terapeuta Cognitiva Comportamental</p>
                  <Badge className="bg-rose-nude-500 text-white">CRP-RJ 52221</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">Por que escolher meu trabalho?</h2>
              <p className="text-lg text-rose-nude-600">Comprometimento com sua saúde mental e bem-estar</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {homeContent.features.map((feature, index) => {
                const IconComponent = iconMap[feature.title as keyof typeof iconMap] || Brain;
                return (
                  <Card key={index} className="border-rose-nude-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-nude-400 to-rose-nude-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-rose-nude-800 mb-3">{feature.title}</h3>
                      <p className="text-sm text-rose-nude-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* User Appointments Section - Only visible when logged in and not admin */}
      {user && user.role !== 'admin' && (
        <section className="py-12 md:py-16 bg-gradient-to-r from-rose-nude-100 to-rose-nude-200">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
                  Olá, {user.full_name?.split(' ')[0] || 'Usuário'}! 👋
                </h2>
                <p className="text-lg text-rose-nude-600">Suas próximas consultas</p>
              </div>
              
              {loadingAppointments ? (
                <div className="text-center py-8">
                  <p className="text-rose-nude-600">Carregando seus agendamentos...</p>
                </div>
              ) : userAppointments.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {userAppointments.map((appointment) => (
                      <Card key={appointment.id} className="border-rose-nude-300 bg-white hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-rose-nude-800">
                                {appointment.service}
                              </h3>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status || 'agendado'}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2 text-sm text-rose-nude-600">
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
                            
                            {appointment.type === 'online' && appointment.status === 'confirmado' && (
                              <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700 mt-3">
                                <Link to="/videocall">
                                  <Video className="w-4 h-4 mr-2" />
                                  Entrar na Consulta
                                </Link>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <Button asChild variant="outline" className="border-rose-nude-400 text-rose-nude-700 hover:bg-rose-nude-50">
                      <Link to="/my-appointments">
                        <CalendarCheck className="w-4 h-4 mr-2" />
                        Ver Todos os Agendamentos
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <Card className="border-rose-nude-300 bg-white">
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-16 h-16 mx-auto text-rose-nude-400 mb-4" />
                    <h3 className="text-xl font-semibold text-rose-nude-800 mb-2">
                      Você ainda não tem consultas agendadas
                    </h3>
                    <p className="text-rose-nude-600 mb-6">
                      Que tal agendar sua primeira consulta comigo?
                    </p>
                    <Button asChild size="lg" className="bg-rose-nude-500 hover:bg-rose-nude-600">
                      <Link to="/booking">
                        <Calendar className="w-5 h-5 mr-2" />
                        Agendar Primeira Consulta
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {/* Quick Actions for Logged Users */}
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-rose-nude-300 bg-white hover:shadow-md transition-shadow cursor-pointer">
                  <Link to="/booking">
                    <CardContent className="p-6 text-center">
                      <Calendar className="w-8 h-8 mx-auto text-rose-nude-500 mb-3" />
                      <h4 className="font-semibold text-rose-nude-800 mb-1">Nova Consulta</h4>
                      <p className="text-sm text-rose-nude-600">Agendar nova sessão</p>
                    </CardContent>
                  </Link>
                </Card>
                
                <Card className="border-rose-nude-300 bg-white hover:shadow-md transition-shadow cursor-pointer">
                  <Link to="/my-appointments">
                    <CardContent className="p-6 text-center">
                      <CalendarCheck className="w-8 h-8 mx-auto text-rose-nude-500 mb-3" />
                      <h4 className="font-semibold text-rose-nude-800 mb-1">Meus Agendamentos</h4>
                      <p className="text-sm text-rose-nude-600">Ver histórico completo</p>
                    </CardContent>
                  </Link>
                </Card>
                
                <Card className="border-rose-nude-300 bg-white hover:shadow-md transition-shadow cursor-pointer">
                  <Link to="/profile">
                    <CardContent className="p-6 text-center">
                      <Users className="w-8 h-8 mx-auto text-rose-nude-500 mb-3" />
                      <h4 className="font-semibold text-rose-nude-800 mb-1">Meu Perfil</h4>
                      <p className="text-sm text-rose-nude-600">Atualizar informações</p>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">Serviços Oferecidos</h2>
              <p className="text-lg text-rose-nude-600">Planos flexíveis para suas necessidades</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {settings.services.map((service, index) => (
                <Card key={index} className="border-rose-nude-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800 text-lg">{service.name}</CardTitle>
                    <CardDescription className="text-rose-nude-600">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {!service.priceOnline ? (
                        <div className="text-2xl font-bold text-rose-nude-700">R$ {service.price.toFixed(2)}</div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-lg font-semibold text-rose-nude-700">Online: R$ {service.priceOnline.toFixed(2)}</div>
                          <div className="text-lg font-semibold text-rose-nude-700">Presencial: R$ {service.price.toFixed(2)}</div>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-rose-nude-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {service.duration} minutos
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 p-4 md:p-6 bg-rose-nude-100 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-rose-nude-600 mt-1 flex-shrink-0" />
                <div className="text-sm md:text-base text-rose-nude-800">
                  <p className="font-semibold mb-2">Condições de Agendamento:</p>
                  <ul className="space-y-1 text-rose-nude-700">
                    <li>• Pagamento de {settings.payment.advancePercentage}% via PIX no ato do agendamento</li>
                    <li>• Remarcações com 48h de antecedência</li>
                    <li>• Faltas injustificáveis não têm reembolso</li>
                    <li>• <strong>Atendimento exclusivo para mulheres e crianças</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">Depoimentos</h2>
              <p className="text-lg text-rose-nude-600">O que minhas pacientes dizem</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Mostra depoimentos reais primeiro, depois os estáticos se necessário */}
              {realTestimonials.length > 0 ? (
                realTestimonials.slice(0, 3).map((testimonial, index) => (
                  <Card key={testimonial.id} className="border-rose-nude-200">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.profiles?.avatar_url || "/placeholder.svg"} 
                          alt={testimonial.profiles?.full_name || testimonial.name}
                          className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-rose-nude-200"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <div>
                          <h4 className="font-semibold text-rose-nude-800">
                            {testimonial.profiles?.full_name || testimonial.name}
                          </h4>
                          <div className="flex">
                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-rose-nude-400 text-rose-nude-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-rose-nude-700 text-sm italic">"{testimonial.content}"</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                homeContent.testimonials.map((testimonial, index) => (
                  <Card key={index} className="border-rose-nude-200">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-rose-nude-200"
                        />
                        <div>
                          <h4 className="font-semibold text-rose-nude-800">{testimonial.name}</h4>
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-rose-nude-400 text-rose-nude-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-rose-nude-700 text-sm italic">"{testimonial.comment}"</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">Informações de Contato</h2>
              <p className="text-lg text-rose-nude-600">Estou aqui para ajudá-la</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-rose-nude-700">
                  <p>{settings.clinic.address}</p>
                  <p>{settings.clinic.city}</p>
                  <p className="font-medium">Edifício Rotary, 2º andar, sala 208</p>
                </CardContent>
              </Card>
              
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800">Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-rose-nude-700">
                    <Phone className="w-5 h-5 mr-3" />
                    <span>{settings.clinic.phone}</span>
                  </div>
                  <div className="flex items-center text-rose-nude-700">
                    <Mail className="w-5 h-5 mr-3" />
                    <span className="break-all">{settings.clinic.email}</span>
                  </div>
                  <div className="flex items-center text-rose-nude-700">
                    <Clock className="w-5 h-5 mr-3" />
                    <span>{settings.clinic.openingHours}</span>
                  </div>
                  <div className="flex items-center text-rose-nude-700">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <a 
                      href="https://www.instagram.com/psidaianemotta/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-rose-nude-900 transition-colors"
                    >
                      @psidaianemotta
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-rose-nude-500 to-rose-nude-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {homeContent.cta.title}
            </h2>
            <p className="text-lg md:text-xl text-rose-nude-100 mb-4">
              {homeContent.cta.subtitle}
            </p>
            <p className="text-md text-rose-nude-100 mb-8">
              <strong>{homeContent.cta.exclusiveNote}</strong>
            </p>
            {!user ? (
              <Button asChild size="lg" className="bg-white text-rose-nude-600 hover:bg-rose-nude-50">
                <Link to="/register">Começar Agora</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-white text-rose-nude-600 hover:bg-rose-nude-50">
                <Link to="/booking">Agendar Nova Consulta</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
