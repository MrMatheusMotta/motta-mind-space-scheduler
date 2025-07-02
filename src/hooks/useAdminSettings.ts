
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
    paymentMethods: ["PIX", "Cartão de Crédito", "Dinheiro"]
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
