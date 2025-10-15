import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const useAvailableTimeSlots = (selectedDate: Date | undefined, allTimeSlots: string[]) => {
  const [availableSlots, setAvailableSlots] = useState<string[]>(allTimeSlots ?? []);
  const [loading, setLoading] = useState(false);

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined;
  const slotsKey = (allTimeSlots || []).join('|');

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots(allTimeSlots);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchAvailableSlots = async () => {
      setLoading(true);
      try {
        const { data: bookedAppointments, error } = await supabase
          .from('appointments')
          .select('time')
          .eq('date', dateStr as string)
          .in('status', ['agendado', 'confirmado']);

        if (error) {
          console.error('Erro ao buscar horários ocupados:', error);
          if (!cancelled) {
            setAvailableSlots(allTimeSlots);
            setLoading(false);
          }
          return;
        }

        const bookedTimes = bookedAppointments?.map((apt: { time: string }) => {
          const timeStr = apt.time?.toString?.() ?? '';
          return timeStr.slice(0, 5);
        }) || [];

        const available = allTimeSlots.filter(slot => !bookedTimes.includes(slot));
        if (!cancelled) {
          setAvailableSlots(available);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        if (!cancelled) {
          setAvailableSlots(allTimeSlots);
          setLoading(false);
        }
      }
    };

    fetchAvailableSlots();

    return () => {
      cancelled = true;
    };
  }, [dateStr, slotsKey]);

  return { availableSlots, loading };
};
