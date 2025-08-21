-- Corrigir o search_path da função is_admin_by_email também
CREATE OR REPLACE FUNCTION public.is_admin_by_email()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT COALESCE(
    (SELECT auth.email() = 'psicologadaianesilva@outlook.com' OR auth.email() = 'admin@daianemotta.com'),
    false
  );
$function$;