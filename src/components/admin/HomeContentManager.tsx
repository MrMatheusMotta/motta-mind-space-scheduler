
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useAdminSettings } from "@/hooks/useAdminSettings";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  name: string;
  rating: number;
  comment: string;
  image: string;
}

interface Feature {
  title: string;
  description: string;
}

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    exclusiveMessage: string;
    profileImage?: string;
  };
  features: Feature[];
  testimonials: Testimonial[];
  cta: {
    title: string;
    subtitle: string;
    exclusiveNote: string;
  };
}

const HomeContentManager = () => {
  const { settings } = useAdminSettings();
  
  const [homeContent, setHomeContent] = useState<HomeContent>(() => {
    const saved = localStorage.getItem('homeContent');
    return saved ? JSON.parse(saved) : {
      hero: {
        title: "Transforme sua vida com a Terapia Cognitiva Comportamental",
        subtitle: "Sou Daiane Motta, Terapeuta Cognitiva Comportamental especializada em ajudar mulheres e crianças a superar desafios emocionais e conquistar uma vida mais equilibrada.",
        exclusiveMessage: "🌸 Atendimento exclusivo para mulheres e crianças 🌸",
        profileImage: undefined
      },
      features: [
        {
          title: "Terapia Cognitiva Comportamental",
          description: "Abordagem cientificamente comprovada para diversos transtornos"
        },
        {
          title: "Atendimento Especializado",
          description: "Exclusivo para mulheres e crianças neuroatípicas"
        },
        {
          title: "Acolhimento Humanizado",
          description: "Ambiente seguro e acolhedor para seu bem-estar"
        },
        {
          title: "Sigilo Profissional",
          description: "Total confidencialidade em todos os atendimentos"
        }
      ],
      testimonials: [
        {
          name: "Maria Santos",
          rating: 5,
          comment: "A Daiane mudou minha vida! Através da TCC consegui superar minha ansiedade e hoje tenho uma qualidade de vida muito melhor.",
          image: "/placeholder.svg"
        },
        {
          name: "Ana Silva",
          rating: 5,
          comment: "Profissional excepcional! Seu conhecimento em TCC é impressionante e sempre me sinto acolhida nas sessões.",
          image: "/placeholder.svg"
        },
        {
          name: "Carla Costa",
          rating: 5,
          comment: "Recomendo a todas! Daiane tem uma abordagem muito humana e eficaz. Minha filha autista teve grandes progressos.",
          image: "/placeholder.svg"
        }
      ],
      cta: {
        title: "Pronta para começar sua transformação?",
        subtitle: "Agende sua consulta hoje e dê o primeiro passo rumo ao seu bem-estar",
        exclusiveNote: "Atendimento exclusivo para mulheres e crianças"
      }
    };
  });

  const [editingTestimonial, setEditingTestimonial] = useState<number | null>(null);
  const [editingFeature, setEditingFeature] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Erro ao fazer upload da imagem");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setHomeContent(prev => ({
        ...prev,
        hero: { ...prev.hero, profileImage: imageUrl }
      }));
      toast.success("Imagem enviada com sucesso!");
    }
  };

  const removeImage = () => {
    setHomeContent(prev => ({
      ...prev,
      hero: { ...prev.hero, profileImage: undefined }
    }));
  };

  const saveContent = () => {
    localStorage.setItem('homeContent', JSON.stringify(homeContent));
    toast.success("Conteúdo da página inicial salvo com sucesso!");
  };

  const updateHero = (field: string, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const updateCTA = (field: string, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      cta: { ...prev.cta, [field]: value }
    }));
  };

  const addTestimonial = () => {
    setHomeContent(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, {
        name: "",
        rating: 5,
        comment: "",
        image: "/placeholder.svg"
      }]
    }));
  };

  const updateTestimonial = (index: number, field: string, value: string | number) => {
    setHomeContent(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }));
  };

  const removeTestimonial = (index: number) => {
    setHomeContent(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    setHomeContent(prev => ({
      ...prev,
      features: [...prev.features, { title: "", description: "" }]
    }));
  };

  const updateFeature = (index: number, field: string, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const removeFeature = (index: number) => {
    setHomeContent(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-rose-nude-800">Conteúdo da Página Inicial</h2>
          <p className="text-rose-nude-600">Edite todo o conteúdo que aparece na página inicial do site.</p>
        </div>
        <Button onClick={saveContent} className="bg-rose-nude-500 hover:bg-rose-nude-600">
          <Save className="w-4 h-4 mr-2" />
          Salvar Tudo
        </Button>
      </div>

      {/* Hero Section */}
      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle>Seção Principal (Hero)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Título Principal</Label>
            <Input
              id="heroTitle"
              value={homeContent.hero.title}
              onChange={(e) => updateHero("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtítulo</Label>
            <Textarea
              id="heroSubtitle"
              value={homeContent.hero.subtitle}
              onChange={(e) => updateHero("subtitle", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exclusiveMessage">Mensagem de Atendimento Exclusivo</Label>
            <Input
              id="exclusiveMessage"
              value={homeContent.hero.exclusiveMessage}
              onChange={(e) => updateHero("exclusiveMessage", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profileImage">Foto de Perfil da Dr. Daiane</Label>
            <div className="flex flex-col gap-3">
              {homeContent.hero.profileImage && (
                <div className="relative w-32 h-32 mx-auto">
                  <img 
                    src={homeContent.hero.profileImage} 
                    alt="Foto de perfil"
                    className="w-full h-full rounded-full object-cover border-4 border-rose-nude-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                    onClick={removeImage}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="border-rose-nude-200"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => document.getElementById('profileImage')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Enviando..." : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Características/Diferenciais
            <Button variant="outline" size="sm" onClick={addFeature}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {homeContent.features.map((feature, index) => (
            <div key={index} className="p-4 border border-rose-nude-200 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-rose-nude-800">Característica {index + 1}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingFeature(editingFeature === index ? null : index)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {editingFeature === index && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => updateFeature(index, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(index, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Testimonials Section */}
      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Depoimentos
            <Button variant="outline" size="sm" onClick={addTestimonial}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {homeContent.testimonials.map((testimonial, index) => (
            <div key={index} className="p-4 border border-rose-nude-200 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-rose-nude-800">Depoimento {index + 1}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTestimonial(editingTestimonial === index ? null : index)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTestimonial(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {editingTestimonial === index && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Avaliação (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) => updateTestimonial(index, "rating", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Comentário</Label>
                    <Textarea
                      value={testimonial.comment}
                      onChange={(e) => updateTestimonial(index, "comment", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle>Chamada para Ação (CTA)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ctaTitle">Título da CTA</Label>
            <Input
              id="ctaTitle"
              value={homeContent.cta.title}
              onChange={(e) => updateCTA("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaSubtitle">Subtítulo da CTA</Label>
            <Textarea
              id="ctaSubtitle"
              value={homeContent.cta.subtitle}
              onChange={(e) => updateCTA("subtitle", e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaExclusiveNote">Nota sobre Atendimento Exclusivo</Label>
            <Input
              id="ctaExclusiveNote"
              value={homeContent.cta.exclusiveNote}
              onChange={(e) => updateCTA("exclusiveNote", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeContentManager;
