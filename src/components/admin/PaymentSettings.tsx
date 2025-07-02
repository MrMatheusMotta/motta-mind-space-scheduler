
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Percent, DollarSign, QrCode, Upload, X } from "lucide-react";
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

  const handleQrCodeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPaymentData(prev => ({ ...prev, qrCodeImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeQrCode = () => {
    setPaymentData(prev => ({ ...prev, qrCodeImage: undefined }));
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
              <QrCode className="h-5 w-5" />
              QR Code PIX
            </CardTitle>
            <CardDescription>
              Faça upload de uma imagem do QR Code para facilitar o pagamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentData.qrCodeImage ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img 
                    src={paymentData.qrCodeImage} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 object-contain border border-rose-nude-200 rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2"
                    onClick={removeQrCode}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-rose-nude-600">
                  QR Code carregado com sucesso. Clique no X para remover.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-rose-nude-300 rounded-lg p-6 text-center">
                  <QrCode className="w-12 h-12 text-rose-nude-400 mx-auto mb-4" />
                  <p className="text-rose-nude-600 mb-4">
                    Nenhum QR Code carregado
                  </p>
                  <Label htmlFor="qrCode" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 bg-rose-nude-100 hover:bg-rose-nude-200 text-rose-nude-700 px-4 py-2 rounded-lg transition-colors">
                      <Upload className="h-4 w-4" />
                      Carregar QR Code
                    </div>
                  </Label>
                  <Input
                    id="qrCode"
                    type="file"
                    accept="image/*"
                    onChange={handleQrCodeUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-rose-nude-500">
                  Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
                </p>
              </div>
            )}
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
              {paymentData.qrCodeImage && <li>• QR Code disponível para pagamento</li>}
            </ul>
          </div>
          {paymentData.qrCodeImage && (
            <div className="text-center">
              <p className="text-sm text-rose-nude-600 mb-2">QR Code PIX:</p>
              <img 
                src={paymentData.qrCodeImage} 
                alt="QR Code PIX Preview" 
                className="w-32 h-32 object-contain border border-rose-nude-200 rounded-lg mx-auto"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSettings;
