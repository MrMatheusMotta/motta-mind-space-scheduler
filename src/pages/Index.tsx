import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Clock, MapPin, Phone, Mail, Star, Heart, Brain, Users, CheckCircle, Shield, Calendar } from "lucide-react";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { useHomeContent } from "@/hooks/useHomeContent";

const Index = () => {
  const { settings } = useAdminSettings();
  const { homeContent } = useHomeContent();

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
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="text-center lg:text-left space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight">
                  {homeContent.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-rose-nude-600 leading-relaxed">
                  {homeContent.hero.subtitle}
                </p>
                <div className="p-4 bg-rose-nude-100 rounded-lg border border-rose-nude-200 mb-6">
                  <p className="text-rose-nude-800 font-semibold text-center">
                    {homeContent.hero.exclusiveMessage}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild size="lg" className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white">
                    <Link to="/booking">
                      <Calendar className="w-5 h-5 mr-2" />
                      Agendar Consulta
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-rose-nude-300 text-rose-nude-700 hover:bg-rose-nude-50">
                    <Link to="/about">Conheça Meu Trabalho</Link>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-rose-nude-200 to-rose-nude-300 rounded-2xl p-6 md:p-8 text-center shadow-xl">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-rose-nude-400 to-rose-nude-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white font-bold text-4xl md:text-6xl">DM</span>
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
                  <Card key={index} className="border-rose-nude-200 hover:shadow-lg transition-shadow text-center">
                    <CardContent className="p-6">
                      <IconComponent className="w-12 h-12 text-rose-nude-500 mx-auto mb-4" />
                      <h3 className="font-semibold text-rose-nude-800 mb-2">{feature.title}</h3>
                      <p className="text-sm text-rose-nude-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

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
              {homeContent.testimonials.map((testimonial, index) => (
                <Card key={index} className="border-rose-nude-200">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
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
              ))}
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
            <Button asChild size="lg" className="bg-white text-rose-nude-600 hover:bg-rose-nude-50">
              <Link to="/register">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
