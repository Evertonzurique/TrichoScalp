import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Detalhes da Avaliação</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Cliente: {avaliacao.cliente?.nome} •{" "}
            {format(new Date(avaliacao.created_at), "dd/MM/yyyy", {
              locale: ptBR,
            })}
          </p>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
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
            {renderSection("Tricoscopia", avaliacao.tricoscopia)}
            <Separator />
            {renderSection("Informações", avaliacao.informacoes)}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AvaliacaoDetalhes;
