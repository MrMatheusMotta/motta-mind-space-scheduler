
import { useState } from "react";

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  features: Array<{
    title: string;
    description: string;
  }>;
  testimonials: {
    title: string;
    subtitle: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

const defaultHomeContent: HomeContent = {
  hero: {
    title: "Bem-vindo ao Consultório Dra. Daiane Silva",
    subtitle: "Cuidando da sua saúde mental com carinho e profissionalismo",
    description: "Atendimento psicológico especializado para mulheres e crianças neuroatípicas, oferecendo um ambiente acolhedor e profissional para seu bem-estar emocional."
  },
  features: [
    {
      title: "Atendimento Personalizado",
      description: "Cada paciente recebe um plano de tratamento único, adaptado às suas necessidades específicas."
    },
    {
      title: "Especialização em Neuroatípicos",
      description: "Experiência especializada no atendimento de crianças e adultos neuroatípicos."
    },
    {
      title: "Ambiente Acolhedor",
      description: "Espaço pensado para proporcionar conforto e segurança durante as sessões."
    }
  ],
  testimonials: {
    title: "O que nossos pacientes dizem",
    subtitle: "Depoimentos reais de quem já passou por aqui"
  },
  cta: {
    title: "Pronto para começar sua jornada?",
    description: "Agende sua consulta hoje mesmo e dê o primeiro passo para uma vida mais equilibrada.",
    buttonText: "Agendar Consulta"
  }
};

export const useHomeContent = () => {
  const [homeContent, setHomeContent] = useState<HomeContent>(() => {
    const saved = localStorage.getItem('homeContent');
    return saved ? JSON.parse(saved) : defaultHomeContent;
  });

  const updateHomeContent = (newContent: Partial<HomeContent>) => {
    const updated = { ...homeContent, ...newContent };
    setHomeContent(updated);
    localStorage.setItem('homeContent', JSON.stringify(updated));
  };

  return {
    homeContent,
    updateHomeContent
  };
};
