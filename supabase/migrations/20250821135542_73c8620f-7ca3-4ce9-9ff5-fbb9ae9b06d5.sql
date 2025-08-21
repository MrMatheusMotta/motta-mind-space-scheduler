-- Atualizar a política RLS da tabela appointments para usar o email correto
DROP POLICY IF EXISTS "Admins podem ver todos os agendamentos" ON appointments;

CREATE POLICY "Admins podem ver todos os agendamentos" 
ON appointments 
FOR ALL 
USING (
  auth.email() = 'psicologadaianesilva@outlook.com' OR 
  auth.email() = 'admin@daianemotta.com'
);

-- Verificar se a função is_admin está usando o email correto
CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN user_email = 'psicologadaianesilva@outlook.com' OR user_email = 'admin@daianemotta.com';
END;
$function$;