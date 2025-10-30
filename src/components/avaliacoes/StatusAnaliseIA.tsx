import { useState } from 'react';
import { 
  Clock, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  RefreshCw,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StatusAnaliseIAProps {
  status: 'idle' | 'processing' | 'completed' | 'error';
  isProcessing?: boolean;
  onAcionarAnalise?: () => void;
  onRefetch?: () => void;
  error?: string | null;
  progress?: number;
  className?: string;
}

const StatusAnaliseIA = ({
  status,
  isProcessing = false,
  onAcionarAnalise,
  onRefetch,
  error,
  progress = 0,
  className = ''
}: StatusAnaliseIAProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefetch = async () => {
    if (onRefetch) {
      setIsRefreshing(true);
      try {
        await onRefetch();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'idle':
        return {
          icon: <Clock className="h-4 w-4" />,
          label: 'Aguardando Análise',
          description: 'Nenhuma análise IA foi realizada ainda',
          variant: 'secondary' as const,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted'
        };
      
      case 'processing':
        return {
          icon: <Loader2 className="h-4 w-4 animate-spin" />,
          label: 'Analisando com IA',
          description: 'Processando imagens tricoscópicas...',
          variant: 'default' as const,
          color: 'text-primary',
          bgColor: 'bg-primary/10'
        };
      
      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Análise Concluída',
          description: 'Relatório IA gerado com sucesso',
          variant: 'default' as const,
          color: 'text-accent',
          bgColor: 'bg-accent/10'
        };
      
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Erro na Análise',
          description: 'Falha ao processar imagens',
          variant: 'destructive' as const,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10'
        };
      
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          label: 'Status Desconhecido',
          description: 'Não foi possível determinar o status',
          variant: 'secondary' as const,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className={`${className} ${statusConfig.bgColor} border-primary/20 shadow-card`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={statusConfig.color}>
              {statusConfig.icon}
            </div>
            <CardTitle className={`text-sm ${statusConfig.color}`}>
              {statusConfig.label}
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={statusConfig.variant} className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              IA
            </Badge>
            
            {onRefetch && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefetch}
                disabled={isRefreshing || isProcessing}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
        
        <CardDescription className="text-xs">
          {statusConfig.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Barra de progresso para status processing */}
        {status === 'processing' && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Processando imagens...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Botão para acionar análise */}
        {status === 'idle' && onAcionarAnalise && (
          <Button
            onClick={onAcionarAnalise}
            disabled={isProcessing}
            size="sm"
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {isProcessing ? 'Iniciando...' : 'Iniciar Análise IA'}
          </Button>
        )}

        {/* Botão para reprocessar */}
        {(status === 'completed' || status === 'error') && onAcionarAnalise && (
          <Button
            onClick={onAcionarAnalise}
            disabled={isProcessing}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isProcessing ? 'Reprocessando...' : 'Reprocessar Análise'}
          </Button>
        )}

        {/* Mensagem de erro */}
        {status === 'error' && error && (
          <Alert className="mt-3" role="alert" aria-live="assertive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Informações adicionais para status completed */}
        {status === 'completed' && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Análise quantitativa</span>
              <Badge variant="outline" className="text-xs">✓</Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Análise qualitativa</span>
              <Badge variant="outline" className="text-xs">✓</Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Relatório PDF</span>
              <Badge variant="outline" className="text-xs">✓</Badge>
            </div>
          </div>
        )}

        {/* Indicador de processamento global */}
        {isProcessing && status !== 'processing' && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground" role="status" aria-live="polite">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Processando...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusAnaliseIA;
