import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Valid image MIME types
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates if a file is a valid image
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Arquivo muito grande. Tamanho máximo: 10MB.'
    };
  }

  return { valid: true };
}

/**
 * Generates a unique file path for storage
 */
export function generateFilePath(
  bucket: 'tricoscopia' | 'fotos-cliente',
  clienteId: string,
  originalName: string
): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop() || 'jpg';
  const fileName = `${timestamp}_${Math.random().toString(36).substring(2, 15)}.${extension}`;
  return `${clienteId}/${fileName}`;
}

/**
 * Uploads an image file to Supabase Storage
 */
export async function uploadImageToStorage(
  file: File,
  bucket: 'tricoscopia' | 'fotos-cliente',
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type // garante que o objeto tenha o MIME correto
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: `Erro no upload: ${error.message}`
      };
    }

    // Sempre gera URL assinada (funciona para buckets privados e públicos)
    // Evita o problema de getPublicUrl retornar rota /public em bucket privado
    const { data: signed, error: signErr } = await supabase.storage
      .from(bucket)
      .createSignedUrl(data.path, 60 * 60 * 24 * 365); // 365 dias
    if (signErr || !signed?.signedUrl) {
      // Fallback para URL pública (caso o bucket seja público)
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      if (!urlData?.publicUrl) {
        console.error('URL generation error:', signErr);
        return {
          success: false,
          error: `Não foi possível gerar URL de acesso ao arquivo.`
        };
      }
      return {
        success: true,
        url: urlData.publicUrl,
        path: data.path
      };
    }

    return {
      success: true,
      url: signed.signedUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: 'Erro inesperado durante o upload'
    };
  }
}

/**
 * Gets public URL for a file in storage
 */
export function getPublicUrl(bucket: 'tricoscopia' | 'fotos-cliente', path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Deletes an image from storage
 */
export async function deleteImage(
  bucket: 'tricoscopia' | 'fotos-cliente',
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return {
        success: false,
        error: `Erro ao deletar: ${error.message}`
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: 'Erro inesperado ao deletar arquivo'
    };
  }
}

/**
 * Uploads multiple images in batch
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: 'tricoscopia' | 'fotos-cliente',
  clienteId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ results: UploadResult[]; successCount: number; errorCount: number }> {
  const results: UploadResult[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = generateFilePath(bucket, clienteId, file.name);
    
    const result = await uploadImageToStorage(file, bucket, path, onProgress);
    results.push(result);
    
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  return {
    results,
    successCount,
    errorCount
  };
}

/**
 * Extracts file path from public URL
 */
export function extractPathFromUrl(url: string, bucket: 'tricoscopia' | 'fotos-cliente'): string | null {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(new RegExp(`/${bucket}/(.+)$`));
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}


