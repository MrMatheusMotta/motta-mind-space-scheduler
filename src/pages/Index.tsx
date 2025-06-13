
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Shield, Heart, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  const services = [
    {
      name: "Anamnese",
      description: "Primeira consulta detalhada para conhecimento inicial",
      price: "R$ 160,00",
      icon: Heart
    },
    {
      name: "Acompanhamento Quinzenal",
      description: "Sessões a cada 15 dias para acompanhamento contínuo",
      priceOnline: "R$ 280,00",
      pricePresencial: "R$ 300,00",
      icon: Calendar
    },
    {
      name: "Acompanhamento Mensal",
      description: "Sessões mensais para manutenção do bem-estar",
      priceOnline: "R$ 380,00",
      pricePresencial: "R$ 400,00",
      icon: Clock
    },
    {
      name: "Atendimento Isolado",
      description: "Consulta pontual conforme necessidade",
      priceOnline: "R$ 120,00",
      pricePresencial: "R$ 150,00",
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6 animate-fade-in">
            Psicologia com Cuidado
          </h1>
          <p className="text-xl text-rose-nude-700 mb-8 leading-relaxed">
            Bem-vindo ao consultório de <strong>Daiane Motta</strong>. 
            Aqui você encontra um espaço seguro e acolhedor para cuidar da sua saúde mental.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button asChild size="lg" className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white px-8 py-4 rounded-full">
                <Link to="/booking">Agendar Consulta</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white px-8 py-4 rounded-full">
                  <Link to="/register">Começar Agora</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-rose-nude-300 text-rose-nude-700 hover:bg-rose-nude-50 px-8 py-4 rounded-full">
                  <Link to="/login">Já tenho conta</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-rose-nude-800 mb-4">Serviços Oferecidos</h2>
          <p className="text-lg text-rose-nude-600">Escolha o acompanhamento ideal para você</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="border-rose-nude-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-rose-nude-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-6 h-6 text-rose-nude-600" />
                </div>
                <CardTitle className="text-rose-nude-800">{service.name}</CardTitle>
                <CardDescription className="text-rose-nude-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {service.price ? (
                  <p className="text-2xl font-bold text-rose-nude-700">{service.price}</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-rose-nude-700">
                      Online: {service.priceOnline}
                    </p>
                    <p className="text-lg font-semibold text-rose-nude-700">
                      Presencial: {service.pricePresencial}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Important Info Section */}
      <section className="bg-rose-nude-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-rose-nude-800 mb-8 text-center">
              Informações Importantes
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Política de Agendamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-rose-nude-700">
                  <p>• Pagamento de 50% via PIX no ato do agendamento</p>
                  <p>• Remarcações devem ser feitas com 48h de antecedência</p>
                  <p>• Faltas ou atrasos injustificáveis não têm reembolso</p>
                </CardContent>
              </Card>
              
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Localização Presencial
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-rose-nude-700">
                  <p className="leading-relaxed">
                    Av Cardoso Moreira, 193<br />
                    Centro, Itaperuna - RJ<br />
                    CEP 28300-000<br />
                    Edifício Rotary, 2º andar, sala 208
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold text-rose-nude-800 mb-6">
          Pronto para cuidar de você?
        </h3>
        <p className="text-lg text-rose-nude-600 mb-8 max-w-2xl mx-auto">
          Agende sua consulta agora e dê o primeiro passo em direção ao seu bem-estar emocional.
        </p>
        {!user && (
          <Button asChild size="lg" className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white px-8 py-4 rounded-full">
            <Link to="/register">Criar Conta Gratuita</Link>
          </Button>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-rose-nude-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-rose-nude-200">
            © 2024 Daiane Motta - Psicóloga CRP-RJ. Todos os direitos reservados.
          </p>
          <p className="text-rose-nude-300 mt-2 text-sm">
            Plataforma de agendamentos online para consultas psicológicas
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
