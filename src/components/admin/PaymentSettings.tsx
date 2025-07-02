
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Banknote, Smartphone, DollarSign } from "lucide-react";
import { toast } from "sonner";

const PaymentSettings = () => {
  const [paymentMethods, setPaymentMethods] = useState({
    cash: { enabled: true, description: "Pagamento em dinheiro no local" },
    card: { enabled: true, description: "Cartão de crédito ou débito" },
    pix: { enabled: true, description: "Pagamento via PIX" },
    bank_transfer: { enabled: false, description: "Transferência bancária" }
  });

  const [pixData, setPixData] = useState({
    key: "psicologadaianesilva@outlook.com",
    name: "Daiane Silva",
    bank: "Banco do Brasil"
  });

  const [bankData, setBankData] = useState({
    bank: "Banco do Brasil",
    agency: "1234-5",
    account: "12345-6",
    accountHolder: "Daiane Silva",
    cpf: "123.456.789-00"
  });

  const [policies, setPolicies] = useState({
    cancellationPolicy: "Cancelamentos devem ser feitos com pelo menos 24 horas de antecedência.",
    paymentPolicy: "O pagamento deve ser realizado no momento da consulta.",
    refundPolicy: "Reembolsos são processados em até 7 dias úteis para cancelamentos com mais de 48 horas de antecedência."
  });

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method as keyof typeof prev],
        enabled: !prev[method as keyof typeof prev].enabled
      }
    }));
  };

  const saveSettings = () => {
    toast.success("Configurações de pagamento salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Configurações de Pagamento</h2>
        <p className="text-rose-nude-600">Configure as formas de pagamento aceitas pela sua clínica.</p>
      </div>

      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Métodos de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Banknote className="h-5 w-5 text-rose-nude-500" />
                <div>
                  <h4 className="font-medium">Dinheiro</h4>
                  <p className="text-sm text-gray-600">{paymentMethods.cash.description}</p>
                </div>
              </div>
              <Switch
                checked={paymentMethods.cash.enabled}
                onCheckedChange={() => togglePaymentMethod('cash')}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-rose-nude-500" />
                <div>
                  <h4 className="font-medium">Cartão</h4>
                  <p className="text-sm text-gray-600">{paymentMethods.card.description}</p>
                </div>
              </div>
              <Switch
                checked={paymentMethods.card.enabled}
                onCheckedChange={() => togglePaymentMethod('card')}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-rose-nude-500" />
                <div>
                  <h4 className="font-medium">PIX</h4>
                  <p className="text-sm text-gray-600">{paymentMethods.pix.description}</p>
                </div>
              </div>
              <Switch
                checked={paymentMethods.pix.enabled}
                onCheckedChange={() => togglePaymentMethod('pix')}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-rose-nude-500" />
                <div>
                  <h4 className="font-medium">Transferência Bancária</h4>
                  <p className="text-sm text-gray-600">{paymentMethods.bank_transfer.description}</p>
                </div>
              </div>
              <Switch
                checked={paymentMethods.bank_transfer.enabled}
                onCheckedChange={() => togglePaymentMethod('bank_transfer')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {paymentMethods.pix.enabled && (
        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle>Dados PIX</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pixKey">Chave PIX</Label>
                <Input
                  id="pixKey"
                  value={pixData.key}
                  onChange={(e) => setPixData({...pixData, key: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pixName">Nome do Titular</Label>
                <Input
                  id="pixName"
                  value={pixData.name}
                  onChange={(e) => setPixData({...pixData, name: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pixBank">Banco</Label>
              <Input
                id="pixBank"
                value={pixData.bank}
                onChange={(e) => setPixData({...pixData, bank: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {paymentMethods.bank_transfer.enabled && (
        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle>Dados Bancários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Banco</Label>
                <Input
                  id="bankName"
                  value={bankData.bank}
                  onChange={(e) => setBankData({...bankData, bank: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency">Agência</Label>
                <Input
                  id="agency"
                  value={bankData.agency}
                  onChange={(e) => setBankData({...bankData, agency: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account">Conta</Label>
                <Input
                  id="account"
                  value={bankData.account}
                  onChange={(e) => setBankData({...bankData, account: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Titular</Label>
                <Input
                  id="accountHolder"
                  value={bankData.accountHolder}
                  onChange={(e) => setBankData({...bankData, accountHolder: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={bankData.cpf}
                onChange={(e) => setBankData({...bankData, cpf: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle>Políticas de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cancellation">Política de Cancelamento</Label>
            <Textarea
              id="cancellation"
              value={policies.cancellationPolicy}
              onChange={(e) => setPolicies({...policies, cancellationPolicy: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment">Política de Pagamento</Label>
            <Textarea
              id="payment"
              value={policies.paymentPolicy}
              onChange={(e) => setPolicies({...policies, paymentPolicy: e.target.value})}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="refund">Política de Reembolso</Label>
            <Textarea
              id="refund"
              value={policies.refundPolicy}
              onChange={(e) => setPolicies({...policies, refundPolicy: e.target.value})}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} className="bg-rose-nude-500 hover:bg-rose-nude-600">
        Salvar Configurações
      </Button>
    </div>
  );
};

export default PaymentSettings;
