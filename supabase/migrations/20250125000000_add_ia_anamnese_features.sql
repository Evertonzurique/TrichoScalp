-- Add IA Anamnese features to TrichoScalp
-- Migration: Add analise_ia field to avaliacoes table and consentimento fields to clientes table

-- Create storage buckets (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'tricoscopia') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('tricoscopia', 'tricoscopia', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'fotos-cliente') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('fotos-cliente', 'fotos-cliente', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']);
  END IF;
END $$;

-- Add analise_ia field to avaliacoes table
ALTER TABLE public.avaliacoes 
ADD COLUMN analise_ia JSONB;

-- Add consentimento fields to clientes table
ALTER TABLE public.clientes 
ADD COLUMN consentimento_ia BOOLEAN DEFAULT false,
ADD COLUMN consentimento_ia_data TIMESTAMP WITH TIME ZONE;

-- Create indexes for optimization
CREATE INDEX IF NOT EXISTS idx_avaliacoes_analise_ia ON public.avaliacoes USING GIN (analise_ia);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_cliente_created ON public.avaliacoes (cliente_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clientes_consentimento_ia ON public.clientes (consentimento_ia);

-- Create RLS policies for storage buckets
CREATE POLICY "Authenticated users can view tricoscopia images"
ON storage.objects FOR SELECT
USING (bucket_id = 'tricoscopia' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload tricoscopia images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tricoscopia' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tricoscopia images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'tricoscopia' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tricoscopia images"
ON storage.objects FOR DELETE
USING (bucket_id = 'tricoscopia' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view fotos-cliente images"
ON storage.objects FOR SELECT
USING (bucket_id = 'fotos-cliente' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload fotos-cliente images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'fotos-cliente' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update fotos-cliente images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'fotos-cliente' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete fotos-cliente images"
ON storage.objects FOR DELETE
USING (bucket_id = 'fotos-cliente' AND auth.role() = 'authenticated');

-- Add comment to analise_ia field
COMMENT ON COLUMN public.avaliacoes.analise_ia IS 'Análise de IA da assessoria de anamnese com dados quantitativos, qualitativos e comparativos';

-- Add comment to consentimento fields
COMMENT ON COLUMN public.clientes.consentimento_ia IS 'Consentimento do cliente para análise automatizada de imagens via IA';
COMMENT ON COLUMN public.clientes.consentimento_ia_data IS 'Data e hora do consentimento para análise IA';
