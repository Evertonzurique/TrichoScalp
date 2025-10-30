import { useState } from 'react';
import { Check, AlertCircle, Shield, Eye, Brain } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ConsentimentoIAProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConsent: (consentido: boolean) => void;
  clienteNome?: string;
}

const ConsentimentoIA = ({ 
  open, 
  onOpenChange, 
  onConsent, 
  clienteNome 
}: ConsentimentoIAProps) => {
  const [aceito, setAceito] = useState(false);
  const [lendo, setLendo] = useState(false);

  const handleConsent = () => {
    onConsent(aceito);
    if (aceito) {
      onOpenChange(false);
    }
  };

  const handleLerTermo = () => {
    setLendo(true);
    // Simular tempo de leitura
    setTimeout(() => setLendo(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Consentimento para Análise por Inteligência Artificial
          </DialogTitle>
          <DialogDescription>
            {clienteNome && `Cliente: ${clienteNome}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Aviso importante */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-800 flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5" />
                Informação Importante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 text-sm">
                Para utilizar a funcionalidade de <strong>Assessoria de Anamnese com IA</strong>, 
                é necessário o seu consentimento explícito para o processamento automatizado 
                das imagens tricoscópicas e panorâmicas.
              </p>
            </CardContent>
          </Card>

          {/* O que é a análise IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                O que é a Assessoria de Anamnese com IA?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A Assessoria de Anamnese é um sistema de inteligência artificial desenvolvido 
                especificamente para análise de imagens tricoscópicas e panorâmicas do couro cabeludo.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Análise Quantitativa:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Densidade capilar</li>
                    <li>• Níveis de oleosidade</li>
                    <li>• Presença de descamação</li>
                    <li>• Grau de miniaturização</li>
                    <li>• Sinais de inflamação</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Análise Qualitativa:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Interpretação dos achados</li>
                    <li>• Recomendações personalizadas</li>
                    <li>• Comparativo com avaliações anteriores</li>
                    <li>• Relatório detalhado em PDF</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Como funciona */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Como Funciona?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <div>
                    <p className="text-sm font-medium">Upload das Imagens</p>
                    <p className="text-xs text-muted-foreground">
                      Suas imagens tricoscópicas e panorâmicas são enviadas para análise.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <div>
                    <p className="text-sm font-medium">Processamento IA</p>
                    <p className="text-xs text-muted-foreground">
                      Algoritmos especializados analisam as características do couro cabeludo.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <p className="text-sm font-medium">Geração de Relatório</p>
                    <p className="text-xs text-muted-foreground">
                      Relatório completo com dados quantitativos, qualitativos e recomendações.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proteção de dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Proteção de Dados e LGPD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Seus Direitos:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Acesso aos dados processados</li>
                  <li>• Correção de informações incorretas</li>
                  <li>• Exclusão dos dados a qualquer momento</li>
                  <li>• Portabilidade dos dados</li>
                  <li>• Revogação do consentimento</li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Segurança:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Imagens armazenadas com criptografia</li>
                  <li>• Acesso restrito a profissionais autorizados</li>
                  <li>• Não compartilhamento com terceiros</li>
                  <li>• Conformidade com LGPD</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Termo de consentimento */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 text-base">
                Termo de Consentimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-blue-700 space-y-2">
                <p>
                  Eu, <strong>{clienteNome || '[Nome do Cliente]'}</strong>, declaro ter lido 
                  e compreendido as informações acima sobre a Assessoria de Anamnese com IA.
                </p>
                
                <p>
                  <strong>Consinto expressamente</strong> com o processamento automatizado 
                  das minhas imagens tricoscópicas e panorâmicas para fins de análise 
                  capilar e geração de relatórios personalizados.
                </p>
                
                <p>
                  Entendo que posso <strong>revogar este consentimento</strong> a qualquer 
                  momento, e que meus dados serão tratados conforme a Lei Geral de 
                  Proteção de Dados (LGPD).
                </p>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consentimento"
                  checked={aceito}
                  onCheckedChange={(checked) => setAceito(checked as boolean)}
                  disabled={lendo}
                />
                <label 
                  htmlFor="consentimento" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Li e aceito os termos de consentimento para análise por IA
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={lendo}
            >
              Cancelar
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleLerTermo}
                disabled={lendo}
                size="sm"
              >
                {lendo ? 'Lendo...' : 'Marcar como Lido'}
              </Button>
              
              <Button
                onClick={handleConsent}
                disabled={!aceito || lendo}
                className="min-w-[120px]"
              >
                <Check className="h-4 w-4 mr-2" />
                {aceito ? 'Confirmar' : 'Aceitar Termos'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentimentoIA;
