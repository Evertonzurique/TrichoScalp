import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileText, Calendar, User, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AvaliacaoCardProps {
  avaliacao: {
    id: string;
    created_at: string;
    cliente: {
      nome: string;
    };
    queixa_principal?: any;
  };
  onView: (id: string) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const AvaliacaoCard = ({ avaliacao, onView, onDelete, isDeleting = false }: AvaliacaoCardProps) => {
  const queixaText = avaliacao.queixa_principal?.queixa || "Não informado";
  const resumoQueixa = queixaText.length > 100 
    ? queixaText.substring(0, 100) + "..." 
    : queixaText;

  return (
    <div className="card-brand transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-lg">{avaliacao.cliente.nome}</h3>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/80 mb-3">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(avaliacao.created_at), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <FileText className="h-4 w-4 text-secondary mt-1" />
            <p className="text-sm">{resumoQueixa}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => onView(avaliacao.id)}
            variant="default"
            size="sm"
            className="gradient-primary transition-smooth focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label="Ver detalhes da avaliação"
          >
            Ver Detalhes
          </Button>

          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-smooth focus-visible:ring-2 focus-visible:ring-accent/50"
                  aria-label="Deletar avaliação"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                      Deletando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Deletar
                    </span>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a avaliação selecionada.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(avaliacao.id)}
                    aria-busy={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sim, excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvaliacaoCard;
