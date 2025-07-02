
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface UnavailableDate {
  id: string;
  date: string;
  reason: string;
  isRecurring: boolean;
}

const AvailabilityManager = () => {
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([
    {
      id: "1",
      date: "2024-12-25",
      reason: "Natal",
      isRecurring: true
    },
    {
      id: "2",
      date: "2024-01-01",
      reason: "Ano Novo",
      isRecurring: true
    }
  ]);

  const [newDate, setNewDate] = useState({
    date: "",
    reason: "",
    isRecurring: false
  });

  const [vacationPeriod, setVacationPeriod] = useState({
    startDate: "",
    endDate: "",
    reason: ""
  });

  const addUnavailableDate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDate.date || !newDate.reason) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const unavailableDate: UnavailableDate = {
      id: Date.now().toString(),
      ...newDate
    };

    setUnavailableDates([...unavailableDates, unavailableDate]);
    setNewDate({ date: "", reason: "", isRecurring: false });
    toast.success("Data indisponível adicionada com sucesso!");
  };

  const removeUnavailableDate = (id: string) => {
    setUnavailableDates(unavailableDates.filter(date => date.id !== id));
    toast.success("Data removida com sucesso!");
  };

  const addVacationPeriod = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vacationPeriod.startDate || !vacationPeriod.endDate) {
      toast.error("Por favor, selecione as datas de início e fim");
      return;
    }

    // Aqui você pode processar o período de férias
    toast.success("Período de férias configurado com sucesso!");
    setVacationPeriod({ startDate: "", endDate: "", reason: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Gerenciar Disponibilidade</h2>
        <p className="text-rose-nude-600">Configure datas indisponíveis e períodos de férias.</p>
      </div>

      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Adicionar Data Indisponível
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addUnavailableDate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={newDate.date}
                  onChange={(e) => setNewDate({...newDate, date: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo</Label>
                <Input
                  id="reason"
                  value={newDate.reason}
                  onChange={(e) => setNewDate({...newDate, reason: e.target.value})}
                  placeholder="Ex: Feriado, Compromisso pessoal"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recurring"
                checked={newDate.isRecurring}
                onChange={(e) => setNewDate({...newDate, isRecurring: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="recurring">Data recorrente (repete anualmente)</Label>
            </div>

            <Button type="submit" className="bg-rose-nude-500 hover:bg-rose-nude-600">
              Adicionar Data
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Período de Férias
          </CardTitle>
          <CardDescription>
            Configure um período contínuo de indisponibilidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addVacationPeriod} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={vacationPeriod.startDate}
                  onChange={(e) => setVacationPeriod({...vacationPeriod, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={vacationPeriod.endDate}
                  onChange={(e) => setVacationPeriod({...vacationPeriod, endDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vacationReason">Motivo (opcional)</Label>
              <Input
                id="vacationReason"
                value={vacationPeriod.reason}
                onChange={(e) => setVacationPeriod({...vacationPeriod, reason: e.target.value})}
                placeholder="Ex: Férias, Viagem"
              />
            </div>

            <Button type="submit" className="bg-rose-nude-500 hover:bg-rose-nude-600">
              Configurar Período
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-rose-nude-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Datas Indisponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unavailableDates.length === 0 ? (
            <p className="text-rose-nude-600">Nenhuma data indisponível configurada.</p>
          ) : (
            <div className="space-y-2">
              {unavailableDates.map((date) => (
                <div key={date.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">
                      {new Date(date.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-sm text-rose-nude-600 ml-2">
                      - {date.reason}
                    </span>
                    {date.isRecurring && (
                      <span className="ml-2 text-xs bg-rose-nude-100 text-rose-nude-800 px-2 py-1 rounded">
                        Recorrente
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeUnavailableDate(date.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityManager;
