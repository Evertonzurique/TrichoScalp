import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSingleImageUpload } from "@/hooks/useStorageUpload";
import { Progress } from "@/components/ui/progress";

interface TricoscopiaProps {
  data: any;
  updateData: (data: any) => void;
  clienteId?: string;
}

interface AvaliacaoPadraoImages {
  frontalEsquerda?: string;
  meioFrontal?: string;
  frontalDireita?: string;
  meioEsquerda?: string;
  meio?: string;
  meioDireita?: string;
  posteriorEsquerda?: string;
  posteriorMeio?: string;
  posteriorDireita?: string;
}

interface AvaliacaoEspecificaImages {
  frontalEsquerda?: string;
  frontalMeio?: string;
  frontalDireita?: string;
  meioTopo?: string;
  posteriorSuperior?: string;
}

const Tricoscopia = ({ data, updateData, clienteId }: TricoscopiaProps) => {
  const { toast } = useToast();
  
  // Hook para upload de imagens tricoscópicas
  const uploadTricoscopia = useSingleImageUpload('tricoscopia', clienteId || '');
  
  // Hook para upload de fotos panorâmicas
  const uploadPanoramicas = useSingleImageUpload('fotos-cliente', clienteId || '');

  const avaliacaoPadraoLabels = [
    { key: "frontalEsquerda", label: "Frontal Esquerda" },
    { key: "meioFrontal", label: "Meio Frontal" },
    { key: "frontalDireita", label: "Frontal Direita" },
    { key: "meioEsquerda", label: "Meio Esquerda" },
    { key: "meio", label: "Meio" },
    { key: "meioDireita", label: "Meio Direita" },
    { key: "posteriorEsquerda", label: "Posterior Esquerda" },
    { key: "posteriorMeio", label: "Posterior Meio" },
    { key: "posteriorDireita", label: "Posterior Direita" },
  ];

  const avaliacaoEspecificaLabels = [
    { key: "frontalEsquerda", label: "Frontal Esquerda" },
    { key: "frontalMeio", label: "Frontal Meio" },
    { key: "frontalDireita", label: "Frontal Direita" },
    { key: "meioTopo", label: "Meio Topo" },
    { key: "posteriorSuperior", label: "Posterior Superior" },
  ];

  const handleChange = (field: string, value: string) => {
    updateData({ ...data, [field]: value });
  };

  const handleImageUpload = async (
    section: "avaliacaoPadrao" | "avaliacaoEspecifica",
    imageKey: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!clienteId) {
      toast({
        title: "Erro",
        description: "ID do cliente não encontrado. Não é possível fazer upload das imagens.",
        variant: "destructive",
      });
      return;
    }

    // Determinar qual hook usar baseado na seção
    const uploadHook = section === "avaliacaoPadrao" ? uploadTricoscopia : uploadPanoramicas;

    try {
      const result = await uploadHook.upload(file);
      
      if (result.success && result.url) {
        const updatedSection = {
          ...(data[section] || {}),
          [imageKey]: result.url, // Armazenar URL em vez de Base64
        };
        updateData({ ...data, [section]: updatedSection });
        
        toast({
          title: "Sucesso",
          description: "Imagem enviada com sucesso!",
        });
      } else {
        throw new Error(result.error || 'Erro no upload');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Não foi possível enviar a imagem.",
        variant: "destructive",
      });
    }
  };

  const removeImage = (
    section: "avaliacaoPadrao" | "avaliacaoEspecifica",
    imageKey: string
  ) => {
    const updatedSection = { ...(data[section] || {}) };
    delete updatedSection[imageKey];
    updateData({ ...data, [section]: updatedSection });
  };

  const renderImageUpload = (
    section: "avaliacaoPadrao" | "avaliacaoEspecifica",
    imageKey: string,
    label: string
  ) => {
    const image = data[section]?.[imageKey];
    const uploadHook = section === "avaliacaoPadrao" ? uploadTricoscopia : uploadPanoramicas;
    const isUploading = uploadHook.isUploading;

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        {image ? (
          <div className="relative group">
            <img
              src={image}
              alt={label}
              className="w-full h-32 object-cover rounded-lg border"
            />
            <button
              onClick={() => removeImage(section, imageKey)}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-accent transition-smooth disabled:cursor-not-allowed disabled:opacity-50">
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Enviando...</span>
                </div>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground text-center px-2">
                    {label}
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(section, imageKey, e)}
                disabled={isUploading}
              />
            </label>
            
            {/* Barra de progresso */}
            {isUploading && uploadHook.progress && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Enviando...</span>
                  <span>{Math.round(uploadHook.progress.percentage)}%</span>
                </div>
                <Progress value={uploadHook.progress.percentage} className="h-1" />
              </div>
            )}
            
            {/* Mensagem de erro */}
            {uploadHook.error && (
              <div className="text-xs text-destructive">
                {uploadHook.error}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">
          Tricoscopia - Fotodocumentação Completa
        </h2>
        <p className="text-muted-foreground">
          Upload de imagens para avaliação padrão (9 imagens) e específica (5 imagens)
        </p>
      </div>

      <div className="space-y-8">
        {/* Avaliação Padrão 3x3 */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold">Avaliação Padrão 3x3</h3>
            <p className="text-sm text-muted-foreground">
              9 imagens organizadas em grade
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {avaliacaoPadraoLabels.map(({ key, label }) =>
              renderImageUpload("avaliacaoPadrao", key, label)
            )}
          </div>
        </div>

        {/* Avaliação Específica */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold">Avaliação Específica</h3>
            <p className="text-sm text-muted-foreground">
              5 imagens adicionais para análise detalhada
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {avaliacaoEspecificaLabels.map(({ key, label }) =>
              renderImageUpload("avaliacaoEspecifica", key, label)
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="achados-padrao">Achados - Avaliação Padrão</Label>
          <Textarea
            id="achados-padrao"
            value={data.achadosPadrao || ""}
            onChange={(e) => handleChange("achadosPadrao", e.target.value)}
            placeholder="Descreva os achados da avaliação padrão..."
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="achados-especifica">Achados - Avaliação Específica</Label>
          <Textarea
            id="achados-especifica"
            value={data.achadosEspecifica || ""}
            onChange={(e) => handleChange("achadosEspecifica", e.target.value)}
            placeholder="Descreva os achados da avaliação específica..."
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="densidade-foliculos">
            Densidade de folículos pilosos
          </Label>
          <Textarea
            id="densidade-foliculos"
            value={data.densidadeFoliculos || ""}
            onChange={(e) => handleChange("densidadeFoliculos", e.target.value)}
            placeholder="Descreva a densidade folicular observada..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="miniaturizacao">Presença de miniaturização</Label>
          <Textarea
            id="miniaturizacao"
            value={data.miniaturizacao || ""}
            onChange={(e) => handleChange("miniaturizacao", e.target.value)}
            placeholder="Descreva se há presença de fios miniaturizados..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes-trico">
            Observações adicionais da tricoscopia
          </Label>
          <Textarea
            id="observacoes-trico"
            value={data.observacoesTrico || ""}
            onChange={(e) => handleChange("observacoesTrico", e.target.value)}
            placeholder="Outras observações relevantes..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default Tricoscopia;
