import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

// ==================== INTERFACES E TIPOS ====================

export interface TrichologyReportData {
  paciente: {
    nome: string;
    idade: number;
    genero: string;
    telefone?: string;
    email?: string;
    data_nascimento?: string;
  };
  anamnese: Record<string, string | number>;
  imagens: { [posicao: string]: string };
  analiseIA: {
    analise_quantitativa: Record<string, number>;
    analise_qualitativa: string;
    interpretacao_final: string;
    comparativo?: {
      evolucao_geral?: string;
      score?: number;
      variacao?: Record<string, number>;
    };
  };
  profissional: {
    nome: string;
    crm?: string;
    especialidade?: string;
    contato?: string;
  };
  data: string;
  observacoes?: string;
  recomendacoes?: string[];
}

export interface PDFTheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  border: string;
}

export interface PDFOptions {
  theme?: 'light' | 'dark';
  includeQRCode?: boolean;
  includeCharts?: boolean;
  logoUrl?: string;
  customTheme?: PDFTheme;
  reportUrl?: string;
  qualidadeImagem?: number;
}

// ==================== TEMAS ====================

const themes: Record<'light' | 'dark', PDFTheme> = {
  light: {
    primary: '#009688',
    secondary: '#1E88E5', 
    accent: '#4CAF50',
    text: '#2C3E50',
    background: '#FFFFFF',
    border: '#E0E0E0'
  },
  dark: {
    primary: '#26A69A',
    secondary: '#42A5F5',
    accent: '#66BB6A', 
    text: '#ECEFF1',
    background: '#263238',
    border: '#455A64'
  }
};

// ==================== CLASSE PRINCIPAL ====================

export class TrichologyPDFGenerator {
  private pdf: jsPDF;
  private currentY: number = 0;
  private pageHeight: number = 0;
  private pageWidth: number = 0;
  private margin: number = 20;
  private theme: PDFTheme;
  private options: PDFOptions;

  // Configurações de fonte e layout
  private readonly fontSizes = {
    title: 16,
    subtitle: 14,
    heading: 12,
    body: 10,
    caption: 8
  };

  private readonly spacing = {
    section: 15,
    subsection: 8,
    line: 5,
    paragraph: 3
  };

  constructor(options: PDFOptions = {}) {
    this.options = {
      theme: 'light',
      includeQRCode: true,
      includeCharts: true,
      qualidadeImagem: 0.8,
      ...options
    };

    this.theme = options.customTheme || themes[this.options.theme!];
    
    // Inicializar PDF em formato A4 vertical
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    this.pageHeight = this.pdf.internal.pageSize.height;
    this.pageWidth = this.pdf.internal.pageSize.width;
    this.currentY = this.margin;

    // Configurar metadados
    this.setupPDFMetadata();
  }

  // ==================== MÉTODO PRINCIPAL ====================

  async generateTrichologyPDF(data: TrichologyReportData): Promise<Blob> {
    try {
      // 1. Capa
      await this.addCoverPage(data);
      
      // 2. Dados Clínicos (Anamnese)
      this.addNewPage();
      this.addClinicalDataSection(data);
      
      // 3. Imagens de Tricoscopia
      this.addNewPage();
      await this.addTricoscopyImagesSection(data);
      
      // 4. Análise de IA
      this.addNewPage();
      await this.addAIAnalysisSection(data);
      
      // 5. Conclusão e Recomendações
      this.addNewPage();
      this.addConclusionSection(data);
      
      // 6. Rodapé em todas as páginas
      this.addPageNumbers();

      return this.pdf.output('blob');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Falha na geração do relatório PDF');
    }
  }

  // ==================== SEÇÕES DO PDF ====================

  private async addCoverPage(data: TrichologyReportData): Promise<void> {
    // Cabeçalho com cor de fundo
    {
      const [r, g, b] = this.hexToRgb(this.theme.primary);
      this.pdf.setFillColor(r, g, b);
    }
    this.pdf.rect(0, 0, this.pageWidth, 60, 'F');

    // Logo (se fornecido)
    if (this.options.logoUrl) {
      try {
        const logoBase64 = await this.loadImageAsBase64(this.options.logoUrl);
        this.pdf.addImage(logoBase64, 'PNG', this.margin, 15, 30, 30);
      } catch (error) {
        console.warn('Erro ao carregar logo:', error);
      }
    }

    // Título principal
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(this.fontSizes.title);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('TrichoScalp', this.pageWidth / 2, 25, { align: 'center' });
    
    this.pdf.setFontSize(this.fontSizes.subtitle);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Assessoria de Anamnese com IA', this.pageWidth / 2, 35, { align: 'center' });

    // Informações do relatório
    this.currentY = 80;
    {
      const [r, g, b] = this.hexToRgb(this.theme.text);
      this.pdf.setTextColor(r, g, b);
    }
    this.pdf.setFontSize(this.fontSizes.heading);
    this.pdf.setFont('helvetica', 'bold');

    this.addText('RELATÓRIO DE AVALIAÇÃO CAPILAR', 'center');
    this.currentY += this.spacing.section;

    // Dados do paciente e profissional
    this.pdf.setFontSize(this.fontSizes.body);
    this.pdf.setFont('helvetica', 'normal');
    
    this.addText(`Paciente: ${data.paciente.nome}`, 'left');
    this.addText(`Idade: ${data.paciente.idade} anos | Gênero: ${data.paciente.genero}`, 'left');
    this.currentY += this.spacing.subsection;
    
    // Ajuste solicitado: exibir apenas Especialidade
    const especialidade = data.profissional.especialidade || 'Tricologia';
    this.addText(`Especialidade: ${especialidade}`, 'left');
    
    this.currentY += this.spacing.section;
    this.addText(`Data da Avaliação: ${this.formatDate(data.data)}`, 'left');
    this.addText(`Versão do Relatório: v1.0.0`, 'left');

    // QR Code (se habilitado)
    if (this.options.includeQRCode && this.options.reportUrl) {
      await this.addQRCode(this.options.reportUrl);
    }
  }

  private addClinicalDataSection(data: TrichologyReportData): void {
    this.addSectionTitle('DADOS CLÍNICOS - ANAMNESE');
    
    // Informações básicas
    this.addSubsectionTitle('Informações Básicas');
    this.addText(`Nome: ${data.paciente.nome}`);
    this.addText(`Idade: ${data.paciente.idade} anos`);
    this.addText(`Gênero: ${data.paciente.genero}`);
    
    if (data.paciente.telefone) {
      this.addText(`Telefone: ${data.paciente.telefone}`);
    }
    if (data.paciente.email) {
      this.addText(`E-mail: ${data.paciente.email}`);
    }

    this.currentY += this.spacing.subsection;

    // Dados da anamnese
    this.addSubsectionTitle('Dados da Anamnese');
    
    Object.entries(data.anamnese).forEach(([key, value]) => {
      if (value && value !== '') {
        const formattedKey = this.formatFieldName(key);
        const formattedValue = typeof value === 'object' 
          ? this.formatObjectValue(value) 
          : String(value);
        
        this.addText(`${formattedKey}: ${formattedValue}`);
      }
    });
  }

  private async addTricoscopyImagesSection(data: TrichologyReportData): Promise<void> {
    this.addSectionTitle('IMAGENS DE TRICOSCOPIA');
    
    const imageEntries = Object.entries(data.imagens);
    if (imageEntries.length === 0) {
      this.addText('Nenhuma imagem disponível para esta avaliação.');
      return;
    }

    // Organizar imagens em grade 3x3
    const positions = [
      'frontalEsquerda', 'meioFrontal', 'frontalDireita',
      'meioEsquerda', 'meio', 'meioDireita', 
      'posteriorEsquerda', 'posteriorMeio', 'posteriorDireita'
    ];

    // Suporte a chaves alternativas usadas no grid (snake_case)
    const altKeys: Record<string, string> = {
      frontalEsquerda: 'frontal_esquerda',
      meioFrontal: 'frontal_centro',
      frontalDireita: 'frontal_direita',
      meioEsquerda: 'meio_esquerda',
      meio: 'meio_centro',
      meioDireita: 'meio_direita',
      posteriorEsquerda: 'posterior_esquerda',
      posteriorMeio: 'posterior_centro',
      posteriorDireita: 'posterior_direita'
    };

    const imageSize = 50; // mm
    const spacing = 5; // mm
    const startX = this.margin;
    let currentRow = 0;
    let currentCol = 0;

    for (const position of positions) {
      const url = data.imagens[position] || data.imagens[altKeys[position]];
      if (url) {
        try {
          const imageBase64 = await this.loadImageAsBase64(url);
          
          const x = startX + currentCol * (imageSize + spacing);
          const y = this.currentY + currentRow * (imageSize + spacing + 10);
          
          // Verificar se precisa de nova página
          if (y + imageSize > this.pageHeight - this.margin) {
            this.addNewPage();
            this.currentY = this.margin;
            currentRow = 0;
          }

          // Adicionar imagem
          this.pdf.addImage(imageBase64, 'JPEG', x, y, imageSize, imageSize);
          
          // Adicionar legenda
          this.pdf.setFontSize(this.fontSizes.caption);
          this.pdf.text(this.formatPositionName(position), x + imageSize/2, y + imageSize + 5, { align: 'center' });
          
          currentCol++;
          if (currentCol >= 3) {
            currentCol = 0;
            currentRow++;
          }
        } catch (error) {
          console.warn(`Erro ao carregar imagem ${position}:`, error);
        }
      }
    }

    // Atualizar posição Y
    this.currentY += (currentRow + 1) * (imageSize + spacing + 10) + this.spacing.section;
  }

  private async addAIAnalysisSection(data: TrichologyReportData): Promise<void> {
    this.addSectionTitle('ANÁLISE DE INTELIGÊNCIA ARTIFICIAL');
    
    // Análise Quantitativa
    this.addSubsectionTitle('Resultados Quantitativos');
    
    const quantitativeData = data.analiseIA.analise_quantitativa;
    Object.entries(quantitativeData).forEach(([key, value]) => {
      const formattedKey = this.formatFieldName(key);
      const percentage = Math.round(Number(value) * 100);
      this.addText(`${formattedKey}: ${percentage}%`);
    });

    // Gráfico de barras (se habilitado)
    if (this.options.includeCharts) {
      // Aumentar espaçamento antes do gráfico para evitar colisões
      this.currentY += this.spacing.subsection + 5;
      await this.addQuantitativeChart(quantitativeData);
    }

    this.currentY += this.spacing.subsection;

    // Análise Qualitativa
    this.addSubsectionTitle('Análise Qualitativa');
    this.addWrappedText(data.analiseIA.analise_qualitativa);

    this.currentY += this.spacing.subsection;

    // Comparativo (se disponível)
    if (data.analiseIA.comparativo) {
      this.addSubsectionTitle('Comparativo com Avaliação Anterior');
      
      if (data.analiseIA.comparativo.evolucao_geral) {
        this.addText(`Evolução Geral: ${data.analiseIA.comparativo.evolucao_geral}`);
      }
      
      if (data.analiseIA.comparativo.score !== undefined) {
        this.addText(`Score de Evolução: ${data.analiseIA.comparativo.score}`);
      }

      if (data.analiseIA.comparativo.variacao) {
        this.addText('Variações:');
        Object.entries(data.analiseIA.comparativo.variacao).forEach(([key, value]) => {
          const formattedKey = this.formatFieldName(key);
          const sign = Number(value) >= 0 ? '+' : '';
          this.addText(`  ${formattedKey}: ${sign}${Math.round(Number(value) * 100)}%`);
        });
      }
    }
  }

  private addConclusionSection(data: TrichologyReportData): void {
    this.addSectionTitle('CONCLUSÃO E RECOMENDAÇÕES');
    
    // Interpretação Final da IA
    this.addSubsectionTitle('Interpretação da IA');
    this.addWrappedText(data.analiseIA.interpretacao_final);
    
    this.currentY += this.spacing.subsection;

    // Observações do Profissional
    if (data.observacoes) {
      this.addSubsectionTitle('Observações do Profissional');
      this.addWrappedText(data.observacoes);
      this.currentY += this.spacing.subsection;
    }

    // Recomendações
    if (data.recomendacoes && data.recomendacoes.length > 0) {
      this.addSubsectionTitle('Recomendações');
      data.recomendacoes.forEach((recomendacao, index) => {
        this.addText(`${index + 1}. ${recomendacao}`);
      });
    }

    // Rodapé da conclusão
    this.currentY += this.spacing.section * 2;
    this.addText('Este relatório foi gerado automaticamente pelo sistema TrichoScalp.', 'center');
    this.addText('Para dúvidas ou esclarecimentos, entre em contato com o profissional responsável.', 'center');
  }

  // ==================== MÉTODOS AUXILIARES ====================

  private async addQuantitativeChart(data: Record<string, number>): Promise<void> {
    // Criar elemento temporário para renderizar gráfico
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '400px';
    chartContainer.style.height = '300px';
    chartContainer.style.position = 'absolute';
    chartContainer.style.left = '-9999px';
    document.body.appendChild(chartContainer);

    try {
      // Aqui você pode usar Recharts ou criar um gráfico simples com Canvas
      // Por simplicidade, vou criar um gráfico de barras básico
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d')!;

      // Configurar gráfico
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, 400, 300);

      const entries = Object.entries(data);
      const plotWidth = 300; // largura útil para barras
      const barGap = 12; // espaçamento entre barras
      const n = entries.length;
      const barWidth = Math.max(20, (plotWidth - barGap * (n - 1)) / n);
      const maxValue = Math.max(...entries.map(([, value]) => value));

      entries.forEach(([key, value], index) => {
        const barHeight = (value / maxValue) * 200;
        const x = 50 + index * (barWidth + barGap);
        const y = 250 - barHeight;

        // Barra
        ctx.fillStyle = this.theme.primary;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Label
        ctx.fillStyle = this.theme.text;
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        // Nome da métrica abaixo do gráfico
        ctx.fillText(this.formatFieldName(key), x + barWidth/2, 285);
        // Valor percentual acima da barra
        ctx.fillText(`${Math.round(value * 100)}%`, x + barWidth/2, Math.max(y - 8, 20));
      });

      // Converter para base64 e adicionar ao PDF
      const chartBase64 = canvas.toDataURL('image/png');
      this.pdf.addImage(chartBase64, 'PNG', this.margin, this.currentY, 160, 140);
      this.currentY += 150;

    } catch (error) {
      console.warn('Erro ao gerar gráfico:', error);
    } finally {
      document.body.removeChild(chartContainer);
    }
  }

  private async addQRCode(url: string): Promise<void> {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 100,
        margin: 1,
        color: {
          dark: this.theme.text,
          light: this.theme.background
        }
      });

      const qrSize = 30;
      const x = this.pageWidth - this.margin - qrSize;
      const y = this.pageHeight - this.margin - qrSize - 20;

      this.pdf.addImage(qrCodeDataUrl, 'PNG', x, y, qrSize, qrSize);
      
      // Texto explicativo
      this.pdf.setFontSize(this.fontSizes.caption);
      this.pdf.text('Acesse online', x + qrSize/2, y + qrSize + 5, { align: 'center' });
    } catch (error) {
      console.warn('Erro ao gerar QR Code:', error);
    }
  }

  private addSectionTitle(title: string): void {
    this.checkPageBreak(20);
    
    {
      const [r, g, b] = this.hexToRgb(this.theme.primary);
      this.pdf.setFillColor(r, g, b);
    }
    this.pdf.rect(this.margin, this.currentY - 2, this.pageWidth - 2 * this.margin, 12, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(this.fontSizes.heading);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin + 5, this.currentY + 6);
    
    this.currentY += 15;
    {
      const [r, g, b] = this.hexToRgb(this.theme.text);
      this.pdf.setTextColor(r, g, b);
    }
  }

  private addSubsectionTitle(title: string): void {
    this.checkPageBreak(15);
    
    this.pdf.setFontSize(this.fontSizes.subtitle);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += this.spacing.subsection;
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(this.fontSizes.body);
  }

  private addText(text: string, align: 'left' | 'center' | 'right' = 'left'): void {
    this.checkPageBreak(this.spacing.line);
    
    this.pdf.setFontSize(this.fontSizes.body);
    
    let x = this.margin;
    if (align === 'center') x = this.pageWidth / 2;
    if (align === 'right') x = this.pageWidth - this.margin;
    
    this.pdf.text(text, x, this.currentY, { align });
    this.currentY += this.spacing.line;
  }

  private addWrappedText(text: string): void {
    const maxWidth = this.pageWidth - 2 * this.margin;
    const lines = this.pdf.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      this.checkPageBreak(this.spacing.line);
      this.pdf.text(line, this.margin, this.currentY);
      this.currentY += this.spacing.line;
    });
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.addNewPage();
    }
  }

  private addNewPage(): void {
    this.pdf.addPage();
    this.currentY = this.margin;
  }

  private addPageNumbers(): void {
    const totalPages = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      
      // Rodapé
      this.pdf.setFontSize(this.fontSizes.caption);
      this.pdf.setTextColor(128, 128, 128);
      
      const footerY = this.pageHeight - 10;
      this.pdf.text(`Página ${i} de ${totalPages}`, this.pageWidth / 2, footerY, { align: 'center' });
      this.pdf.text('TrichoScalp - Assessoria de Anamnese com IA', this.margin, footerY);
      this.pdf.text(new Date().toLocaleDateString('pt-BR'), this.pageWidth - this.margin, footerY, { align: 'right' });
    }
  }

  private setupPDFMetadata(): void {
    this.pdf.setProperties({
      title: 'Relatório de Avaliação Capilar - TrichoScalp',
      subject: 'Análise tricoscópica com assessoria de IA',
      author: 'TrichoScalp - Sistema de Gestão para Tricologia',
      keywords: 'tricologia, tricoscopia, análise capilar, IA, relatório clínico',
      creator: 'TrichoScalp v1.0.0'
    });
  }

  private async loadImageAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        resolve(canvas.toDataURL('image/jpeg', this.options.qualidadeImagem));
      };
      
      img.onerror = () => reject(new Error(`Falha ao carregar imagem: ${url}`));
      img.src = url;
    });
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^\w/, c => c.toUpperCase())
      .trim();
  }

  private formatPositionName(position: string): string {
    const positionMap: Record<string, string> = {
      frontalEsquerda: 'Frontal Esquerda',
      meioFrontal: 'Frontal Centro',
      frontalDireita: 'Frontal Direita',
      meioEsquerda: 'Meio Esquerda',
      meio: 'Meio Centro',
      meioDireita: 'Meio Direita',
      posteriorEsquerda: 'Posterior Esquerda',
      posteriorMeio: 'Posterior Centro',
      posteriorDireita: 'Posterior Direita'
    };
    
    return positionMap[position] || position;
  }

  private formatObjectValue(obj: any): string {
    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return String(obj);
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  }
}

// ==================== FUNÇÃO PRINCIPAL EXPORTADA ====================

/**
 * Gera um relatório PDF completo de avaliação tricológica
 * @param data Dados do relatório
 * @param options Opções de configuração do PDF
 * @returns Promise<Blob> Arquivo PDF gerado
 */
export async function generateTrichologyPDF(
  data: TrichologyReportData, 
  options?: PDFOptions
): Promise<Blob> {
  const generator = new TrichologyPDFGenerator(options);
  return await generator.generateTrichologyPDF(data);
}

// ==================== UTILITÁRIOS PARA INTEGRAÇÃO COM SUPABASE ====================

/**
 * Faz upload do PDF gerado para o Supabase Storage
 * @param pdfBlob Blob do PDF gerado
 * @param fileName Nome do arquivo
 * @param supabaseClient Cliente do Supabase
 * @returns Promise com URL pública do arquivo
 */
export async function uploadPDFToSupabase(
  pdfBlob: Blob,
  fileName: string,
  supabaseClient: any
): Promise<string> {
  const { data, error } = await supabaseClient.storage
    .from('relatorios')
    .upload(fileName, pdfBlob, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (error) {
    throw new Error(`Erro ao fazer upload do PDF: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseClient.storage
    .from('relatorios')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

/**
 * Gera nome único para o arquivo PDF
 * @param clienteNome Nome do cliente
 * @param data Data da avaliação
 * @returns Nome do arquivo formatado
 */
export function generatePDFFileName(clienteNome: string, data: string): string {
  const clienteSlug = clienteNome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const dateSlug = data.replace(/[^\d]/g, '');
  const timestamp = Date.now();
  
  return `relatorio-${clienteSlug}-${dateSlug}-${timestamp}.pdf`;
}
