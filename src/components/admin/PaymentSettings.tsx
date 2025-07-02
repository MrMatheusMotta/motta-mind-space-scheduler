
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { usePaymentSettings } from "@/hooks/usePaymentSettings";

const PaymentSettings = () => {
  const { payment, updatePayment } = usePaymentSettings();
  const [formData, setFormData] = useState(payment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePayment(formData);
    toast.success("Configurações de pagamento atualizadas com sucesso!");
  };

  const handleMethodChange = (method: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        paymentMethods: [...formData.paymentMethods, method]
      });
    } else {
      setFormData({
        ...formData,
        paymentMethods: formData.paymentMethods.filter(m => m !== method)
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        setFormData({ ...formData, qrCodeImage: imageDataUrl });
        toast.success("Imagem do QR Code carregada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeQRImage = () => {
    setFormData({ ...formData, qrCodeImage: undefined });
    toast.success("Imagem do QR Code removida!");
  };

  const paymentMethods = [
    { id: "PIX", label: "PIX" },
    { id: "Cartão de Crédito", label: "Cartão de Crédito" },
    { id: "Cartão de Débito", label: "Cartão de Débito" },
    { id: "Dinheiro", label: "Dinheiro" },
    { id: "Transferência", label: "Transferência Bancária" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Configurações de Pagamento</h2>
        <p className="text-rose-nude-600">Configure as formas de pagamento e valores de adiantamento.</p>
      </div>

      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Configurações de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="advancePercentage">Porcentagem de Adiantamento (%)</Label>
              <Input
                id="advancePercentage"
                type="number"
                min="0"
                max="100"
                value={formData.advancePercentage}
                onChange={(e) => setFormData({ ...formData, advancePercentage: Number(e.target.value) })}
                required
              />
              <p className="text-sm text-rose-nude-600">
                Valor que o cliente deve pagar antecipadamente para confirmar o agendamento
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input
                id="pixKey"
                value={formData.pixKey}
                onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                placeholder="Digite sua chave PIX"
              />
            </div>

            <div className="space-y-3">
              <Label>QR Code PIX</Label>
              <div className="space-y-3">
                {formData.qrCodeImage ? (
                  <div className="relative inline-block">
                    <img 
                      src={formData.qrCodeImage} 
                      alt="QR Code PIX" 
                      className="w-32 h-32 border border-rose-nude-200 rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeQRImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-rose-nude-200 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-rose-nude-400 mb-2" />
                    <p className="text-sm text-rose-nude-600 mb-2">
                      Clique para fazer upload do QR Code PIX
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="qr-upload"
                    />
                    <Label htmlFor="qr-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>Selecionar Imagem</span>
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Formas de Pagamento Aceitas</Label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={method.id}
                      checked={formData.paymentMethods.includes(method.id)}
                      onCheckedChange={(checked) => handleMethodChange(method.id, checked as boolean)}
                    />
                    <Label htmlFor={method.id} className="text-sm">
                      {method.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="bg-rose-nude-500 hover:bg-rose-nude-600">
              Salvar Configurações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSettings;
