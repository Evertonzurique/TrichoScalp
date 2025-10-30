import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Save, User, Brain, CheckCircle, RefreshCcw, Eraser } from "lucide-react";
import AnamneseNav from "@/components/anamnese/AnamneseNav";
import { debugAnamneseSave, logAnamneseDebug, validateAnamneseData } from "@/lib/debug-anamnese";
import QueixaPrincipal from "@/components/anamnese/QueixaPrincipal";
import DadosClinicos from "@/components/anamnese/DadosClinicos";
import TratamentosAnteriores from "@/components/anamnese/TratamentosAnteriores";
import HistoricoSaude from "@/components/anamnese/HistoricoSaude";
import Habitos from "@/components/anamnese/Habitos";
import HistoricoFamiliar from "@/components/anamnese/HistoricoFamiliar";
import ExameFisico from "@/components/anamnese/ExameFisico";
import Tricoscopia from "@/components/anamnese/Tricoscopia";
import Informacoes from "@/components/anamnese/Informacoes";
import ConsentimentoIA from "@/components/clientes/ConsentimentoIA";
import { useAnaliseIACompleta } from "@/hooks/useAnaliseIA";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const sections = [
  { id: "queixa-principal", label: "Queixa Principal" },
  { id: "dados-clinicos", label: "Dados Clínicos" },
  { id: "tratamentos-anteriores", label: "Tratamentos Anteriores" },
  { id: "historico-saude", label: "Histórico de Saúde" },
  { id: "habitos", label: "Hábitos" },
  { id: "historico-familiar", label: "Histórico Familiar" },
  { id: "exame-fisico", label: "Exame Físico" },
  { id: "tricoscopia", label: "Tricoscopia" },
  { id: "informacoes", label: "Informações" },
];

const Anamnese = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConsentimento, setShowConsentimento] = useState(false);
  const [avaliacaoId, setAvaliacaoId] = useState<string | null>(null);
  const [previousEvaluation, setPreviousEvaluation] = useState<any | null>(null);
  const [previousFormData, setPreviousFormData] = useState<Record<string, any> | null>(null);
  const [prefilled, setPrefilled] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const navigate = useNavigate();
  const { clienteId } = useParams();

  // Hook para análise IA (após salvar avaliação)
  const {
    analise,
    status,
    isProcessing,
    processarAnalise,
    error
  } = useAnaliseIACompleta(avaliacaoId || '', clienteId || '');

  const progress = ((currentSection + 1) / sections.length) * 100;

  useEffect(() => {
    if (!clienteId) {
      navigate("/anamnese/selecionar-cliente");
      return;
    }
    fetchCliente();
    fetchPreviousEvaluation();
  }, [clienteId]);

  const fetchCliente = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", clienteId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setCliente(data);
    } catch (error) {
      console.error("Error fetching cliente:", error);
      toast.error("Não foi possível carregar os dados do cliente.");
      navigate("/anamnese/selecionar-cliente");
    } finally {
      setLoading(false);
    }
  };

  // Normaliza estrutura da tricoscopia garantindo a chave observacoesTrico
  const normalizeTricoscopia = (t: any) => {
    if (!t || typeof t !== 'object') return {};
    const normalized = { ...t };
    const obs =
      t?.observacoesTrico ??
      t?.observacoes_trico ??
      t?.observacoesTricoscopia ??
      t?.observacoes;
    if (obs !== undefined) normalized.observacoesTrico = obs;
    return normalized;
  };

  // Validação de campos obrigatórios para relatório médico
  const verifyMandatoryFields = (mapped: Record<string, any>) => {
    const missing: string[] = [];
    if (!mapped["queixa-principal"]?.queixa?.trim()) missing.push("Queixa Principal");
    if (!mapped["dados-clinicos"] || Object.keys(mapped["dados-clinicos"]).length === 0) missing.push("Dados Clínicos");
    if (!mapped["habitos"] || Object.keys(mapped["habitos"]).length === 0) missing.push("Hábitos do Paciente");
    if (!mapped["historico-familiar"] || Object.keys(mapped["historico-familiar"]).length === 0) missing.push("Histórico Familiar");
    const trico = mapped["tricoscopia"] || {};
    if (!trico.achadosPadrao || String(trico.achadosPadrao).trim().length === 0) missing.push("Achados - Avaliação Padrão");
    return missing;
  };

  const fetchPreviousEvaluation = async () => {
    try {
      if (!clienteId) return;
      const { data, error } = await supabase
        .from("avaliacoes")
        .select("*")
        .eq("cliente_id", clienteId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        const prev = data[0];
        setPreviousEvaluation(prev);

        const safeParse = (value: any) => {
          if (typeof value === 'string') {
            try {
              return JSON.parse(value);
            } catch {
              return value;
            }
          }
          return value ?? {};
        };

        const mapped: Record<string, any> = {
          "queixa-principal": safeParse(prev.queixa_principal),
          "dados-clinicos": safeParse(prev.dados_clinicos),
          "tratamentos-anteriores": safeParse(prev.tratamentos_anteriores),
          "historico-saude": safeParse(prev.historico_saude),
          "habitos": safeParse(prev.habitos),
          "historico-familiar": safeParse(prev.historico_familiar),
          "exame-fisico": safeParse(prev.exame_fisico),
          "tricoscopia": normalizeTricoscopia(safeParse(prev.tricoscopia)) ?? {},
          "informacoes": safeParse(prev.informacoes),
        };
        const missing = verifyMandatoryFields(mapped);
        if (missing.length > 0) {
          toast.message(`Campos obrigatórios ausentes na última avaliação: ${missing.join(", ")}`);
        }
        setPreviousFormData(mapped);
        // Aplicar prefill inicial apenas se o form estiver vazio (primeiro load)
        setFormData((prevState) => {
          if (Object.keys(prevState || {}).length === 0) {
            setPrefilled(true);
            return { ...mapped };
          }
          return prevState;
        });
        return mapped;
      }
    } catch (error) {
      console.error("Error fetching previous evaluation:", error);
      toast.error("Não foi possível carregar avaliação anterior.");
      throw error;
    }
  };

  const [reloadingPrevious, setReloadingPrevious] = useState(false);

  const handleReloadPrevious = async () => {
    try {
      setReloadingPrevious(true);
      // Força refetch para garantir dados mais recentes
      const latest = await fetchPreviousEvaluation();
      if (latest) {
        setFormData({ ...latest });
        setPrefilled(true);
        const missing = verifyMandatoryFields(latest);
        if (missing.length > 0) {
          toast.message(`Alguns campos obrigatórios ainda faltam: ${missing.join(", ")}`);
        }
        toast.success("Respostas atualizadas da última avaliação foram aplicadas ao formulário.");
      } else if (previousFormData) {
        // Fallback para estado local, caso refetch não retorne nada
        setFormData({ ...previousFormData });
        setPrefilled(true);
        toast.success("Respostas locais da última avaliação foram reaplicadas.");
      } else {
        toast.message("Nenhuma avaliação anterior encontrada para recarregar.");
      }
    } catch (err: any) {
      console.error("Erro ao recarregar respostas:", err);
      toast.error("Erro ao recarregar respostas. Verifique a conexão e tente novamente.");
    } finally {
      setReloadingPrevious(false);
    }
  };

  const handleClearPrefill = () => {
    // Mantém apenas a seção de tricoscopia (para permitir upload das imagens)
    setFormData((prev) => ({ tricoscopia: prev?.tricoscopia || {} }));
    setPrefilled(false);
    toast.success("As respostas pré-carregadas foram removidas. Você pode preencher manualmente.");
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionClick = (index: number) => {
    setCurrentSection(index);
  };

  const handleSaveIntermediate = async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      // Verificar autenticação
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        navigate("/auth");
        return;
      }

      // Verificar se clienteId existe
      if (!clienteId) {
        toast.error("Cliente não identificado");
        navigate("/dashboard");
        return;
      }

      // Debug básico para salvamento intermediário
      console.log("💾 Salvamento intermediário iniciado", {
        clienteId,
        userId: user.id,
        formDataKeys: Object.keys(formData),
        currentSection
      });

      const avaliacaoData = {
          cliente_id: clienteId,
          user_id: user.id,
        queixa_principal: formData["queixa-principal"] || null,
        dados_clinicos: formData["dados-clinicos"] || null,
        tratamentos_anteriores: formData["tratamentos-anteriores"] || null,
        historico_saude: formData["historico-saude"] || null,
        habitos: formData["habitos"] || null,
        historico_familiar: formData["historico-familiar"] || null,
        exame_fisico: formData["exame-fisico"] || null,
        tricoscopia: formData["tricoscopia"] || null,
        informacoes: formData["informacoes"] || null,
        status: 'rascunho'
      };

      const { data, error } = await supabase
        .from("avaliacoes")
        .insert([avaliacaoData])
        .select()
        .single();

      if (error) throw error;

      toast.success("Seu progresso foi salvo como rascunho.");

    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Não foi possível salvar o progresso.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    
    setSaving(true);
    try {
      // Verificar autenticação
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("Auth error:", authError);
        throw new Error("Erro de autenticação");
      }
      if (!user) {
        toast.error("Você precisa estar logado para salvar a avaliação.");
        navigate("/auth");
        return;
      }

      // Debug e validação
      const debugInfo = debugAnamneseSave(clienteId, user.id, formData, previousEvaluation);
      logAnamneseDebug(debugInfo);

      const validation = validateAnamneseData(clienteId, user.id, formData, { allowMissingQueixa: !!previousEvaluation });
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        if (!clienteId) navigate("/anamnese/selecionar-cliente");
        if (!formData["queixa-principal"]?.queixa?.trim()) setCurrentSection(0);
        setSaving(false);
        return;
      }

      // Verificar se há imagens na tricoscopia (URLs válidas)
      const trico = formData["tricoscopia"] || {};
      const padraoCount = trico.avaliacaoPadrao
        ? Object.values(trico.avaliacaoPadrao).filter((v: any) => typeof v === 'string' && v.length > 0).length
        : 0;
      const especificaCount = trico.avaliacaoEspecifica
        ? Object.values(trico.avaliacaoEspecifica).filter((v: any) => typeof v === 'string' && v.length > 0).length
        : 0;
      const hasImages = (padraoCount + especificaCount) > 0;

      const isFollowUp = !!previousEvaluation;

      // Validação condicional: em follow-up, ao menos uma imagem é obrigatória
      if (isFollowUp && !hasImages) {
        console.warn('Follow-up sem imagens detectadas', { padraoCount, especificaCount, trico });
        toast.error(`Para uma nova avaliação, envie ao menos uma imagem (detectadas: padrão ${padraoCount}, específica ${especificaCount}).`);
        setCurrentSection(7); // Ir para seção de tricoscopia
        setSaving(false);
        return;
      }

      // Se há imagens, verificar consentimento IA
      if (hasImages && cliente && (cliente.consentimento_ia !== true)) {
        console.log("Abrindo diálogo de consentimento IA", { 
          hasImages, 
          consentimento_ia: cliente.consentimento_ia,
          showConsentimento: showConsentimento 
        });
        setShowConsentimento(true);
        setSaving(false);
        return;
      }

      console.log("Passou pela validação de consentimento, preparando dados...");

      // Preparar dados para salvamento
      const avaliacaoData = {
        cliente_id: clienteId,
        user_id: user.id,
        queixa_principal: formData["queixa-principal"] || null,
        dados_clinicos: formData["dados-clinicos"] || null,
        tratamentos_anteriores: formData["tratamentos-anteriores"] || null,
        historico_saude: formData["historico-saude"] || null,
        habitos: formData["habitos"] || null,
        historico_familiar: formData["historico-familiar"] || null,
        exame_fisico: formData["exame-fisico"] || null,
        tricoscopia: formData["tricoscopia"] || null,
        informacoes: formData["informacoes"] || null,
        status: 'concluida'
      };

      console.log("Salvando avaliação:", avaliacaoData);
      console.log("Iniciando insert no Supabase...");

      const { data, error } = await supabase
        .from("avaliacoes")
        .insert([avaliacaoData])
        .select()
        .single();

      console.log("Resultado do insert:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Erro do banco de dados: ${error.message}`);
      }

      if (!data) {
        throw new Error("Nenhum dado retornado após inserção");
      }

      setAvaliacaoId(data.id);

      toast.success(`A avaliação foi salva com sucesso. ID: ${data.id}`);

      // Se há imagens, acionar análise IA
      if (hasImages) {
        try {
          const imageUrls = extractImageUrls(formData["tricoscopia"]);
          if (imageUrls.length > 0) {
            await processarAnalise(imageUrls);
          }
        } catch (iaError) {
          console.error("Erro na análise IA:", iaError);
          // Não bloquear o salvamento por erro na IA
          toast.success("Avaliação salva, mas houve erro na análise IA. Tente novamente mais tarde.");
        }
      }

      // Aguardar um pouco antes de navegar para garantir que o toast seja exibido
      setTimeout(() => {
      navigate("/dashboard");
      }, 1500);

    } catch (error) {
      console.error("Error saving avaliacao:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Não foi possível salvar a avaliação: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const extractImageUrls = (tricoscopia: any): string[] => {
    const urls: string[] = [];
    
    if (tricoscopia?.avaliacaoPadrao) {
      Object.values(tricoscopia.avaliacaoPadrao).forEach(url => {
        if (typeof url === 'string') {
          urls.push(url);
        }
      });
    }
    
    if (tricoscopia?.avaliacaoEspecifica) {
      Object.values(tricoscopia.avaliacaoEspecifica).forEach(url => {
        if (typeof url === 'string') {
          urls.push(url);
        }
      });
    }
    
    return urls;
  };

  const handleConsentimento = async (consentido: boolean) => {
    if (consentido) {
      try {
        const { error } = await supabase
          .from("clientes")
          .update({
            consentimento_ia: true,
            consentimento_ia_data: new Date().toISOString()
          })
          .eq("id", clienteId);

        if (error) throw error;

        setCliente(prev => ({
          ...prev,
          consentimento_ia: true,
          consentimento_ia_data: new Date().toISOString()
        }));

        toast.success("Consentimento para análise IA foi registrado com sucesso.");

        // Salvar avaliação após consentimento
        await handleSave();
      } catch (error) {
        console.error("Erro ao salvar consentimento:", error);
        toast.error("Erro ao salvar consentimento: " + (error instanceof Error ? error.message : 'Erro desconhecido'));
      }
    }
    
    setShowConsentimento(false);
  };

  const updateFormData = (sectionId: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [sectionId]: data,
    }));
  };

  const renderSection = () => {
    const sectionId = sections[currentSection].id;
    const sectionData = formData[sectionId] || {};
    const updateData = (data: any) => updateFormData(sectionId, data);

    switch (sectionId) {
      case "queixa-principal":
        return <QueixaPrincipal data={sectionData} updateData={updateData} />;
      case "dados-clinicos":
        return <DadosClinicos data={sectionData} updateData={updateData} />;
      case "tratamentos-anteriores":
        return <TratamentosAnteriores data={sectionData} updateData={updateData} />;
      case "historico-saude":
        return <HistoricoSaude data={sectionData} updateData={updateData} />;
      case "habitos":
        return <Habitos data={sectionData} updateData={updateData} />;
      case "historico-familiar":
        return <HistoricoFamiliar data={sectionData} updateData={updateData} />;
      case "exame-fisico":
        return <ExameFisico data={sectionData} updateData={updateData} />;
      case "tricoscopia":
        return <Tricoscopia data={sectionData} updateData={updateData} clienteId={clienteId} />;
      case "informacoes":
        return <Informacoes data={sectionData} updateData={updateData} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-card">
      <header className="bg-card/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-heading font-bold">
                Nova Avaliação Capilar
              </h1>
              {cliente && (
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Cliente: {cliente.nome} • {cliente.telefone}
                  </p>
                </div>
              )}
            </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveIntermediate}
                disabled={saving}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Progresso
              </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Aviso de prefill em follow-up */}
        {previousEvaluation && (
          <div className="mb-6">
            <Alert>
              <AlertTitle>Respostas carregadas da última avaliação</AlertTitle>
              <AlertDescription>
                Você pode editar qualquer campo conforme necessário. Apenas as imagens são obrigatórias nas reavaliações.
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleReloadPrevious} disabled={reloadingPrevious}>
                    {reloadingPrevious ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    ) : (
                      <RefreshCcw className="h-4 w-4 mr-2" />
                    )}
                    {reloadingPrevious ? "Recarregando..." : "Recarregar respostas"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClearPrefill}>
                    <Eraser className="h-4 w-4 mr-2" /> Limpar respostas
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
        {/* Status da Análise IA */}
        {avaliacaoId && (
          <div className="mb-6 p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Assessoria de Anamnese com IA</h3>
            </div>
            <div className="flex items-center gap-4">
              {status === 'completed' && analise ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Análise IA concluída com sucesso</span>
                </div>
              ) : status === 'processing' || isProcessing ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Processando análise IA...</span>
                </div>
              ) : status === 'error' ? (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="text-sm">Erro na análise IA: {error}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">Aguardando processamento de imagens</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Progresso da Anamnese: {Math.round(progress)}%
            </span>
            <span className="text-sm text-muted-foreground">
              Seção {currentSection + 1} de {sections.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="lg:sticky lg:top-6 h-fit">
            <AnamneseNav
              sections={sections}
              currentSection={currentSection}
              onSectionClick={handleSectionClick}
            />
          </aside>

          <main>
            <div className="bg-card rounded-xl shadow-card p-6 min-h-[600px]">
              {renderSection()}

              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                {currentSection === sections.length - 1 ? (
                  <Button 
                    onClick={handleSave} 
                    className="gradient-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                    <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? "Salvando..." : "Salvar Anamnese"}
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="gradient-primary">
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Dialog de Consentimento IA */}
      <ConsentimentoIA
        open={showConsentimento}
        onOpenChange={setShowConsentimento}
        onConsent={handleConsentimento}
        clienteNome={cliente?.nome}
      />
    </div>
  );
};

export default Anamnese;
