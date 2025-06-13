
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Heart, Shield, Clock, MapPin, Phone, Mail, Calendar, Star, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const services = [
    {
      name: "Anamnese",
      description: "Primeira consulta com avaliação completa",
      price: "R$ 160,00",
      duration: "60 minutos",
      type: "presencial"
    },
    {
      name: "Acompanhamento Quinzenal",
      description: "Sessões a cada duas semanas",
      priceOnline: "R$ 280,00",
      pricePresencial: "R$ 300,00",
      duration: "50 minutos",
      type: "ambos"
    },
    {
      name: "Acompanhamento Mensal",
      description: "Sessões mensais de acompanhamento",
      priceOnline: "R$ 380,00",
      pricePresencial: "R$ 400,00",
      duration: "50 minutos",
      type: "ambos"
    },
    {
      name: "Atendimento Isolado",
      description: "Sessão avulsa conforme necessidade",
      priceOnline: "R$ 120,00",
      pricePresencial: "R$ 150,00",
      duration: "50 minutos",
      type: "ambos"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      text: "Profissional excepcional, muito acolhedora e competente. Recomendo!",
      rating: 5
    },
    {
      name: "João Santos",
      text: "Ambiente acolhedor e atendimento de qualidade. Me sinto muito bem acompanhado.",
      rating: 5
    },
    {
      name: "Ana Costa",
      text: "Daiane é uma profissional incrível, me ajudou muito no meu processo de autoconhecimento.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
              Daiane Motta
            </h1>
            <p className="text-xl md:text-2xl text-rose-nude-600 mb-4">
              Psicóloga Clínica • CRP-RJ 52221
            </p>
            <p className="text-lg text-rose-nude-700 mb-8 max-w-3xl mx-auto">
              Oferecendo acompanhamento psicológico com acolhimento, profissionalismo e cuidado. 
              Atendimento presencial e online para seu bem-estar emocional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/booking')}
                className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white px-8 py-3 text-lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/register')}
                className="border-rose-nude-300 text-rose-nude-700 hover:bg-rose-nude-50 px-8 py-3 text-lg"
              >
                Criar Conta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Serviços Oferecidos</h2>
            <p className="text-lg text-rose-nude-600">
              Atendimento personalizado para suas necessidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-rose-nude-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-rose-nude-800">{service.name}</CardTitle>
                    <Badge className="bg-rose-nude-100 text-rose-nude-700">{service.duration}</Badge>
                  </div>
                  <CardDescription className="text-rose-nude-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {service.type === 'presencial' ? (
                    <p className="text-2xl font-bold text-rose-nude-800">{service.price}</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-rose-nude-600">Online:</span>
                        <span className="font-bold text-rose-nude-800">{service.priceOnline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-rose-nude-600">Presencial:</span>
                        <span className="font-bold text-rose-nude-800">{service.pricePresencial}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-rose-nude-200 bg-rose-nude-50">
            <CardHeader>
              <CardTitle className="text-rose-nude-800 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-rose-nude-600 mt-0.5" />
                <p className="text-rose-nude-700">
                  <strong>Pagamento:</strong> 50% do valor deve ser pago via PIX no ato do agendamento
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-rose-nude-600 mt-0.5" />
                <p className="text-rose-nude-700">
                  <strong>Remarcações:</strong> Devem ser solicitadas com pelo menos 48h de antecedência
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-rose-nude-600 mt-0.5" />
                <p className="text-rose-nude-700">
                  <strong>Política de Faltas:</strong> Faltas ou atrasos injustificáveis não terão reembolso
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-4">Localização</h2>
            <p className="text-lg text-rose-nude-600">Atendimento presencial em Itaperuna - RJ</p>
          </div>
          
          <Card className="border-rose-nude-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-rose-nude-500 mt-1" />
                <div>
                  <p className="text-rose-nude-800 font-semibold">Edifício Rotary</p>
                  <p className="text-rose-nude-700">2º andar, sala 208</p>
                  <p className="text-rose-nude-600">Av Cardoso Moreira, 193, Centro</p>
                  <p className="text-rose-nude-600">Itaperuna - RJ, CEP 28300-000</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold gradient-text mb-4">Depoimentos</h2>
            <p className="text-lg text-rose-nude-600">
              O que nossos pacientes dizem sobre o atendimento
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-rose-nude-200">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-rose-nude-400 text-rose-nude-400" />
                    ))}
                  </div>
                  <p className="text-rose-nude-700 mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-rose-nude-800">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 bg-rose-nude-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold gradient-text mb-8">Entre em Contato</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2 text-rose-nude-700">
              <Phone className="w-5 h-5" />
              <span>(22) 99999-9999</span>
            </div>
            <div className="flex items-center space-x-2 text-rose-nude-700">
              <Mail className="w-5 h-5" />
              <span>contato@daianemotta.com</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={() => navigate('/booking')}
              className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white px-8 py-3"
            >
              Agendar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rose-nude-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-rose-nude-100">
            © 2024 Daiane Motta - Psicóloga Clínica • CRP-RJ 52221
          </p>
          <p className="text-rose-nude-200 text-sm mt-2">
            Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
