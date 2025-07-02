
import { useState } from "react";

interface ClinicSettings {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  description: string;
  openingHours: string;
}

const defaultClinic: ClinicSettings = {
  name: "Consultório Dra. Daiane Silva",
  address: "Av Cardoso Moreira, 193, Centro",
  city: "Itaperuna - RJ, CEP 28300-000",
  phone: "(22) 99972-3737",
  email: "psicologadaianesilva@outlook.com",
  description: "Atendimento psicológico especializado para mulheres e crianças neuroatípicas, oferecendo um ambiente acolhedor e profissional para seu bem-estar emocional.",
  openingHours: "Atendimentos: 18h às 21h (dias úteis)"
};

export const useClinicSettings = () => {
  const [clinic, setClinic] = useState<ClinicSettings>(() => {
    const saved = localStorage.getItem('clinicSettings');
    return saved ? JSON.parse(saved) : defaultClinic;
  });

  const updateClinic = (newClinic: Partial<ClinicSettings>) => {
    const updated = { ...clinic, ...newClinic };
    setClinic(updated);
    localStorage.setItem('clinicSettings', JSON.stringify(updated));
  };

  return {
    clinic,
    updateClinic
  };
};
