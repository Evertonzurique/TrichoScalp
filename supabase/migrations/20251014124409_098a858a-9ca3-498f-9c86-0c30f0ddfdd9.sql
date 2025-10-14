-- Substituir campo CEP por Instagram na tabela clientes
ALTER TABLE public.clientes 
DROP COLUMN cep,
ADD COLUMN instagram text;