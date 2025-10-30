import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  Calendar,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ComparativoDetalhado } from '@/lib/comparativo-avaliacoes';

interface ComparativoAvaliacoesProps {
  comparativo: ComparativoDetalhado | null;
  historico?: any[];
  className?: string;
}

const ComparativoAvaliacoes = ({ 
  comparativo, 
  historico = [], 
  className = '' 
}: ComparativoAvaliacoesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!comparativo) {
    return (
      <Card className={`${className} border-muted`}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Comparativo Histórico
          </CardTitle>
          <CardDescription>
            Nenhuma avaliação anterior disponível para comparação
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { 
    atual, 
    anterior, 
    variacao_formatada, 
    evolucao_geral,
    tempo_entre_avaliacoes 
  } = comparativo;

  // Preparar dados para o gráfico de linha temporal
  const dadosTemporais = historico
    .filter(item => item.analise_ia)
    .map(item => ({
      data: format(new Date(item.created_at), 'dd/MM', { locale: ptBR }),
      dataCompleta: item.created_at,
      densidade: item.analise_ia.analise_quantitativa.densidade_capilar * 100,
      oleosidade: item.analise_ia.analise_quantitativa.oleosidade * 100,
      descamacao: item.analise_ia.analise_quantitativa.descamacao * 100,
      miniaturizacao: item.analise_ia.analise_quantitativa.miniaturizacao * 100,
      inflamacao: item.analise_ia.analise_quantitativa.inflamacao * 100,
    }))
    .sort((a, b) => new Date(a.dataCompleta).getTime() - new Date(b.dataCompleta).getTime());

  const getTendenciaIcon = (variacao: string) => {
    const valor = parseFloat(variacao.replace('+', ''));
    if (valor > 0.05) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (valor < -0.05) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  const getTendenciaColor = (variacao: string) => {
    const valor = parseFloat(variacao.replace('+', ''));
    if (valor > 0.05) return 'text-green-600';
    if (valor < -0.05) return 'text-red-600';
    return 'text-gray-500';
  };

  const getStatusEvolucao = () => {
    switch (evolucao_geral.status) {
      case 'melhora':
        return { 
          color: 'text-accent', 
          bg: 'bg-accent/10', 
          icon: <TrendingUp className="h-4 w-4" />,
          label: 'Melhora'
        };
      case 'piora':
        return { 
          color: 'text-destructive', 
          bg: 'bg-destructive/10', 
          icon: <TrendingDown className="h-4 w-4" />,
          label: 'Piora'
        };
      case 'estavel':
        return { 
          color: 'text-secondary', 
          bg: 'bg-secondary/10', 
          icon: <Minus className="h-4 w-4" />,
          label: 'Estável'
        };
      default:
        return { 
          color: 'text-purple', 
          bg: 'bg-purple/10', 
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Mista'
        };
    }
  };

  const statusEvolucao = getStatusEvolucao();

  return (
    <Card className={`${className} border-primary/20 shadow-card`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Comparativo Histórico</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {tempo_entre_avaliacoes > 0 ? `${tempo_entre_avaliacoes} dias` : 'Atual'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${statusEvolucao.color} ${statusEvolucao.bg}`}
                >
                  {statusEvolucao.icon}
                  <span className="ml-1">{statusEvolucao.label}</span>
                </Badge>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
            <CardDescription>
              Evolução dos indicadores em relação à avaliação anterior
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Resumo da Evolução */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Resumo da Evolução
              </h4>
              <Alert className={statusEvolucao.bg}>
                <statusEvolucao.icon className={`h-4 w-4 ${statusEvolucao.color}`} />
                <AlertDescription className={statusEvolucao.color}>
                  {evolucao_geral.descricao}
                </AlertDescription>
              </Alert>
            </div>

            {/* Tabela Comparativa */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Comparação Detalhada</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Indicador</th>
                      <th className="text-center py-2 font-medium">Anterior</th>
                      <th className="text-center py-2 font-medium">Atual</th>
                      <th className="text-center py-2 font-medium">Variação</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {Object.entries(variacao_formatada).map(([indicador, variacao]) => {
                      const valorAnterior = anterior[indicador as keyof typeof anterior] * 100;
                      const valorAtual = atual[indicador as keyof typeof atual] * 100;
                      
                      return (
                        <tr key={indicador} className="border-b border-muted">
                          <td className="py-2 font-medium capitalize">
                            {indicador.replace('_', ' ')}
                          </td>
                          <td className="text-center py-2 text-muted-foreground">
                            {valorAnterior.toFixed(1)}%
                          </td>
                          <td className="text-center py-2 font-medium">
                            {valorAtual.toFixed(1)}%
                          </td>
                          <td className="text-center py-2">
                            <div className="flex items-center justify-center gap-1">
                              {getTendenciaIcon(variacao)}
                              <span className={`font-mono ${getTendenciaColor(variacao)}`}>
                                {variacao}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Estatísticas da Evolução */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">
                  {evolucao_geral.indicadores_melhoraram}
                </div>
                <div className="text-xs text-muted-foreground">Melhoraram</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-red-600">
                  {evolucao_geral.indicadores_pioraram}
                </div>
                <div className="text-xs text-muted-foreground">Pioraram</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">
                  {evolucao_geral.indicadores_estaveis}
                </div>
                <div className="text-xs text-muted-foreground">Estáveis</div>
              </div>
            </div>

            {/* Gráfico de Evolução Temporal */}
            {dadosTemporais.length > 1 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Evolução Temporal</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dadosTemporais}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="data" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `${value.toFixed(1)}%`, 
                          name.charAt(0).toUpperCase() + name.slice(1)
                        ]}
                        labelFormatter={(label) => `Data: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="densidade" 
                        stroke="#6BD6B1" 
                        strokeWidth={2}
                        name="densidade"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="oleosidade" 
                        stroke="#2A5C8B" 
                        strokeWidth={2}
                        name="oleosidade"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="descamacao" 
                        stroke="#B8A1C9" 
                        strokeWidth={2}
                        name="descamacao"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="miniaturizacao" 
                        stroke="#FFD700" 
                        strokeWidth={2}
                        name="miniaturizacao"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="inflamacao" 
                        stroke="#3D7CB8" 
                        strokeWidth={2}
                        name="inflamacao"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Score de Evolução */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Score de Evolução</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progresso Geral</span>
                    <span className="font-medium">
                      {evolucao_geral.score_evolucao > 0 ? '+' : ''}
                      {evolucao_geral.score_evolucao.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        evolucao_geral.score_evolucao > 0 
                          ? 'bg-accent' 
                          : evolucao_geral.score_evolucao < 0 
                          ? 'bg-destructive' 
                          : 'bg-primary'
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.max(0, (evolucao_geral.score_evolucao + 100) / 2))}%` 
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Escala</div>
                  <div className="text-xs font-mono">-100 a +100</div>
                </div>
              </div>
            </div>

            {/* Recomendações baseadas na evolução */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Recomendações de Acompanhamento</h4>
              <div className="space-y-2">
                {evolucao_geral.status === 'melhora' && (
                  <Alert className="bg-green-50 border-green-200">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Continue com o protocolo atual. A evolução positiva indica que o tratamento está sendo eficaz.
                    </AlertDescription>
                  </Alert>
                )}
                
                {evolucao_geral.status === 'piora' && (
                  <Alert className="bg-red-50 border-red-200">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Considere revisar o protocolo de tratamento. A piora nos indicadores pode indicar necessidade de ajustes.
                    </AlertDescription>
                  </Alert>
                )}
                
                {evolucao_geral.status === 'estavel' && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Minus className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Mantenha o acompanhamento regular. A estabilidade pode indicar que o tratamento está controlando a progressão.
                    </AlertDescription>
                  </Alert>
                )}
                
                {evolucao_geral.status === 'mista' && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Análise individual necessária. Alguns indicadores melhoraram enquanto outros pioraram.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ComparativoAvaliacoes;
