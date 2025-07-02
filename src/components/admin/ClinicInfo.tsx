
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { useClinicSettings } from "@/hooks/useClinicSettings";

const ClinicInfo = () => {
  const { clinic, updateClinic } = useClinicSettings();
  const [formData, setFormData] = useState(clinic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinic(formData);
    toast.success("Informações da clínica atualizadas com sucesso!");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Informações da Clínica</h2>
        <p className="text-rose-nude-600">Configure as informações básicas do seu consultório.</p>
      </div>

      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Dados do Consultório
          </CardTitle>
          <CardDescription>
            Essas informações serão exibidas no site e nos agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Consultório</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="openingHours">Horários de Funcionamento</Label>
              <Input
                id="openingHours"
                value={formData.openingHours}
                onChange={(e) => handleInputChange('openingHours', e.target.value)}
                placeholder="Ex: Segunda a Sexta: 8h às 18h"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                placeholder="Descreva seu consultório e especialidades..."
              />
            </div>

            <Button type="submit" className="bg-rose-nude-500 hover:bg-rose-nude-600">
              Salvar Informações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicInfo;
