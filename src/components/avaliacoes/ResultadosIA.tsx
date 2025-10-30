import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BarChart3,
  Target,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { AnaliseIAResult } from '@/lib/ia-anamnese';

interface ResultadosIAProps {
  analise: AnaliseIAResult;
  className?: string;
}

const ResultadosIA = ({ analise, className = '' }: ResultadosIAProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!analise) {
    return null;
  }

  const { analise_quantitativa, analise_qualitativa, interpretacao_final, comparativo } = analise;

  // Preparar dados para o gráfico radar
  const radarData = [
    {
      indicador: 'Densidade',
      valor: analise_quantitativa.densidade_capilar * 100,
      fullMark: 100
    },
    {
      indicador: 'Oleosidade',
      valor: analise_quantitativa.oleosidade * 100,
      fullMark: 100
    },
    {
      indicador: 'Descamação',
      valor: analise_quantitativa.descamacao * 100,
      fullMark: 100
    },
    {
      indicador: 'Miniaturização',
      valor: analise_quantitativa.miniaturizacao * 100,
      fullMark: 100
    },
    {
      indicador: 'Inflamação',
      valor: analise_quantitativa.inflamacao * 100,
      fullMark: 100
    }
  ];

  const getIndicadorStatus = (valor: number, tipo: 'densidade' | 'outros') => {
    if (tipo === 'densidade') {
      if (valor >= 0.7) return { status: 'excelente', color: 'text-accent', bg: 'bg-accent/10' };
      if (valor >= 0.5) return { status: 'bom', color: 'text-primary', bg: 'bg-primary/10' };
      if (valor >= 0.3) return { status: 'regular', color: 'text-purple', bg: 'bg-purple/10' };
      return { status: 'baixo', color: 'text-destructive', bg: 'bg-destructive/10' };
    } else {
      if (valor <= 0.2) return { status: 'excelente', color: 'text-accent', bg: 'bg-accent/10' };
      if (valor <= 0.4) return { status: 'bom', color: 'text-primary', bg: 'bg-primary/10' };
      if (valor <= 0.6) return { status: 'regular', color: 'text-purple', bg: 'bg-purple/10' };
      return { status: 'alto', color: 'text-destructive', bg: 'bg-destructive/10' };
    }
  };

  const getTendenciaIcon = (variacao: string) => {
    const valor = parseFloat(variacao.replace('+', ''));
    if (valor > 0.05) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (valor < -0.05) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-gray-400" />;
  };

  return (
    <Card className={`${className} border-primary/20`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Assessoria de Anamnese - IA</CardTitle>
                <Badge variant="outline" className="text-xs">
                  v{analise.metadata.versao_modelo}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={interpretacao_final.nota_global >= 7 ? 'default' : interpretacao_final.nota_global >= 5 ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  Nota: {interpretacao_final.nota_global}/10
                </Badge>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
            <CardDescription>
              Análise quantitativa e qualitativa com inteligência artificial
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Resumo da Análise */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Resumo da Análise
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {analise_qualitativa.resumo}
              </p>
            </div>

            {/* Dados Quantitativos */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Indicadores Quantitativos
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Densidade Capilar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Densidade Capilar</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getIndicadorStatus(analise_quantitativa.densidade_capilar, 'densidade').color}`}
                    >
                      {(analise_quantitativa.densidade_capilar * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={analise_quantitativa.densidade_capilar * 100} 
                    className="h-2"
                  />
                </div>

                {/* Oleosidade */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Oleosidade</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getIndicadorStatus(analise_quantitativa.oleosidade, 'outros').color}`}
                    >
                      {(analise_quantitativa.oleosidade * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={analise_quantitativa.oleosidade * 100} 
                    className="h-2"
                  />
                </div>

                {/* Descamação */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Descamação</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getIndicadorStatus(analise_quantitativa.descamacao, 'outros').color}`}
                    >
                      {(analise_quantitativa.descamacao * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={analise_quantitativa.descamacao * 100} 
                    className="h-2"
                  />
                </div>

                {/* Miniaturização */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Miniaturização</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getIndicadorStatus(analise_quantitativa.miniaturizacao, 'outros').color}`}
                    >
                      {(analise_quantitativa.miniaturizacao * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={analise_quantitativa.miniaturizacao * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            </div>

            {/* Gráfico Radar */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Visão Geral dos Indicadores</h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="indicador" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Valores"
                      dataKey="valor"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Achados */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Achados Observados
              </h4>
              <ul className="space-y-2">
                {analise_qualitativa.achados.map((achado, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{achado}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recomendações */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Recomendações
              </h4>
              <ol className="space-y-2">
                {analise_qualitativa.recomendacoes.map((recomendacao, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="text-xs mt-0.5 flex-shrink-0">
                      {index + 1}
                    </Badge>
                    <span className="text-muted-foreground">{recomendacao}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Comparativo com Avaliação Anterior */}
            {comparativo.variacao && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Comparativo com Avaliação Anterior
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(comparativo.variacao).map(([indicador, variacao]) => (
                      <div key={indicador} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm font-medium capitalize">
                          {indicador.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1">
                          {getTendenciaIcon(variacao as string)}
                          <span className="text-sm font-mono">
                            {variacao}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {comparativo.evolucao_geral}
                    </AlertDescription>
                  </Alert>
                </div>
              </>
            )}

            {/* Interpretação Final */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Interpretação Final
              </h4>
              
              <div className="bg-primary/5 p-4 rounded-lg space-y-3">
                <p className="text-sm font-medium">{interpretacao_final.avaliacao_ia}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Confiabilidade do modelo: {(interpretacao_final.confiabilidade_modelo * 100).toFixed(1)}%</span>
                  <span>Processado em: {new Date(analise.metadata.data_processamento).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ResultadosIA;
