
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useServicesSettings, type Service } from "@/hooks/useServicesSettings";

const ServicesManager = () => {
  const { services, updateServices } = useServicesSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 50,
    price: 0,
    priceOnline: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      const updatedServices = services.map(service => 
        service.id === editingService.id 
          ? { ...editingService, ...formData, priceOnline: formData.priceOnline || undefined }
          : service
      );
      updateServices(updatedServices);
      toast.success("Serviço atualizado com sucesso!");
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        ...formData,
        priceOnline: formData.priceOnline || undefined
      };
      updateServices([...services, newService]);
      toast.success("Serviço criado com sucesso!");
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", duration: 50, price: 0, priceOnline: 0 });
    setIsEditing(false);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      priceOnline: service.priceOnline || 0
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    updateServices(updatedServices);
    toast.success("Serviço removido com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Gerenciar Serviços</h2>
        <p className="text-rose-nude-600">Configure os serviços oferecidos pelo seu consultório.</p>
      </div>

      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {isEditing ? "Editar Serviço" : "Novo Serviço"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Serviço</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="5"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço Presencial (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceOnline">Preço Online (R$) - Opcional</Label>
                <Input
                  id="priceOnline"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceOnline}
                  onChange={(e) => setFormData({...formData, priceOnline: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-rose-nude-500 hover:bg-rose-nude-600">
                {isEditing ? "Atualizar" : "Criar"} Serviço
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <h3 className="text-lg font-medium text-rose-nude-800">Serviços Disponíveis</h3>
        {services.map((service) => (
          <Card key={service.id} className="border-rose-nude-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-medium text-rose-nude-800">{service.name}</h4>
                  <p className="text-sm text-rose-nude-600">{service.description}</p>
                  <div className="flex gap-4 text-sm text-rose-nude-700">
                    <span>Duração: {service.duration} min</span>
                    <span>Presencial: R$ {service.price.toFixed(2)}</span>
                    {service.priceOnline && (
                      <span>Online: R$ {service.priceOnline.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;
