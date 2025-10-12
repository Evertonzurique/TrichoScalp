import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User } from "lucide-react";
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
}

const AvaliacaoCard = ({ avaliacao, onView }: AvaliacaoCardProps) => {
  const queixaText = avaliacao.queixa_principal?.queixa || "Não informado";
  const resumoQueixa = queixaText.length > 100 
    ? queixaText.substring(0, 100) + "..." 
    : queixaText;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-lg">{avaliacao.cliente.nome}</h3>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(avaliacao.created_at), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <FileText className="h-4 w-4 text-muted-foreground mt-1" />
            <p className="text-sm text-muted-foreground">{resumoQueixa}</p>
          </div>
        </div>

        <Button onClick={() => onView(avaliacao.id)} variant="outline">
          Ver Detalhes
        </Button>
      </div>
    </Card>
  );
};

export default AvaliacaoCard;
