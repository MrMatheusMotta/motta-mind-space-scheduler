
import { useState } from "react";

interface AboutContent {
  profile: {
    name: string;
    crp: string;
    title: string;
  };
  mission: string[];
  specializations: string[];
  experience: Array<{
    title: string;
    description: string;
    duration: string;
    icon: string;
  }>;
  approach: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  formation: string[];
  expectations: string[];
}

const defaultAboutContent: AboutContent = {
  profile: {
    name: "Daiane Motta",
    crp: "CRP-RJ 52221",
    title: "Terapeuta Cognitiva Comportamental especializada em atendimento clínico e crianças neuroatípicas"
  },
  mission: [
    "Como Terapeuta Cognitiva Comportamental, minha missão é proporcionar um espaço seguro e acolhedor onde você possa explorar seus pensamentos, emoções e comportamentos, desenvolvendo ferramentas eficazes para superar desafios e alcançar uma vida mais equilibrada e satisfatória.",
    "Trabalho com base científica sólida, utilizando técnicas comprovadas da TCC, sempre adaptadas às necessidades individuais de cada pessoa. Minha abordagem é colaborativa, respeitosa e focada em resultados concretos.",
    "Tenho especial dedicação ao atendimento de crianças neuroatípicas e suas famílias, oferecendo suporte integral para o desenvolvimento emocional e social, sempre em parceria com outros profissionais em uma abordagem multidisciplinar."
  ],
  specializations: [
    "Terapia Cognitiva Comportamental",
    "Atendimento a Crianças Neuroatípicas",
    "Transtornos de Ansiedade",
    "Depressão",
    "Transtorno do Espectro Autista",
    "TDAH",
    "Terapia Familiar",
    "Orientação Parental"
  ],
  experience: [
    {
      title: "Clínica Multidisciplinar",
      description: "Atendimento especializado em crianças neuroatípicas",
      duration: "Atual",
      icon: "Users"
    },
    {
      title: "Consultório Particular",
      description: "Atendimento individual em TCC para adolescentes e adultos",
      duration: "2+ anos",
      icon: "Heart"
    },
    {
      title: "Formação Continuada",
      description: "Constante atualização em técnicas de TCC",
      duration: "Contínuo",
      icon: "BookOpen"
    }
  ],
  approach: [
    {
      title: "Baseada em Evidências",
      description: "Utilizo técnicas cientificamente comprovadas da TCC",
      icon: "Target"
    },
    {
      title: "Acolhimento Humanizado",
      description: "Ambiente seguro e sem julgamentos para seu desenvolvimento",
      icon: "Heart"
    },
    {
      title: "Foco no Cliente",
      description: "Tratamento personalizado para suas necessidades específicas",
      icon: "Star"
    },
    {
      title: "Desenvolvimento Integral",
      description: "Visão holística do bem-estar emocional e mental",
      icon: "Brain"
    }
  ],
  formation: [
    "• Graduação em Psicologia",
    "• Especialização em Terapia Cognitiva Comportamental",
    "• Formação em Atendimento a Crianças Neuroatípicas",
    "• Curso de Orientação Parental",
    "• Participação contínua em congressos e workshops"
  ],
  expectations: [
    "• Ambiente acolhedor e sigiloso",
    "• Técnicas baseadas em evidências científicas",
    "• Planos de tratamento personalizados",
    "• Foco em resultados práticos e duradouros",
    "• Suporte contínuo durante todo o processo",
    "• Flexibilidade para atendimento online ou presencial"
  ]
};

export const useAboutContent = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent>(() => {
    const saved = localStorage.getItem('aboutContent');
    return saved ? JSON.parse(saved) : defaultAboutContent;
  });

  const updateAboutContent = (newContent: Partial<AboutContent>) => {
    const updated = { ...aboutContent, ...newContent };
    setAboutContent(updated);
    localStorage.setItem('aboutContent', JSON.stringify(updated));
  };

  return {
    aboutContent,
    updateAboutContent
  };
};
