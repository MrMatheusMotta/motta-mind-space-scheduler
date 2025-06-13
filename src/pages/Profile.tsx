
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import TestimonialForm from "@/components/TestimonialForm";
import { User, Settings, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Perfil atualizado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Meu Perfil</h1>
            <p className="text-lg text-rose-nude-600">
              Gerencie suas informações pessoais e envie depoimentos
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full lg:w-fit lg:grid-cols-3 bg-rose-nude-100">
              <TabsTrigger value="profile" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="testimonial" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Depoimentos
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-rose-nude-500 data-[state=active]:text-white">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800">Informações Pessoais</CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Atualize seus dados pessoais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-rose-nude-700">Nome Completo</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-rose-nude-700">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-rose-nude-700">Telefone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <Button type="submit" className="bg-rose-nude-500 hover:bg-rose-nude-600 text-white">
                      Atualizar Perfil
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonial">
              <TestimonialForm />
            </TabsContent>

            <TabsContent value="settings">
              <Card className="border-rose-nude-200">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800">Configurações da Conta</CardTitle>
                  <CardDescription className="text-rose-nude-600">
                    Gerencie suas preferências de conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Sair da Conta
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
