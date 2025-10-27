-- 1) Impedir agendamentos duplicados no banco com trigger usando is_slot_available
CREATE OR REPLACE FUNCTION public.prevent_double_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status IN ('agendado','confirmado') THEN
    IF NOT public.is_slot_available(NEW.date, NEW.time, CASE WHEN TG_OP = 'UPDATE' THEN NEW.id ELSE NULL END) THEN
      RAISE EXCEPTION 'Horário já ocupado para % às %', NEW.date, NEW.time USING ERRCODE = 'unique_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_double_booking_ins ON public.appointments;
CREATE TRIGGER trg_prevent_double_booking_ins
BEFORE INSERT ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.prevent_double_booking();

DROP TRIGGER IF EXISTS trg_prevent_double_booking_upd ON public.appointments;
CREATE TRIGGER trg_prevent_double_booking_upd
BEFORE UPDATE OF date, time, status ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.prevent_double_booking();

-- 2) Atualizar RLS para admins (por email ou role) enxergarem dados necessários
-- appointments
DROP POLICY IF EXISTS "Permitir acesso aos agendamentos" ON public.appointments;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios agendamentos" ON public.appointments;
DROP POLICY IF EXISTS "Usuários podem criar agendamentos" ON public.appointments;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios agendamentos" ON public.appointments;

CREATE POLICY "Permitir acesso aos agendamentos"
ON public.appointments
FOR ALL
TO authenticated
USING (auth.uid() = user_id OR public.is_admin_by_email());

CREATE POLICY "Usuários podem atualizar seus próprios agendamentos"
ON public.appointments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin_by_email());

CREATE POLICY "Usuários podem criar agendamentos"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.is_admin_by_email());

CREATE POLICY "Usuários podem ver seus próprios agendamentos"
ON public.appointments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin_by_email());

-- profiles
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem criar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;

CREATE POLICY "Admins podem ver todos os perfis"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin_by_email() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.is_admin_by_email() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Usuários podem criar seu próprio perfil"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id OR public.is_admin_by_email() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Usuários podem ver seu próprio perfil"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin_by_email() OR public.has_role(auth.uid(),'admin'));

-- evolutions
DROP POLICY IF EXISTS "Admins can manage evolutions" ON public.evolutions;

CREATE POLICY "Admins can manage evolutions"
ON public.evolutions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.is_admin_by_email())
WITH CHECK (public.has_role(auth.uid(),'admin') OR public.is_admin_by_email());