import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFTestComponent } from '@/components/test/PDFTestComponent';
import { useNavigate } from 'react-router-dom';

const TestPDF: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground">
            Relatório PDF - TrichoScalp
          </h1>
          <p className="text-muted-foreground mt-2">
            Página para validar a geração de relatórios PDF de tricologia
          </p>
        </div>

        <PDFTestComponent />
        {/* Removido bloco "Informações do Teste" para evitar exibição de mensagens de teste */}
      </div>
    </div>
  );
};

export default TestPDF;