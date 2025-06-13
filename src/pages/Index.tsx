
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Clock, MapPin, Phone, Mail, Star, Heart, Brain, Users, CheckCircle, Shield, Calendar } from "lucide-react";

const Index = () => {
  const services = [
    {
      name: "Anamnese",
      price: "R$ 160,00",
      description: "Primeira consulta para avaliação completa",
      duration: "90 minutos",
      type: "presencial"
    },
    {
      name: "Acompanhamento Quinzenal",
      priceOnline: "R$ 280,00",
      pricePresencial: "R$ 300,00",
      description: "Sessões a cada 15 dias",
      duration: "50 minutos"
    },
    {
      name: "Acompanhamento Mensal",
      priceOnline: "R$ 380,00",
      pricePresencial: "R$ 400,00",
      description: "Sessões mensais de acompanhamento",
      duration: "50 minutos"
    },
    {
      name: "Atendimento Isolado",
      priceOnline: "R$ 120,00",
      pricePresencial: "R$ 150,00",
      description: "Sessão única quando necessário",
      duration: "50 minutos"
    }
  ];

  const testimonials = [
    {
      name: "Maria Santos",
      rating: 5,
      comment: "A Daiane mudou minha vida! Através da TCC consegui superar minha ansiedade e hoje tenho uma qualidade de vida muito melhor.",
      image: "/placeholder.svg"
    },
    {
      name: "João Silva",
      rating: 5,
      comment: "Profissional excepcional! Seu conhecimento em TCC é impressionante e sempre me sinto acolhido nas sessões.",
      image: "/placeholder.svg"
    },
    {
      name: "Ana Costa",
      rating: 5,
      comment: "Recomendo a todos! Daiane tem uma abordagem muito humana e eficaz. Meu filho autista teve grandes progressos.",
      image: "/placeholder.svg"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Terapia Cognitiva Comportamental",
      description: "Abordagem cientificamente comprovada para diversos transtornos"
    },
    {
      icon: Users,
      title: "Atendimento Especializado",
      description: "Foco em crianças neuroatípicas e famílias"
    },
    {
      icon: Heart,
      title: "Acolhimento Humanizado",
      description: "Ambiente seguro e acolhedor para seu bem-estar"
    },
    {
      icon: Shield,
      title: "Sigilo Profissional",
      description: "Total confidencialidade em todos os atendimentos"
    }
  ];

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
                  Transforme sua vida com a Terapia Cognitiva Comportamental
                </h1>
                <p className="text-lg md:text-xl text-rose-nude-600 leading-relaxed">
                  Sou Daiane Motta, Terapeuta Cognitiva Comportamental especializada em ajudar você a superar desafios emocionais e conquistar uma vida mais equilibrada.
                </p>
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
              {features.map((feature, index) => (
                <Card key={index} className="border-rose-nude-200 hover:shadow-lg transition-shadow text-center">
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-rose-nude-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-rose-nude-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-rose-nude-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
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
              {services.map((service, index) => (
                <Card key={index} className="border-rose-nude-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-rose-nude-800 text-lg">{service.name}</CardTitle>
                    <CardDescription className="text-rose-nude-600">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {service.price && (
                        <div className="text-2xl font-bold text-rose-nude-700">{service.price}</div>
                      )}
                      {service.priceOnline && (
                        <div className="space-y-1">
                          <div className="text-lg font-semibold text-rose-nude-700">Online: {service.priceOnline}</div>
                          <div className="text-lg font-semibold text-rose-nude-700">Presencial: {service.pricePresencial}</div>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-rose-nude-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {service.duration}
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
                    <li>• Pagamento de 50% via PIX no ato do agendamento</li>
                    <li>• Remarcações com 48h de antecedência</li>
                    <li>• Faltas injustificáveis não têm reembolso</li>
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
              <p className="text-lg text-rose-nude-600">O que meus pacientes dizem</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
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
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">Informações de Contato</h2>
              <p className="text-lg text-rose-nude-600">Estou aqui para ajudá-la(o)</p>
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
                  <p>Av Cardoso Moreira, 193, Centro</p>
                  <p>Itaperuna - RJ, CEP 28300-000</p>
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
                    <span>(22) 99972-3737</span>
                  </div>
                  <div className="flex items-center text-rose-nude-700">
                    <Mail className="w-5 h-5 mr-3" />
                    <span className="break-all">psicologadaianesilva@outlook.com</span>
                  </div>
                  <div className="flex items-center text-rose-nude-700">
                    <Clock className="w-5 h-5 mr-3" />
                    <span>Atendimentos: 18h às 21h (dias úteis)</span>
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
              Pronto para começar sua transformação?
            </h2>
            <p className="text-lg md:text-xl text-rose-nude-100 mb-8">
              Agende sua consulta hoje e dê o primeiro passo rumo ao seu bem-estar
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
