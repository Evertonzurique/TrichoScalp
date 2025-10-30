import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { X, Download, FileText, Brain, Image as ImageIcon, Sun, Moon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { generateAnamnesePDF } from "@/lib/pdf-generator";
import { useAnaliseIACompleta } from "@/hooks/useAnaliseIA";
import { normalizeUrlScheme } from "@/lib/storage";
import { usePDFGenerator, useTrichologyReportData, usePDFValidation } from "@/hooks/usePDFGenerator";
import ResultadosIA from "./ResultadosIA";
import ComparativoAvaliacoes from "./ComparativoAvaliacoes";
import StatusAnaliseIA from "./StatusAnaliseIA";
import { compararAvaliacoes } from "@/lib/comparativo-avaliacoes";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface AvaliacaoDetalhesProps {
  avaliacao: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AvaliacaoDetalhes = ({
  avaliacao,
  open,
  onOpenChange,
}: AvaliacaoDetalhesProps) => {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    label: string;
  } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [observacoes, setObservacoes] = useState({
    observacoes: '',
    plano_tratamento: '',
    proxima_consulta: ''
  });

  // Remover seletivamente divs com classes "teste" e "true" dentro dos detalhes
  useEffect(() => {
    const root = document.getElementById('avaliacao-detalhes-root');
    if (!root) return;

    const sweep = () => {
      root.querySelectorAll('div.teste, div.true').forEach((el) => {
        el.parentElement?.removeChild(el);
      });
    };

    // Varredura inicial
    sweep();

    // Observar futuras inserções para remoção automática
    const ObserverCtor = (window as any).MutationObserver || (window as any).WebKitMutationObserver;
    if (ObserverCtor) {
      const observer = new ObserverCtor((mutations: MutationRecord[]) => {
        for (const m of mutations) {
          if (m.addedNodes && m.addedNodes.length > 0) {
            m.addedNodes.forEach((node) => {
              if (node instanceof Element) {
                if (node.matches('div.teste, div.true')) {
                  node.parentElement?.removeChild(node);
                } else {
                  node.querySelectorAll?.('div.teste, div.true').forEach((child) => {
                    child.parentElement?.removeChild(child);
                  });
                }
              }
            });
          }
        }
      });
      observer.observe(root, { childList: true, subtree: true });
      return () => observer.disconnect();
    } else {
      // Fallback simples para navegadores sem MutationObserver
      const interval = window.setInterval(sweep, 2000);
      return () => window.clearInterval(interval);
    }
  }, [open, avaliacao]);

  // Hooks do novo módulo PDF
  const { generatePDF, isGenerating, isUploading, progress, error: pdfError } = usePDFGenerator();
  const { prepareReportData } = useTrichologyReportData();
  const { validateReportData } = usePDFValidation();

  // Hook para análise IA completa
  const {
    analise,
    status,
    historico,
    isProcessing,
    processarAnalise,
    error,
    clearError
  } = useAnaliseIACompleta(avaliacao?.id, avaliacao?.cliente_id);

  // Extrair URLs das imagens para análise IA
  const getImageUrls = () => {
    const urls: string[] = [];
    const pushIfValid = (val: unknown) => {
      if (typeof val === 'string' && val.trim().length > 0) {
        const normalized = normalizeUrlScheme(val);
        // aceitar apenas URLs com esquema válido
        if (normalized.startsWith('https://')) {
          urls.push(normalized);
        }
      }
    };

    if (avaliacao?.tricoscopia?.avaliacaoPadrao) {
      Object.values(avaliacao.tricoscopia.avaliacaoPadrao).forEach(pushIfValid);
    }
    if (avaliacao?.tricoscopia?.avaliacaoEspecifica) {
      Object.values(avaliacao.tricoscopia.avaliacaoEspecifica).forEach(pushIfValid);
    }
    return urls;
  };

  // Gerar comparativo se houver análise IA
  const getComparativo = () => {
    if (!analise || !historico || historico.length < 2) return null;
    
    const avaliacaoAnterior = historico.find(h => h.id !== avaliacao.id);
    if (!avaliacaoAnterior?.analise_ia) return null;
    
    return compararAvaliacoes(
      analise.analise_quantitativa,
      avaliacaoAnterior.analise_ia.analise_quantitativa
    );
  };

  const handleDownloadPdf = async () => {
    if (!avaliacao) return;
    
    try {
      // Preparar dados do cliente
      const cliente = {
        nome: avaliacao.cliente?.nome || 'Cliente',
        idade: avaliacao.cliente?.data_nascimento 
          ? new Date().getFullYear() - new Date(avaliacao.cliente.data_nascimento).getFullYear()
          : 0,
        genero: avaliacao.cliente?.genero || '',
        telefone: avaliacao.cliente?.telefone,
        email: avaliacao.cliente?.email,
        data_nascimento: avaliacao.cliente?.data_nascimento
      };

      // Dados do profissional (TODO: obter do contexto de auth)
      const profissional = {
        nome: 'Dr. Profissional', // TODO: Obter do contexto de auth
        crm: 'CRM/SP 123456',
        especialidade: 'Tricologia',
        contato: 'contato@tricoscalp.com'
      };

      // Preparar dados da anamnese
      const anamneseData = {
        queixa_principal: avaliacao.queixa_principal,
        dados_clinicos: avaliacao.dados_clinicos,
        tratamentos_anteriores: avaliacao.tratamentos_anteriores,
        historico_saude: avaliacao.historico_saude,
        habitos: avaliacao.habitos,
        historico_familiar: avaliacao.historico_familiar,
        exame_fisico: avaliacao.exame_fisico,
        informacoes: avaliacao.informacoes
      };

      // Preparar imagens de tricoscopia
      const imageUrls = getImageUrls();
      const imagens: Record<string, string> = {};
      
      // Mapear imagens para o formato esperado
      imageUrls.forEach((url, index) => {
        const positions = ['frontal_esquerda', 'frontal_centro', 'frontal_direita',
                          'meio_esquerda', 'meio_centro', 'meio_direita',
                          'posterior_esquerda', 'posterior_centro', 'posterior_direita'];
        if (positions[index]) {
          imagens[positions[index]] = url;
        }
      });

      // Preparar dados da análise IA
      const analiseIAData = analise ? {
        analise_quantitativa: analise.analise_quantitativa || {},
        analise_qualitativa: analise.analise_qualitativa || '',
        interpretacao_final: analise.interpretacao_final || '',
        comparativo: getComparativo()
      } : {
        analise_quantitativa: {},
        analise_qualitativa: 'Análise IA não disponível',
        interpretacao_final: 'Análise IA não foi processada para esta avaliação',
        comparativo: null
      };

      // Preparar dados completos do relatório
      const reportData = prepareReportData(
        cliente,
        anamneseData,
        imagens,
        analiseIAData,
        profissional,
        observacoes.observacoes,
        observacoes.plano_tratamento ? [observacoes.plano_tratamento] : undefined
      );

      // Validar dados antes de gerar
      const validation = validateReportData(reportData);
      if (!validation.isValid) {
        console.error('Dados inválidos para geração do PDF:', validation.errors);
        // Ainda assim, tentar gerar o PDF com os dados disponíveis
      }

      if (validation.warnings.length > 0) {
        console.warn('Avisos na validação do PDF:', validation.warnings);
      }

      // Gerar PDF com download automático e upload para storage
      await generatePDF(reportData, {
        autoDownload: true,
        uploadToStorage: true,
        theme: 'light',
        includeQRCode: true,
        customFileName: `Relatorio_Tricologia_${cliente.nome}_${format(
          new Date(avaliacao.created_at),
          "dd-MM-yyyy"
        )}.pdf`
      });

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      // Fallback para o método antigo em caso de erro
      setIsGeneratingPdf(true);
      try {
        const element = document.getElementById("avaliacao-content");
        if (!element) return;

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;

        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );

        const fileName = `Avaliacao_Fallback_${avaliacao.cliente?.nome || 'Cliente'}_${format(
          new Date(avaliacao.created_at),
          "dd-MM-yyyy"
        )}.pdf`;
        pdf.save(fileName);
      } finally {
        setIsGeneratingPdf(false);
      }
    }
  };

  const handleAcionarAnalise = async () => {
    const imageUrls = getImageUrls();
    if (imageUrls.length === 0) {
      alert('Nenhuma imagem disponível para análise');
      return;
    }
    
    await processarAnalise(imageUrls);
  };

  if (!avaliacao) return null;

  const capitalize = (text: string) => text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const valueLabelMap: Record<string, Record<string, string>> = {
    // Mapeamentos comuns usados nos formulários
    fuma: { sim: 'Sim', nao: 'Não', 'ex-fumante': 'Ex-fumante' },
    alcool: { nunca: 'Nunca', ocasionalmente: 'Ocasionalmente', regularmente: 'Regularmente' },
    atividadeFisica: { nao: 'Não', leve: 'Leve (1-2x/sem)', moderada: 'Moderada (3-4x/sem)', intensa: 'Intensa (5x+/sem)' },
    estresse: { baixo: 'Baixo', moderado: 'Moderado', alto: 'Alto' },
    calvicieFamilia: { sim: 'Sim', nao: 'Não', 'nao-sei': 'Não sei' },
    autoimuneFamilia: { sim: 'Sim', nao: 'Não', 'nao-sei': 'Não sei' },
    tireoideFamilia: { sim: 'Sim', nao: 'Não', 'nao-sei': 'Não sei' },
  };

  const mapLabeledValue = (key: string, value: any): string => {
    if (typeof value === 'string' && valueLabelMap[key] && valueLabelMap[key][value]) {
      return valueLabelMap[key][value];
    }
    return String(value);
  };

  const extractTextFromObject = (obj: any, parentKey?: string): string => {
    if (typeof obj === 'string') return parentKey ? mapLabeledValue(parentKey, obj) : obj;
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
    if (Array.isArray(obj)) {
      // Usar lista com marcadores para melhor leitura
      return obj
        .map((item) => `• ${extractTextFromObject(item, parentKey)}`)
        .join('\n');
    }
    if (typeof obj === 'object' && obj !== null) {
      // Filtrar pares "teste: true" em objetos aninhados
      return Object.entries(obj)
        .filter(([key, value]) => {
          const isTeste = key?.toLowerCase() === 'teste';
          const isTrue = value === true || (typeof value === 'string' && value.trim().toLowerCase() === 'true');
          return !(isTeste && isTrue);
        })
        .map(([key, value]) => `• ${capitalize(key)}: ${extractTextFromObject(value, key)}`)
        .join('\n');
    }
    return '';
  };

  const renderSection = (title: string, data: any) => {
    if (!data) return null;

    // Caso o backend tenha salvo como string (inclui JSON serializado)
    let normalized: any = data;
    if (typeof data === 'string') {
      const trimmed = data.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          normalized = JSON.parse(trimmed);
        } catch {
          normalized = data; // manter como texto simples
        }
      }
    }

    // Texto simples: renderizar bloco único
    if (typeof normalized === 'string') {
      if (normalized.length === 0) return null;
      return (
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          </div>
          <div className="h-0.5 w-12 bg-accent/60 rounded mt-1 mb-3" />
          <div className="card-brand">
            <div className="text-sm text-muted-foreground whitespace-pre-line break-words leading-relaxed">{normalized}</div>
          </div>
        </div>
      );
    }

    // Objeto/Array: renderizar pares chave/valor
    if (typeof normalized === 'object' && Object.keys(normalized).length > 0) {
      return (
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          </div>
          <div className="h-0.5 w-12 bg-accent/60 rounded mt-1 mb-3" />
          <div className="card-brand">
            <div className="space-y-3">
              {Object.entries(normalized).map(([key, value]: [string, any]) => {
                if (value === undefined || value === null || value === '') return null;
                const label = capitalize(key);
                const content = typeof value === 'object' ? extractTextFromObject(value, key) : mapLabeledValue(key, value);
                // Remover bloco específico: label "Teste" com conteúdo "true"
                const isTesteLabel = key.toLowerCase() === 'teste' || label === 'Teste';
                const isTrueContent = String(content).trim().toLowerCase() === 'true' || value === true;
                if (isTesteLabel && isTrueContent) return null;
                return (
                  <div key={key} className="text-sm">
                    <div className="font-medium text-foreground mb-1">{label}</div>
                    <div className="text-muted-foreground whitespace-pre-line break-words leading-relaxed">{content}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderTricoscopiaSection = () => {
    if (!avaliacao.tricoscopia) return null;

    const { avaliacaoPadrao, avaliacaoEspecifica, ...otherFields } =
      avaliacao.tricoscopia;

    const avaliacaoPadraoLabels: Record<string, string> = {
      frontalEsquerda: "Frontal Esquerda",
      meioFrontal: "Meio Frontal",
      frontalDireita: "Frontal Direita",
      meioEsquerda: "Meio Esquerda",
      meio: "Meio",
      meioDireita: "Meio Direita",
      posteriorEsquerda: "Posterior Esquerda",
      posteriorMeio: "Posterior Meio",
      posteriorDireita: "Posterior Direita",
    };

    const avaliacaoEspecificaLabels: Record<string, string> = {
      frontalEsquerda: "Frontal Esquerda",
      frontalMeio: "Frontal Meio",
      frontalDireita: "Frontal Direita",
      meioTopo: "Meio Topo",
      posteriorSuperior: "Posterior Superior",
    };

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Tricoscopia - Fotodocumentação</h3>
        </div>
        <div className="h-0.5 w-12 bg-accent/40 rounded mt-1 mb-3" />

        {avaliacaoPadrao && Object.keys(avaliacaoPadrao).length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-base mb-2">Avaliação Padrão 3x3</h4>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(avaliacaoPadrao).map(([key, value]) => {
                if (!value || typeof value !== "string") return null;
                return (
                  <button
                    key={key}
                    onClick={() =>
                      setSelectedImage({
                        src: value as string,
                        label: avaliacaoPadraoLabels[key] || key,
                      })
                    }
                    className="group relative overflow-hidden rounded-lg border hover:border-accent transition-colors"
                  >
                    <img
                      src={value as string}
                      alt={avaliacaoPadraoLabels[key] || key}
                      className="w-full h-32 object-cover"
                    />
                    {/* Overlay somente sobre a imagem para evitar cobrir a legenda */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium text-center px-2">
                        {avaliacaoPadraoLabels[key] || key}
                      </span>
                    </div>
                    {/* Legenda visível sob a imagem, capturável pelo html2canvas */}
                    <div className="px-2 py-1 text-center text-xs font-medium text-muted-foreground bg-muted/30 border-t">
                      {avaliacaoPadraoLabels[key] || key}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {avaliacaoEspecifica && Object.keys(avaliacaoEspecifica).length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-base mb-2">Avaliação Específica</h4>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(avaliacaoEspecifica).map(([key, value]) => {
                if (!value || typeof value !== "string") return null;
                return (
                  <button
                    key={key}
                    onClick={() =>
                      setSelectedImage({
                        src: value as string,
                        label: avaliacaoEspecificaLabels[key] || key,
                      })
                    }
                    className="group relative overflow-hidden rounded-lg border hover:border-accent transition-colors"
                  >
                    <img
                      src={value as string}
                      alt={avaliacaoEspecificaLabels[key] || key}
                      className="w-full h-32 object-cover"
                    />
                    {/* Overlay somente sobre a imagem para evitar cobrir a legenda */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium text-center px-2">
                        {avaliacaoEspecificaLabels[key] || key}
                      </span>
                    </div>
                    {/* Legenda visível sob a imagem, capturável pelo html2canvas */}
                    <div className="px-2 py-1 text-center text-xs font-medium text-muted-foreground bg-muted/30 border-t">
                      {avaliacaoEspecificaLabels[key] || key}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {Object.keys(otherFields).length > 0 && (
          <div className="space-y-2">
            {Object.entries(otherFields).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                </span>
                <span className="text-muted-foreground">{String(value || "-")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent id="avaliacao-detalhes-root" className="avaliacao-detalhes dialog-avaliacao max-w-6xl max-h-[90vh] backdrop-blur-sm border shadow-card">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2 text-accent">
                  <FileText className="h-5 w-5 text-accent" />
                  Detalhes da Avaliação
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Cliente: {avaliacao.cliente?.nome} •{" "}
                  {format(new Date(avaliacao.created_at), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div className="header-actions shift-left-1cm flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPdf}
                  disabled={isGenerating || isUploading || isGeneratingPdf}
                  className="btn-pdf transition-smooth text-[14px] font-medium"
                  aria-label="Baixar PDF"
                  title="Baixar PDF"
                  data-testid="btn-pdf"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isGenerating || isGeneratingPdf ? 
                    `Gerando PDF... ${progress > 0 ? `${progress}%` : ''}` :
                    isUploading ? 
                    `Enviando... ${progress}%` :
                    "Baixar PDF"
                  }
                </Button>
                <ThemeToggle />
                {pdfError && (
                  <div className="text-xs text-destructive mt-1">
                    Erro: {pdfError}
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="anamnese" className="w-full">
            <TabsList className="tabs-avaliacao grid w-full grid-cols-3 bg-white/10 border-white/20 rounded-lg">
              <TabsTrigger value="anamnese" className="tab-trigger">Anamnese</TabsTrigger>
              <TabsTrigger value="ia" className="tab-trigger flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Assessoria IA
              </TabsTrigger>
              <TabsTrigger value="imagens" className="tab-trigger">Imagens</TabsTrigger>
            </TabsList>

            <TabsContent value="anamnese" className="mt-4">
              <ScrollArea className="h-[60vh] pr-4">
                <div id="avaliacao-content" className="space-y-4">
                  {renderSection("Queixa Principal", avaliacao.queixa_principal)}
                  <Separator />
                  {renderSection("Dados Clínicos", avaliacao.dados_clinicos)}
                  <Separator />
                  {renderSection(
                    "Tratamentos Anteriores",
                    avaliacao.tratamentos_anteriores
                  )}
                  <Separator />
                  {renderSection("Histórico de Saúde", avaliacao.historico_saude)}
                  <Separator />
                  {renderSection("Hábitos", avaliacao.habitos)}
                  <Separator />
                  {renderSection("Histórico Familiar", avaliacao.historico_familiar)}
                  <Separator />
                  {renderSection("Exame Físico", avaliacao.exame_fisico)}
                  <Separator />
                  {renderSection("Informações", avaliacao.informacoes)}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="ia" className="mt-4">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                  {/* Status da Análise IA */}
                  <StatusAnaliseIA
                    status={status}
                    isProcessing={isProcessing}
                    onAcionarAnalise={handleAcionarAnalise}
                    error={error}
                    onRefetch={() => {}} // Implementar se necessário
                  />

                  {/* Resultados da Análise IA */}
                  {analise && (
                    <ResultadosIA analise={analise} />
                  )}

                  {/* Comparativo Histórico */}
                  {analise && (
                    <ComparativoAvaliacoes
                      comparativo={getComparativo()}
                      historico={historico}
                    />
                  )}

                  {/* Observações do Profissional */}
                  <div className="space-y-4 card-brand">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent" />
                      <h3 className="font-semibold text-foreground">Observações do Profissional</h3>
                    </div>
                    <div className="h-0.5 w-12 bg-accent/60 rounded" />
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Observações Clínicas</label>
                        <textarea
                          className="w-full mt-1 p-2 border rounded-md focus-visible:ring-accent/50 text-foreground placeholder:text-muted-foreground"
                          rows={3}
                          value={observacoes.observacoes}
                          onChange={(e) => setObservacoes(prev => ({ ...prev, observacoes: e.target.value }))}
                          placeholder="Digite suas observações clínicas..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Plano de Tratamento</label>
                        <textarea
                          className="w-full mt-1 p-2 border rounded-md focus-visible:ring-accent/50 text-foreground placeholder:text-muted-foreground"
                          rows={3}
                          value={observacoes.plano_tratamento}
                          onChange={(e) => setObservacoes(prev => ({ ...prev, plano_tratamento: e.target.value }))}
                          placeholder="Descreva o plano de tratamento..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Próxima Consulta</label>
                        <input
                          type="text"
                          className="w-full mt-1 p-2 border rounded-md focus-visible:ring-accent/50 text-foreground placeholder:text-muted-foreground"
                          value={observacoes.proxima_consulta}
                          onChange={(e) => setObservacoes(prev => ({ ...prev, proxima_consulta: e.target.value }))}
                          placeholder="Data ou orientações para próxima consulta..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="imagens" className="mt-4">
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                  {renderTricoscopiaSection()}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
              title="Fechar visualização"
              aria-label="Fechar visualização da imagem"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.label}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-4 rounded-b-lg">
                <p className="text-center font-medium">{selectedImage.label}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

// Toggle de Tema com persistência e transição suave
const ThemeToggle = () => {
  const [mode, setMode] = useState<'dark' | 'light'>(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    return stored === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', mode);
  }, [mode]);

  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(val) => val && setMode(val as 'dark' | 'light')}
      className="transition-smooth"
    >
      <ToggleGroupItem
        value="light"
        aria-label="Modo claro"
        title="Modo claro"
        className="bg-white/10 border-white/20 text-foreground hover:bg-white/20 transition-smooth h-8 w-8 p-0"
      >
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Modo escuro"
        title="Modo escuro"
        className="bg-white/10 border-white/20 text-foreground hover:bg-white/20 transition-smooth h-8 w-8 p-0"
      >
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default AvaliacaoDetalhes;
