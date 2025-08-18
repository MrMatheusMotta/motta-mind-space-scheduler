
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, CreditCard, QrCode, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";
import { supabase } from "@/integrations/supabase/client";

interface PaymentData {
  appointmentId: string;
  service: string;
  date: string;
  time: string;
  type: string | null;
  totalPrice: number;
  advanceAmount: number;
  advancePercentage: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const { payment } = usePaymentSettings();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  useEffect(() => {
    const savedData = localStorage.getItem('pendingPayment');
    if (savedData) {
      setPaymentData(JSON.parse(savedData));
    } else {
      toast.error("Dados do agendamento não encontrados");
      navigate("/booking");
    }
  }, [navigate]);

  const handlePaymentConfirmation = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Selecione uma forma de pagamento");
      return;
    }

    try {
      // Atualizar status do agendamento para 'confirmado'
      if (paymentData?.appointmentId) {
        const { error } = await supabase
          .from('appointments')
          .update({ status: 'confirmado' })
          .eq('id', paymentData.appointmentId);

        if (error) {
          console.error('Erro ao atualizar status:', error);
          toast.error("Erro ao confirmar pagamento");
          return;
        }
      }

      // Simular processamento do pagamento
      toast.success("Pagamento confirmado com sucesso!");
      
      // Limpar dados temporários
      localStorage.removeItem('pendingPayment');
      
      // Navegar para meus agendamentos após sucesso
      setTimeout(() => {
        navigate("/my-appointments");
      }, 2000);
    } catch (error) {
      console.error('Erro:', error);
      toast.error("Erro inesperado ao processar pagamento");
    }
  };

  const handleBackToBooking = () => {
    localStorage.removeItem('pendingPayment');
    navigate("/booking");
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-rose-nude-800">Carregando...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-nude-50 via-white to-nude-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Pagamento</h1>
            <p className="text-lg text-rose-nude-600">
              Confirme seu agendamento realizando o pagamento do adiantamento
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Resumo do Agendamento */}
            <Card className="border-rose-nude-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-rose-nude-800">Resumo do Agendamento</CardTitle>
                <CardDescription className="text-rose-nude-600">
                  Verifique os detalhes da sua consulta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-rose-nude-600">Serviço:</span>
                  <span className="text-sm font-medium">{paymentData.service}</span>
                </div>
                
                {paymentData.type && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-rose-nude-600">Modalidade:</span>
                    <span className="text-sm font-medium capitalize">{paymentData.type}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-rose-nude-600">Data:</span>
                  <span className="text-sm font-medium">{paymentData.date}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-rose-nude-600">Horário:</span>
                  <span className="text-sm font-medium">{paymentData.time}</span>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-rose-nude-600">Valor Total:</span>
                    <span className="text-sm font-medium">R$ {paymentData.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-rose-nude-600">
                      Adiantamento ({paymentData.advancePercentage}%):
                    </span>
                    <span className="text-xl font-bold text-rose-nude-800">
                      R$ {paymentData.advanceAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-rose-nude-500">
                    <span>Restante a pagar no dia:</span>
                    <span>R$ {(paymentData.totalPrice - paymentData.advanceAmount).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formas de Pagamento */}
            <Card className="border-rose-nude-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-rose-nude-800">Formas de Pagamento</CardTitle>
                <CardDescription className="text-rose-nude-600">
                  Escolha como deseja pagar o adiantamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {payment.paymentMethods.map((method) => (
                    <Card
                      key={method}
                      className={`cursor-pointer transition-all border-2 ${
                        selectedPaymentMethod === method
                          ? "border-rose-nude-500 bg-rose-nude-50"
                          : "border-rose-nude-200 hover:border-rose-nude-300"
                      }`}
                      onClick={() => setSelectedPaymentMethod(method)}
                    >
                      <CardContent className="p-4 flex items-center space-x-3">
                        {method === "PIX" ? (
                          <QrCode className="w-6 h-6 text-rose-nude-600" />
                        ) : (
                          <CreditCard className="w-6 h-6 text-rose-nude-600" />
                        )}
                        <span className="font-medium text-rose-nude-800">{method}</span>
                        {selectedPaymentMethod === method && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedPaymentMethod === "PIX" && payment.pixKey && (
                  <div className="mt-6 p-4 bg-rose-nude-50 rounded-lg">
                    <h4 className="font-medium text-rose-nude-800 mb-2">Dados PIX</h4>
                    <p className="text-sm text-rose-nude-600 mb-2">Chave PIX:</p>
                    <p className="text-sm font-mono bg-white p-2 rounded border">
                      {payment.pixKey}
                    </p>
                    {payment.qrCodeImage && (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-rose-nude-600 mb-2">QR Code:</p>
                        <div className="flex justify-center">
                          <img 
                            src={payment.qrCodeImage} 
                            alt="QR Code PIX" 
                            className="w-32 h-32 border border-rose-nude-200 rounded"
                          />
                        </div>
                      </div>
                    )}
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        ⚠️ <strong>Importante:</strong> Após realizar o pagamento, envie o comprovante com seu nome completo para o WhatsApp da Dr. Daiane Motta para confirmar o agendamento.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handlePaymentConfirmation}
                    className="w-full bg-rose-nude-500 hover:bg-rose-nude-600 text-white py-3"
                    disabled={!selectedPaymentMethod}
                  >
                    Confirmar Pagamento
                  </Button>
                  
                  <Button
                    onClick={handleBackToBooking}
                    variant="outline"
                    className="w-full border-rose-nude-200 text-rose-nude-600 hover:bg-rose-nude-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao Agendamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
