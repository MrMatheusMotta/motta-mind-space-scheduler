
import { useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  priceOnline?: number;
}

const defaultServices: Service[] = [
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
];

export const useServicesSettings = () => {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('servicesSettings');
    return saved ? JSON.parse(saved) : defaultServices;
  });

  const updateServices = (newServices: Service[]) => {
    setServices(newServices);
    localStorage.setItem('servicesSettings', JSON.stringify(newServices));
  };

  return {
    services,
    updateServices
  };
};

export type { Service };
