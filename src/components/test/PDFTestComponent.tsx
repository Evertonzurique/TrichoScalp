import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePDFGenerator, useTrichologyReportData } from '@/hooks/usePDFGenerator';
import { Download, FileText, Loader2 } from 'lucide-react';

// Dados de exemplo para teste
const mockData = {
  paciente: {
    nome: "Maria Silva",
    idade: 35,
    genero: "Feminino" as const
  },
  anamnese: {
    queixa_principal: "Queda de cabelo excessiva",
    historico_familiar: "Mãe com alopecia androgenética",
    uso_medicamentos: "Anticoncepcional há 5 anos",
    habitos_alimentares: "Dieta balanceada",
    nivel_stress: "Alto",
    frequencia_lavagem: "Diária",
    produtos_utilizados: "Shampoo neutro, condicionador"
  },
  imagens: {
    "frontal_esquerda": "https://via.placeholder.com/300x300/4CAF50/white?text=Frontal+Esq",
    "frontal_centro": "https://via.placeholder.com/300x300/2196F3/white?text=Frontal+Centro",
    "frontal_direita": "https://via.placeholder.com/300x300/FF9800/white?text=Frontal+Dir",
    "meio_esquerda": "https://via.placeholder.com/300x300/9C27B0/white?text=Meio+Esq",
    "meio_centro": "https://via.placeholder.com/300x300/F44336/white?text=Meio+Centro",
    "meio_direita": "https://via.placeholder.com/300x300/607D8B/white?text=Meio+Dir",
    "posterior_esquerda": "https://via.placeholder.com/300x300/795548/white?text=Post+Esq",
    "posterior_centro": "https://via.placeholder.com/300x300/009688/white?text=Post+Centro",
    "posterior_direita": "https://via.placeholder.com/300x300/E91E63/white?text=Post+Dir"
  },
  analiseIA: {
    analise_quantitativa: {
      densidade_capilar: 85,
      oleosidade: 60,
      miniaturizacao: 25,
      inflamacao: 15,
      descamacao: 10
    },
    analise_qualitativa: "Observa-se redução da densidade capilar na região frontal e vertex. Presença de miniaturização folicular moderada. Oleosidade aumentada no couro cabeludo.",
    interpretacao_final: "Quadro compatível com alopecia androgenética grau II na escala de Ludwig. Recomenda-se tratamento com minoxidil tópico e acompanhamento dermatológico."
  },
  profissional: {
    nome: "Dr. João Santos",
    crm: "CRM-SP 123456"
  },
  data: "2024-01-15"
};

export const PDFTestComponent: React.FC = () => {
  const { generatePDF, isGenerating, isUploading, progress, error, publicUrl } = usePDFGenerator();
  const { prepareReportData } = useTrichologyReportData();
  const location = useLocation();

  const handleTestPDF = async () => {
    try {
      const reportData = prepareReportData(
        mockData.paciente,
        mockData.anamnese,
        mockData.imagens,
        mockData.analiseIA,
        mockData.profissional
      );
      
      await generatePDF(reportData, {
        theme: 'light',
        includeQRCode: true,
        autoDownload: true,
        uploadToStorage: false
      });
    } catch (error) {
      console.error('Erro no teste de PDF:', error);
    }
  };

  const handleTestPDFWithUpload = async () => {
    try {
      const reportData = prepareReportData(
        mockData.paciente,
        mockData.anamnese,
        mockData.imagens,
        mockData.analiseIA,
        mockData.profissional
      );
      
      await generatePDF(reportData, {
        theme: 'dark',
        includeQRCode: true,
        autoDownload: false,
        uploadToStorage: true
      });
    } catch (error) {
      console.error('Erro no teste de PDF com upload:', error);
    }
  };

  // Geração automática via query string (auto=download|upload)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const auto = params.get('auto');
    if (!auto) return;

    const run = async () => {
      const reportData = prepareReportData(
        mockData.paciente,
        mockData.anamnese,
        mockData.imagens,
        mockData.analiseIA,
        mockData.profissional
      );

      if (auto === 'download') {
        await generatePDF(reportData, {
          theme: 'light',
          includeQRCode: true,
          autoDownload: true,
          uploadToStorage: false
        });
      } else if (auto === 'upload') {
        await generatePDF(reportData, {
          theme: 'dark',
          includeQRCode: true,
          autoDownload: false,
          uploadToStorage: true
        });
      }
    };

    // evitar múltiplas execuções
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Relatório PDF - TrichoScalp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Este componente testa a geração de PDF do relatório de tricologia.</p>
          <p>Dados de exemplo serão utilizados para validar todas as funcionalidades.</p>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {publicUrl && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">
              PDF enviado com sucesso! 
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="underline ml-1">
                Ver arquivo
              </a>
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleTestPDF}
            disabled={isGenerating || isUploading}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando PDF... {progress}%
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Testar PDF (Download)
              </>
            )}
          </Button>

          <Button 
            onClick={handleTestPDFWithUpload}
            disabled={isGenerating || isUploading}
            variant="outline"
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando... {progress}%
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Testar PDF (Upload)
              </>
            )}
          </Button>
        </div>

        {/* Bloco de teste visual do botão PDF em ambos os temas */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Teste visual de legibilidade do botão PDF</p>
          <div className="avaliacao-detalhes">
            <Button 
              variant="outline" 
              size="sm" 
              className="btn-pdf"
              aria-label="Baixar PDF (claro)"
              title="Baixar PDF (claro)"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
          <div className="dark avaliacao-detalhes p-2 rounded-md">
            <Button 
              variant="outline" 
              size="sm" 
              className="btn-pdf"
              aria-label="Baixar PDF (escuro)"
              title="Baixar PDF (escuro)"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>

        {/* Removido conteúdo "Teste 1/2" para não exibir mensagens de teste visíveis ao usuário */}
      </CardContent>
    </Card>
  );
};