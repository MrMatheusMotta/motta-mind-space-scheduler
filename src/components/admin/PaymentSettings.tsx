
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Percent, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useAdminSettings } from "@/hooks/useAdminSettings";

const PaymentSettings = () => {
  const { settings, updatePayment } = useAdminSettings();
  const [paymentData, setPaymentData] = useState(settings.payment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePayment(paymentData);
    toast.success("Configurações de pagamento atualizadas com sucesso!");
  };

  const handleMethodToggle = (method: string, enabled: boolean) => {
    const methods = enabled 
      ? [...paymentData.paymentMethods, method]
      : paymentData.paymentMethods.filter(m => m !== method);
    
    setPaymentData(prev => ({ ...prev, paymentMethods: methods }));
  };

  const availableMethods = ["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Transferência Bancária"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Configurações de Pagamento</h2>
        <p className="text-rose-nude-600">Configure as formas de pagamento e valores de entrada.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Valor de Entrada
            </CardTitle>
            <CardDescription>
              Defina o percentual de entrada para confirmação do agendamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="advance">Percentual de Entrada (%)</Label>
              <Input
                id="advance"
                type="number"
                min="0"
                max="100"
                value={paymentData.advancePercentage}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  advancePercentage: Number(e.target.value) 
                }))}
              />
              <p className="text-sm text-rose-nude-600">
                Valor atual: {paymentData.advancePercentage}% do valor da consulta
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Chave PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input
                id="pixKey"
                value={paymentData.pixKey}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  pixKey: e.target.value 
                }))}
                placeholder="Digite sua chave PIX"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Formas de Pagamento
            </CardTitle>
            <CardDescription>
              Selecione as formas de pagamento aceitas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableMethods.map((method) => (
              <div key={method} className="flex items-center justify-between">
                <Label htmlFor={method} className="text-rose-nude-700">
                  {method}
                </Label>
                <Switch
                  id={method}
                  checked={paymentData.paymentMethods.includes(method)}
                  onCheckedChange={(checked) => handleMethodToggle(method, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" className="bg-rose-nude-500 hover:bg-rose-nude-600">
          Salvar Configurações
        </Button>
      </form>

      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle>Prévia das Configurações</CardTitle>
          <CardDescription>
            Como as configurações aparecerão para os clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-rose-nude-50 rounded-lg">
            <h4 className="font-medium text-rose-nude-800 mb-2">Condições de Pagamento:</h4>
            <ul className="text-sm text-rose-nude-600 space-y-1">
              <li>• Entrada de {paymentData.advancePercentage}% via PIX no ato do agendamento</li>
              <li>• Formas de pagamento aceitas: {paymentData.paymentMethods.join(", ")}</li>
              <li>• Chave PIX: {paymentData.pixKey}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSettings;
