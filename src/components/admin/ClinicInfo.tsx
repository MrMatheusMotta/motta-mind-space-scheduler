
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAdminSettings } from "@/hooks/useAdminSettings";

const ClinicInfo = () => {
  const { settings, updateClinic } = useAdminSettings();
  const [clinicData, setClinicData] = useState(settings.clinic);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinic(clinicData);
    toast.success("Informações da clínica atualizadas com sucesso!");
  };

  const handleChange = (field: string, value: string) => {
    setClinicData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Informações da Clínica</h2>
        <p className="text-rose-nude-600">Configure as informações básicas do seu consultório.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Dados Básicos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Clínica</Label>
                <Input
                  id="name"
                  value={clinicData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={clinicData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={clinicData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={clinicData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={clinicData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-rose-nude-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Horário de Funcionamento</Label>
              <Input
                id="hours"
                value={clinicData.openingHours}
                onChange={(e) => handleChange("openingHours", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição da Clínica</Label>
              <Textarea
                id="description"
                value={clinicData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="bg-rose-nude-500 hover:bg-rose-nude-600">
          Salvar Informações
        </Button>
      </form>

      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle>Prévia das Informações</CardTitle>
          <CardDescription>
            Como as informações aparecerão no site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-rose-nude-50 rounded-lg">
            <h3 className="font-semibold text-rose-nude-800 mb-2">{clinicData.name}</h3>
            <p className="text-rose-nude-600 mb-3">{clinicData.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-nude-500" />
                <span>{clinicData.address}, {clinicData.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-rose-nude-500" />
                <span>{clinicData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-rose-nude-500" />
                <span>{clinicData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-rose-nude-500" />
                <span>{clinicData.openingHours}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicInfo;
