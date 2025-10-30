import { useState, useCallback } from 'react';
import { uploadImageToStorage, uploadMultipleImages, validateImageFile, generateFilePath, type UploadResult, type UploadProgress } from '@/lib/storage';

export interface UseUploadImagensOptions {
  bucket: 'tricoscopia' | 'fotos-cliente';
  clienteId: string;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (results: UploadResult[]) => void;
  onError?: (error: string) => void;
}

export interface UseUploadImagensReturn {
  uploadSingle: (file: File, customPath?: string) => Promise<UploadResult>;
  uploadMultiple: (files: File[]) => Promise<{ results: UploadResult[]; successCount: number; errorCount: number }>;
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook para gerenciar upload de imagens para Supabase Storage
 */
export function useUploadImagens({
  bucket,
  clienteId,
  onProgress,
  onComplete,
  onError
}: UseUploadImagensOptions): UseUploadImagensReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const uploadSingle = useCallback(async (file: File, customPath?: string): Promise<UploadResult> => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(null);

      // Validar arquivo
      const validation = validateImageFile(file);
      if (!validation.valid) {
        const errorMsg = validation.error || 'Arquivo inválido';
        setError(errorMsg);
        onError?.(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Gerar path se não fornecido
      const path = customPath || generateFilePath(bucket, clienteId, file.name);

      // Upload
      const result = await uploadImageToStorage(file, bucket, path, (uploadProgress) => {
        setProgress(uploadProgress);
        onProgress?.(uploadProgress);
      });

      if (!result.success) {
        setError(result.error || 'Erro no upload');
        onError?.(result.error || 'Erro no upload');
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado no upload';
      setError(errorMsg);
      onError?.(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }, [bucket, clienteId, onProgress, onError]);

  const uploadMultiple = useCallback(async (files: File[]): Promise<{ results: UploadResult[]; successCount: number; errorCount: number }> => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(null);

      // Validar todos os arquivos primeiro
      const validationResults = files.map(file => ({
        file,
        validation: validateImageFile(file)
      }));

      const invalidFiles = validationResults.filter(r => !r.validation.valid);
      if (invalidFiles.length > 0) {
        const errorMsg = `Arquivos inválidos: ${invalidFiles.map(r => r.file.name).join(', ')}`;
        setError(errorMsg);
        onError?.(errorMsg);
        return {
          results: invalidFiles.map(r => ({ success: false, error: r.validation.error })),
          successCount: 0,
          errorCount: invalidFiles.length
        };
      }

      // Upload múltiplo
      const result = await uploadMultipleImages(files, bucket, clienteId, (uploadProgress) => {
        setProgress(uploadProgress);
        onProgress?.(uploadProgress);
      });

      onComplete?.(result.results);

      if (result.errorCount > 0) {
        const errorMsg = `${result.errorCount} arquivo(s) falharam no upload`;
        setError(errorMsg);
        onError?.(errorMsg);
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado no upload múltiplo';
      setError(errorMsg);
      onError?.(errorMsg);
      return {
        results: files.map(() => ({ success: false, error: errorMsg })),
        successCount: 0,
        errorCount: files.length
      };
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }, [bucket, clienteId, onProgress, onComplete, onError]);

  return {
    uploadSingle,
    uploadMultiple,
    isUploading,
    progress,
    error,
    clearError
  };
}

/**
 * Hook simplificado para upload de uma única imagem
 */
export function useSingleImageUpload(
  bucket: 'tricoscopia' | 'fotos-cliente',
  clienteId: string
) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File, customPath?: string): Promise<UploadResult> => {
    try {
      setIsUploading(true);
      setError(null);
      setProgress(null);

      const validation = validateImageFile(file);
      if (!validation.valid) {
        const errorMsg = validation.error || 'Arquivo inválido';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const path = customPath || generateFilePath(bucket, clienteId, file.name);
      
      const result = await uploadImageToStorage(file, bucket, path, (uploadProgress) => {
        setProgress(uploadProgress);
      });

      if (!result.success) {
        setError(result.error || 'Erro no upload');
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro inesperado no upload';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }, [bucket, clienteId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    upload,
    isUploading,
    progress,
    error,
    clearError
  };
}
