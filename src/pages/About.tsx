
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { GraduationCap, Award, Users, Heart, Brain, BookOpen, Target, Star } from "lucide-react";
import { useAboutContent } from "@/hooks/useAboutContent";

const About = () => {
  const { aboutContent } = useAboutContent();

  const getIcon = (iconName: string) => {
    const icons = {
      Users,
      Heart,
      BookOpen,
      Target,
      Star,
      Brain
    };
    return icons[iconName as keyof typeof icons] || Heart;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Sobre {aboutContent.profile.name}</h1>
            <p className="text-lg md:text-xl text-rose-nude-600 max-w-3xl mx-auto">
              Terapeuta Cognitiva Comportamental dedicada a transformar vidas através de uma abordagem científica e humanizada
            </p>
          </div>

          {/* Profile Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1">
              <Card className="border-rose-nude-200 text-center">
                <CardContent className="p-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-rose-nude-400 to-rose-nude-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white font-bold text-4xl">DM</span>
                  </div>
                  <h2 className="text-2xl font-bold text-rose-nude-800 mb-2">{aboutContent.profile.name}</h2>
                  <Badge className="bg-rose-nude-500 text-white mb-4">{aboutContent.profile.crp}</Badge>
                  <p className="text-rose-nude-700 text-sm">
                    {aboutContent.profile.title}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="border-rose-nude-200 h-full">
                <CardHeader>
                  <CardTitle className="text-rose-nude-800 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Minha Missão
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-rose-nude-700">
                  {aboutContent.mission.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Specializations */}
          <div className="mb-12">
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Especializações e Áreas de Atuação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {aboutContent.specializations.map((spec, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="border-rose-nude-300 text-rose-nude-700 p-2 text-center justify-center"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Experience */}
          <div className="mb-12">
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Experiência Profissional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {aboutContent.experience.map((exp, index) => {
                    const IconComponent = getIcon(exp.icon);
                    return (
                      <div key={index} className="text-center p-4 bg-rose-nude-50 rounded-lg">
                        <IconComponent className="w-12 h-12 text-rose-nude-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-rose-nude-800 mb-2">{exp.title}</h3>
                        <p className="text-sm text-rose-nude-600 mb-2">{exp.description}</p>
                        <Badge className="bg-rose-nude-200 text-rose-nude-800">{exp.duration}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Approach */}
          <div className="mb-12">
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Minha Abordagem Terapêutica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {aboutContent.approach.map((item, index) => {
                    const IconComponent = getIcon(item.icon);
                    return (
                      <div key={index} className="text-center">
                        <IconComponent className="w-10 h-10 text-rose-nude-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-rose-nude-800 mb-2">{item.title}</h3>
                        <p className="text-sm text-rose-nude-600">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800">Formação e Capacitação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-rose-nude-700">
                {aboutContent.formation.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
                <div className="mt-4 p-3 bg-rose-nude-50 rounded-lg">
                  <p className="text-sm font-medium">{aboutContent.profile.crp}</p>
                  <p className="text-xs">Conselho Regional de Psicologia do Rio de Janeiro</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-nude-200">
              <CardHeader>
                <CardTitle className="text-rose-nude-800">O que você pode esperar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-rose-nude-700">
                {aboutContent.expectations.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
                <div className="mt-4 p-3 bg-rose-nude-50 rounded-lg">
                  <p className="text-sm font-medium">Compromisso com a ética profissional</p>
                  <p className="text-xs">Sigilo, respeito e dedicação em cada atendimento</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
