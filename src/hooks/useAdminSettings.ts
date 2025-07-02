import { useState, useEffect } from "react";

interface AdminSettings {
  services: Array<{
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    priceOnline?: number;
  }>;
  clinic: {
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    description: string;
    openingHours: string;
  };
  payment: {
    advancePercentage: number;
    pixKey: string;
    paymentMethods: string[];
    qrCodeImage?: string;
  };
}

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    exclusiveMessage: string;
  };
  features: Array<{
    title: string;
    description: string;
  }>;
  testimonials: Array<{
    name: string;
    rating: number;
    comment: string;
    image: string;
  }>;
  cta: {
    title: string;
    subtitle: string;
    exclusiveNote: string;
  };
}

const defaultSettings: AdminSettings = {
  services: [
    {
      id: "1",
      name: "Anamnese",
      description: "Primeira consulta para avaliação completa",
      duration: 90,
      price: 160
    },
    {
      id: "2",
      name: "Acompanhamento Quinzenal",
      description: "Sessões a cada 15 dias",
      duration: 50,
      price: 300,
      priceOnline: 280
    },
    {
      id: "3",
      name: "Acompanhamento Mensal",
      description: "Sessões mensais de acompanhamento",
      duration: 50,
      price: 400,
      priceOnline: 380
    },
    {
      id: "4",
      name: "Atendimento Isolado",
      description: "Sessão única quando necessário",
      duration: 50,
      price: 150,
      priceOnline: 120
    }
  ],
  clinic: {
    name: "Consultório Dra. Daiane Silva",
    address: "Av Cardoso Moreira, 193, Centro",
    city: "Itaperuna - RJ, CEP 28300-000",
    phone: "(22) 99972-3737",
    email: "psicologadaianesilva@outlook.com",
    description: "Atendimento psicológico especializado para mulheres e crianças neuroatípicas, oferecendo um ambiente acolhedor e profissional para seu bem-estar emocional.",
    openingHours: "Atendimentos: 18h às 21h (dias úteis)"
  },
  payment: {
    advancePercentage: 50,
    pixKey: "psicologadaianesilva@outlook.com",
    paymentMethods: ["PIX", "Cartão de Crédito", "Dinheiro"],
    qrCodeImage: undefined
  }
};

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('adminSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('adminSettings', JSON.stringify(updated));
  };

  const updateServices = (services: AdminSettings['services']) => {
    updateSettings({ services });
  };

  const updateClinic = (clinic: AdminSettings['clinic']) => {
    updateSettings({ clinic });
  };

  const updatePayment = (payment: AdminSettings['payment']) => {
    updateSettings({ payment });
  };

  return {
    settings,
    updateSettings,
    updateServices,
    updateClinic,
    updatePayment
  };
};

export const useHomeContent = () => {
  const [homeContent, setHomeContent] = useState<HomeContent>(() => {
    const saved = localStorage.getItem('homeContent');
    return saved ? JSON.parse(saved) : {
      hero: {
        title: "Transforme sua vida com a Terapia Cognitiva Comportamental",
        subtitle: "Sou Daiane Motta, Terapeuta Cognitiva Comportamental especializada em ajudar mulheres e crianças a superar desafios emocionais e conquistar uma vida mais equilibrada.",
        exclusiveMessage: "🌸 Atendimento exclusivo para mulheres e crianças 🌸"
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
