-- Criar função segura para buscar informações de perfil sem acessar auth.users
CREATE OR REPLACE FUNCTION public.get_profile_with_email(profile_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  phone text,
  cpf text,
  avatar_url text,
  email text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.cpf,
    p.avatar_url,
    (SELECT au.email FROM auth.users au WHERE au.id = p.id) as email
  FROM public.profiles p
  WHERE p.id = profile_id;
END;
$$;

-- Criar índice para melhorar performance de consultas de disponibilidade
CREATE INDEX IF NOT EXISTS idx_appointments_date_time_status 
ON public.appointments(date, time, status);

-- Criar função para verificar disponibilidade de horário
CREATE OR REPLACE FUNCTION public.is_slot_available(
  check_date date,
  check_time time,
  exclude_appointment_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  slot_count integer;
BEGIN
  SELECT COUNT(*) INTO slot_count
  FROM public.appointments
  WHERE date = check_date
    AND time = check_time
    AND status IN ('agendado', 'confirmado')
    AND (exclude_appointment_id IS NULL OR id != exclude_appointment_id);
  
  RETURN slot_count = 0;
END;
$$;

-- Adicionar coluna para admin criar agendamento para outros usuários
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS created_by_admin uuid REFERENCES auth.users(id);

-- Atualizar política RLS para permitir admin criar agendamento para qualquer usuário
DROP POLICY IF EXISTS "Usuários podem criar seus próprios agendamentos" ON public.appointments;

CREATE POLICY "Usuários podem criar agendamentos" 
ON public.appointments 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  (auth.email() IN ('psicologadaianesilva@outlook.com', 'admin@daianemotta.com'))
);