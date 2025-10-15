import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const useAvailableTimeSlots = (selectedDate: Date | undefined, allTimeSlots: string[]) => {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots(allTimeSlots);
      setLoading(false);
      return;
    }

    const fetchAvailableSlots = async () => {
      setLoading(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        
        const { data: bookedAppointments, error } = await supabase
          .from('appointments')
          .select('time')
          .eq('date', dateStr)
          .in('status', ['agendado', 'confirmado']);

        if (error) {
          console.error('Erro ao buscar horários ocupados:', error);
          setAvailableSlots(allTimeSlots);
          setLoading(false);
          return;
        }

        const bookedTimes = bookedAppointments?.map(apt => {
          const timeStr = apt.time.toString();
          return timeStr.slice(0, 5);
        }) || [];

        const available = allTimeSlots.filter(slot => !bookedTimes.includes(slot));
        setAvailableSlots(available);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        setAvailableSlots(allTimeSlots);
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, allTimeSlots]);

  return { availableSlots, loading };
};
