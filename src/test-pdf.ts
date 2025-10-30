// Arquivo de teste para validar a geração do PDF
import { generateTrichologyPDF, type TrichologyReportData } from './lib/pdf-generator';

// Dados de exemplo para teste
const testData: TrichologyReportData = {
  paciente: {
    nome: "Maria Silva",
    idade: 35,
    genero: "Feminino"
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
    "frontal_esquerda": "https://example.com/image1.jpg",
    "frontal_centro": "https://example.com/image2.jpg",
    "frontal_direita": "https://example.com/image3.jpg",
    "meio_esquerda": "https://example.com/image4.jpg",
    "meio_centro": "https://example.com/image5.jpg",
    "meio_direita": "https://example.com/image6.jpg",
    "posterior_esquerda": "https://example.com/image7.jpg",
    "posterior_centro": "https://example.com/image8.jpg",
    "posterior_direita": "https://example.com/image9.jpg"
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

// Função de teste
export async function testPDFGeneration() {
  try {
    console.log('Iniciando teste de geração de PDF...');
    
    const pdfBlob = await generateTrichologyPDF(testData, {
      theme: 'light',
      includeQRCode: true,
      autoDownload: false,
      uploadToStorage: false
    });
    
    console.log('PDF gerado com sucesso!', pdfBlob);
    
    // Criar URL para download de teste
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teste-relatorio-tricologia.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Erro no teste de PDF:', error);
    return false;
  }
}

// Para usar no console do navegador:
// import { testPDFGeneration } from './test-pdf';
// testPDFGeneration();