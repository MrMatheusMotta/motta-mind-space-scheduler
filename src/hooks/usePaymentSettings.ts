
import { useState } from "react";

interface PaymentSettings {
  advancePercentage: number;
  pixKey: string;
  paymentMethods: string[];
  qrCodeImage?: string;
}

const defaultPayment: PaymentSettings = {
  advancePercentage: 50,
  pixKey: "psicologadaianesilva@outlook.com",
  paymentMethods: ["PIX", "Cartão de Crédito", "Dinheiro"],
  qrCodeImage: undefined
};

export const usePaymentSettings = () => {
  const [payment, setPayment] = useState<PaymentSettings>(() => {
    const saved = localStorage.getItem('paymentSettings');
    return saved ? JSON.parse(saved) : defaultPayment;
  });

  const updatePayment = (newPayment: Partial<PaymentSettings>) => {
    const updated = { ...payment, ...newPayment };
    setPayment(updated);
    localStorage.setItem('paymentSettings', JSON.stringify(updated));
  };

  return {
    payment,
    updatePayment
  };
};
