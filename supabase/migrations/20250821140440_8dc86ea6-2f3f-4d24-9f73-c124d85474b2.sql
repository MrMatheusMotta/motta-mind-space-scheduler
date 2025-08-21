-- Corrigir a política RLS para appointments - o problema está na política atual
DROP POLICY IF EXISTS "Admins podem ver todos os agendamentos" ON appointments;

-- Recriar a política com a lógica correta usando a função is_admin_by_email
CREATE POLICY "Admins podem ver todos os agendamentos" 
ON appointments 
FOR ALL 
USING (
  -- Usuários podem ver seus próprios agendamentos OU admins podem ver todos
  (auth.uid() = user_id) OR is_admin_by_email()
);

-- Verificar se a função is_admin_by_email está funcionando corretamente
-- Testando se retorna true para o email da admin
SELECT is_admin_by_email() as is_admin_test;