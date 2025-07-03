
-- Adicionar coluna 'type' na tabela appointments para armazenar se é presencial ou online
ALTER TABLE public.appointments 
ADD COLUMN type TEXT;
