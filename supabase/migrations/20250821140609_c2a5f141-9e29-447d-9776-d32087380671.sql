-- Testar se o email correto está sendo usado
SELECT auth.email() as current_email;

-- Verificar a função is_admin_by_email
SELECT is_admin_by_email() as is_admin_check;

-- Criar uma versão mais robusta da política RLS
DROP POLICY IF EXISTS "Admins podem ver todos os agendamentos" ON appointments;

-- Política que permite ao usuário ver seus próprios agendamentos e ao admin ver todos
CREATE POLICY "Permitir acesso aos agendamentos" 
ON appointments 
FOR ALL 
USING (
  -- Usuário pode ver seus próprios agendamentos
  auth.uid() = user_id 
  OR 
  -- Admin pode ver todos (usando email direto para garantir que funciona)
  auth.email() = 'psicologadaianesilva@outlook.com'
);

-- Testar a política com uma consulta direta
SELECT COUNT(*) as total_appointments FROM appointments;