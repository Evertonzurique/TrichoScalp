import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { X, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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

  const handleDownloadPdf = async () => {
    if (!avaliacao) return;
    
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

      const fileName = `Avaliacao_${avaliacao.cliente?.nome}_${format(
        new Date(avaliacao.created_at),
        "dd-MM-yyyy"
      )}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!avaliacao) return null;

  const renderSection = (title: string, data: any) => {
    if (!data || Object.keys(data).length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">{title}</h3>
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]: [string, any]) => {
            if (!value) return null;
            
            return (
              <div key={key} className="text-sm">
                <span className="font-medium capitalize">
                  {key.replace(/_/g, " ")}:{" "}
                </span>
                <span className="text-muted-foreground">
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
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
        <h3 className="font-semibold text-lg mb-3">
          Tricoscopia - Fotodocumentação
        </h3>

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
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium text-center px-2">
                        {avaliacaoPadraoLabels[key] || key}
                      </span>
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
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium text-center px-2">
                        {avaliacaoEspecificaLabels[key] || key}
                      </span>
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
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle>Detalhes da Avaliação</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Cliente: {avaliacao.cliente?.nome} •{" "}
                  {format(new Date(avaliacao.created_at), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
              >
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPdf ? "Gerando..." : "Baixar PDF"}
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">
            <div id="avaliacao-content" className="space-y-4 bg-background p-4">
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
              {renderTricoscopiaSection()}
              <Separator />
              {renderSection("Informações", avaliacao.informacoes)}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
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

export default AvaliacaoDetalhes;
