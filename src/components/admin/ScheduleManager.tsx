import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Clock, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  time: string;
  enabled: boolean;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
}

const ScheduleManager = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      day: "Segunda-feira",
      enabled: true,
      slots: [
        { id: "1", time: "08:00", enabled: true },
        { id: "2", time: "09:00", enabled: true },
        { id: "3", time: "10:00", enabled: true },
        { id: "4", time: "14:00", enabled: true },
        { id: "5", time: "15:00", enabled: true },
        { id: "6", time: "16:00", enabled: true },
      ]
    },
    {
      day: "Terça-feira",
      enabled: true,
      slots: [
        { id: "7", time: "08:00", enabled: true },
        { id: "8", time: "09:00", enabled: true },
        { id: "9", time: "10:00", enabled: true },
        { id: "10", time: "14:00", enabled: true },
        { id: "11", time: "15:00", enabled: true },
        { id: "12", time: "16:00", enabled: true },
      ]
    },
    {
      day: "Quarta-feira",
      enabled: true,
      slots: [
        { id: "13", time: "08:00", enabled: true },
        { id: "14", time: "09:00", enabled: true },
        { id: "15", time: "10:00", enabled: true },
        { id: "16", time: "14:00", enabled: true },
        { id: "17", time: "15:00", enabled: true },
        { id: "18", time: "16:00", enabled: true },
      ]
    },
    {
      day: "Quinta-feira",
      enabled: true,
      slots: [
        { id: "19", time: "08:00", enabled: true },
        { id: "20", time: "09:00", enabled: true },
        { id: "21", time: "10:00", enabled: true },
        { id: "22", time: "14:00", enabled: true },
        { id: "23", time: "15:00", enabled: true },
        { id: "24", time: "16:00", enabled: true },
      ]
    },
    {
      day: "Sexta-feira",
      enabled: true,
      slots: [
        { id: "25", time: "08:00", enabled: true },
        { id: "26", time: "09:00", enabled: true },
        { id: "27", time: "10:00", enabled: true },
        { id: "28", time: "14:00", enabled: true },
        { id: "29", time: "15:00", enabled: true },
        { id: "30", time: "16:00", enabled: true },
      ]
    },
    {
      day: "Sábado",
      enabled: false,
      slots: []
    },
    {
      day: "Domingo",
      enabled: false,
      slots: []
    }
  ]);

  const [newTimeSlot, setNewTimeSlot] = useState("");

  const toggleDay = (dayIndex: number) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, enabled: !day.enabled } : day
    ));
  };

  const toggleSlot = (dayIndex: number, slotId: string) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? {
            ...day,
            slots: day.slots.map(slot => 
              slot.id === slotId ? { ...slot, enabled: !slot.enabled } : slot
            )
          }
        : day
    ));
  };

  const addTimeSlot = (dayIndex: number) => {
    if (!newTimeSlot) return;

    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      time: newTimeSlot,
      enabled: true
    };

    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, slots: [...day.slots, newSlot].sort((a, b) => a.time.localeCompare(b.time)) }
        : day
    ));

    setNewTimeSlot("");
    toast.success("Horário adicionado com sucesso!");
  };

  const removeTimeSlot = (dayIndex: number, slotId: string) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, slots: day.slots.filter(slot => slot.id !== slotId) }
        : day
    ));
    toast.success("Horário removido com sucesso!");
  };

  const saveSchedule = () => {
    toast.success("Horários salvos com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-rose-nude-800">Gerenciar Horários</h2>
        <p className="text-rose-nude-600">Configure os horários de atendimento da sua clínica.</p>
      </div>

      <div className="space-y-4">
        {schedule.map((daySchedule, dayIndex) => (
          <Card key={daySchedule.day} className="border-rose-nude-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {daySchedule.day}
                </CardTitle>
                <Switch
                  checked={daySchedule.enabled}
                  onCheckedChange={() => toggleDay(dayIndex)}
                />
              </div>
            </CardHeader>
            
            {daySchedule.enabled && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {daySchedule.slots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={slot.enabled}
                          onCheckedChange={() => toggleSlot(dayIndex, slot.id)}
                        />
                        <span className={`text-sm ${slot.enabled ? 'text-rose-nude-800' : 'text-gray-400'}`}>
                          {slot.time}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(dayIndex, slot.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    className="w-32"
                  />
                  <Button
                    onClick={() => addTimeSlot(dayIndex)}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Button onClick={saveSchedule} className="bg-rose-nude-500 hover:bg-rose-nude-600">
        Salvar Horários
      </Button>
    </div>
  );
};

export default ScheduleManager;
