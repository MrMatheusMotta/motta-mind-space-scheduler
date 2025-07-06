
import { useState } from "react";

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

const defaultHomeContent: HomeContent = {
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
