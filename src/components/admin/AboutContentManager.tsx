
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, User, Award, GraduationCap, Heart } from "lucide-react";
import { toast } from "sonner";
import { useAboutContent } from "@/hooks/useAboutContent";

const AboutContentManager = () => {
  const { aboutContent, updateAboutContent } = useAboutContent();
  const [contentData, setContentData] = useState(aboutContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAboutContent(contentData);
    toast.success("Conteúdo da página 'Sobre Mim' atualizado com sucesso!");
  };

  const addSpecialization = () => {
    setContentData(prev => ({
      ...prev,
      specializations: [...prev.specializations, "Nova Especialização"]
    }));
  };

  const removeSpecialization = (index: number) => {
    setContentData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const updateSpecialization = (index: number, value: string) => {
    setContentData(prev => ({
      ...prev,
      specializations: prev.specializations.map((spec, i) => i === index ? value : spec)
    }));
  };

  const addExperience = () => {
    setContentData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: "Novo Cargo",
        description: "Descrição da experiência",
        duration: "Duração",
        icon: "Users"
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setContentData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setContentData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addApproachItem = () => {
    setContentData(prev => ({
      ...prev,
      approach: [...prev.approach, {
        title: "Novo Diferencial",
        description: "Descrição do diferencial",
        icon: "Heart"
      }]
    }));
  };

  const removeApproachItem = (index: number) => {
    setContentData(prev => ({
      ...prev,
      approach: prev.approach.filter((_, i) => i !== index)
    }));
  };

  const updateApproachItem = (index: number, field: string, value: string) => {
    setContentData(prev => ({
      ...prev,
      approach: prev.approach.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Editor da Página "Sobre Mim"</h2>
        <p className="text-rose-nude-600">Edite todas as informações que aparecem na página sobre você.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={contentData.profile.name}
                onChange={(e) => setContentData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, name: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crp">CRP</Label>
              <Input
                id="crp"
                value={contentData.profile.crp}
                onChange={(e) => setContentData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, crp: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título Profissional</Label>
              <Input
                id="title"
                value={contentData.profile.title}
                onChange={(e) => setContentData(prev => ({
                  ...prev,
                  profile: { ...prev.profile, title: e.target.value }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Missão */}
        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Missão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentData.mission.map((paragraph, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`mission-${index}`}>Parágrafo {index + 1}</Label>
                <Textarea
                  id={`mission-${index}`}
                  value={paragraph}
                  onChange={(e) => setContentData(prev => ({
                    ...prev,
                    mission: prev.mission.map((p, i) => i === index ? e.target.value : p)
                  }))}
                  rows={3}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Especializações */}
        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Especializações
            </CardTitle>
            <CardDescription>
              Adicione suas áreas de especialização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              {contentData.specializations.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={spec}
                    onChange={(e) => updateSpecialization(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSpecialization(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={addSpecialization}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Especialização
            </Button>
          </CardContent>
        </Card>

        {/* Experiência */}
        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Experiência Profissional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-rose-nude-200 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Experiência {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeExperience(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={exp.title}
                      onChange={(e) => updateExperience(index, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duração</Label>
                    <Input
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, "duration", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Experiência
            </Button>
          </CardContent>
        </Card>

        {/* Abordagem Terapêutica */}
        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle>Abordagem Terapêutica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contentData.approach.map((item, index) => (
              <div key={index} className="p-4 border border-rose-nude-200 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeApproachItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateApproachItem(index, "title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateApproachItem(index, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addApproachItem}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" className="bg-rose-nude-500 hover:bg-rose-nude-600">
          Salvar Alterações
        </Button>
      </form>
    </div>
  );
};

export default AboutContentManager;
