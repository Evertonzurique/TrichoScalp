// Utilitário para debug e logging do salvamento de anamnese

export interface AnamneseDebugInfo {
  timestamp: string;
  clienteId: string | undefined;
  userId: string | undefined;
  formDataKeys: string[];
  formDataSizes: Record<string, number>;
  hasImages: boolean;
  isFollowUp: boolean;
  validationErrors: string[];
}

export const debugAnamneseSave = (
  clienteId: string | undefined,
  userId: string | undefined,
  formData: Record<string, any>,
  previousEvaluation: any
): AnamneseDebugInfo => {
  const debugInfo: AnamneseDebugInfo = {
    timestamp: new Date().toISOString(),
    clienteId,
    userId,
    formDataKeys: Object.keys(formData),
    formDataSizes: {},
    hasImages: false,
    isFollowUp: !!previousEvaluation,
    validationErrors: []
  };

  // Calcular tamanhos dos dados
  Object.entries(formData).forEach(([key, value]) => {
    debugInfo.formDataSizes[key] = JSON.stringify(value || {}).length;
  });

  // Verificar se há imagens
  const tricoscopia = formData["tricoscopia"];
  if (tricoscopia) {
    const hasAvaliacaoPadrao = tricoscopia.avaliacaoPadrao && 
      Object.values(tricoscopia.avaliacaoPadrao).some(v => v);
    const hasAvaliacaoEspecifica = tricoscopia.avaliacaoEspecifica && 
      Object.values(tricoscopia.avaliacaoEspecifica).some(v => v);
    debugInfo.hasImages = hasAvaliacaoPadrao || hasAvaliacaoEspecifica;
  }

  // Validações básicas
  if (!clienteId) {
    debugInfo.validationErrors.push("Cliente ID não fornecido");
  }

  if (!userId) {
    debugInfo.validationErrors.push("User ID não fornecido");
  }

  if (!formData["queixa-principal"]?.queixa?.trim()) {
    debugInfo.validationErrors.push("Queixa principal não preenchida");
  }

  if (debugInfo.isFollowUp && !debugInfo.hasImages) {
    debugInfo.validationErrors.push("Follow-up sem imagens");
  }

  return debugInfo;
};

export const logAnamneseDebug = (debugInfo: AnamneseDebugInfo) => {
  console.group("🔍 Debug Anamnese Save");
  console.log("Timestamp:", debugInfo.timestamp);
  console.log("Cliente ID:", debugInfo.clienteId);
  console.log("User ID:", debugInfo.userId);
  console.log("Form Data Keys:", debugInfo.formDataKeys);
  console.log("Form Data Sizes:", debugInfo.formDataSizes);
  console.log("Has Images:", debugInfo.hasImages);
  console.log("Is Follow-up:", debugInfo.isFollowUp);
  
  if (debugInfo.validationErrors.length > 0) {
    console.warn("Validation Errors:", debugInfo.validationErrors);
  } else {
    console.log("✅ All validations passed");
  }
  
  console.groupEnd();
};

export const validateAnamneseData = (
  clienteId: string | undefined,
  userId: string | undefined,
  formData: Record<string, any>,
  options?: { allowMissingQueixa?: boolean }
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!clienteId) {
    errors.push("Cliente não identificado");
  }

  if (!userId) {
    errors.push("Usuário não autenticado");
  }

  if (!options?.allowMissingQueixa) {
    if (!formData["queixa-principal"]?.queixa?.trim()) {
      errors.push("Queixa principal é obrigatória");
    }
  }

  // Verificar se os dados não são muito grandes (limite do Supabase)
  Object.entries(formData).forEach(([key, value]) => {
    const size = JSON.stringify(value || {}).length;
    if (size > 1000000) { // 1MB limit
      errors.push(`Seção ${key} muito grande (${Math.round(size / 1024)}KB)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};