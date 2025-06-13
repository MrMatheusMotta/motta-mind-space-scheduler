
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import TestimonialForm from "@/components/TestimonialForm";
import { User, MessageSquare, Calendar, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    cpf: user?.cpf || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Meu Perfil</h1>
          <p className="text-rose-nude-600">Gerencie suas informações e compartilhe sua experiência</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-rose-nude-100">
            <TabsTrigger value="profile" className="data-[state=active]:bg-white">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="testimonial" className="data-[state=active]:bg-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Depoimento
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-white">
              <Calendar className="w-4 h-4 mr-2" />
              Consultas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800">Informações Pessoais</CardTitle>
                <CardDescription className="text-rose-nude-600">
                  Mantenha seus dados atualizados para um melhor atendimento.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-rose-nude-700">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="border-rose-nude-200 focus:border-rose-nude-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-rose-nude-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="border-rose-nude-200 focus:border-rose-nude-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-rose-nude-700">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="border-rose-nude-200 focus:border-rose-nude-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf" className="text-rose-nude-700">CPF</Label>
                      <Input
                        id="cpf"
                        value={formData.cpf}
                        onChange={(e) => handleChange("cpf", e.target.value)}
                        className="border-rose-nude-200 focus:border-rose-nude-400"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonial">
            <TestimonialForm />
          </TabsContent>

          <TabsContent value="appointments">
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800">Minhas Consultas</CardTitle>
                <CardDescription className="text-rose-nude-600">
                  Histórico e agendamentos futuros.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-rose-nude-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-rose-nude-700 mb-2">
                    Nenhuma consulta agendada
                  </h3>
                  <p className="text-rose-nude-600 mb-4">
                    Você ainda não possui consultas em seu histórico.
                  </p>
                  <Button className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white">
                    Agendar Consulta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
