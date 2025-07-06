
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import TestimonialForm from "@/components/TestimonialForm";
import { User, Settings, MessageSquare, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const [profileData, setProfileData] = useState({
    full_name: user.full_name || "",
    email: user.email || "",
    phone: user.phone || "",
    cpf: user.cpf || "",
    avatar_url: user.avatar_url || "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setProfileData({
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      cpf: user.cpf || "",
      avatar_url: user.avatar_url || "",
    });
  }, [user]);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error("Erro ao fazer upload da imagem");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const avatarUrl = await uploadAvatar(file);
    if (avatarUrl) {
      setProfileData(prev => ({ ...prev, avatar_url: avatarUrl }));
      toast.success("Foto de perfil enviada com sucesso!");
    }
  };

  const removeAvatar = () => {
    setProfileData(prev => ({ ...prev, avatar_url: "" }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          cpf: profileData.cpf,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
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
                      <Label htmlFor="avatar">Foto de Perfil</Label>
                      <div className="flex flex-col gap-3 items-center">
                        {profileData.avatar_url && (
                          <div className="relative w-24 h-24">
                            <img 
                              src={profileData.avatar_url} 
                              alt="Foto de perfil"
                              className="w-full h-full rounded-full object-cover border-4 border-rose-nude-200"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                              onClick={removeAvatar}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 w-full">
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={uploading}
                            className="border-rose-nude-200"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={uploading}
                            onClick={() => document.getElementById('avatar')?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? "Enviando..." : "Upload"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-rose-nude-700">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="border-rose-nude-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-rose-nude-700">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="border-rose-nude-200 bg-gray-50"
                      />
                      <p className="text-xs text-rose-nude-500">O email não pode ser alterado</p>
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

                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-rose-nude-700">CPF</Label>
                      <Input
                        id="cpf"
                        value={profileData.cpf}
                        onChange={(e) => setProfileData(prev => ({ ...prev, cpf: e.target.value }))}
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
