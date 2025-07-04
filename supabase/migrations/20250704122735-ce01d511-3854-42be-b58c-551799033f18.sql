
-- Primeiro, vamos recriar a função is_admin para usar o email diretamente da sessão
CREATE OR REPLACE FUNCTION public.is_admin_by_email()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT auth.email() = 'psicologadaianesilva@outlook.com'),
    false
  );
$$;

-- Agora vamos atualizar as políticas RLS da tabela appointments
DROP POLICY IF EXISTS "Admins podem ver todos os agendamentos" ON public.appointments;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios agendamentos" ON public.appointments;
DROP POLICY IF EXISTS "Usuários podem criar seus próprios agendamentos" ON public.appointments;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios agendamentos" ON public.appointments;

-- Recriar as políticas sem usar a função problemática
CREATE POLICY "Admins podem ver todos os agendamentos" 
  ON public.appointments 
  FOR ALL 
  USING (auth.email() = 'psicologadaianesilva@outlook.com');

CREATE POLICY "Usuários podem ver seus próprios agendamentos" 
  ON public.appointments 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.email() = 'psicologadaianesilva@outlook.com');

CREATE POLICY "Usuários podem criar seus próprios agendamentos" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios agendamentos" 
  ON public.appointments 
  FOR UPDATE 
  USING (auth.uid() = user_id OR auth.email() = 'psicologadaianesilva@outlook.com');

-- Fazer o mesmo para a tabela profiles
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;

-- Recriar políticas da tabela profiles
CREATE POLICY "Admins podem ver todos os perfis" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.email() = 'psicologadaianesilva@outlook.com');

CREATE POLICY "Usuários podem ver seu próprio perfil" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id OR auth.email() = 'psicologadaianesilva@outlook.com');

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id OR auth.email() = 'psicologadaianesilva@outlook.com');

-- Permitir que usuários criem seus próprios perfis
CREATE POLICY "Usuários podem criar seu próprio perfil" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
