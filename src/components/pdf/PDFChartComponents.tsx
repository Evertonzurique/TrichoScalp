import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// ==================== INTERFACES ====================

export interface QuantitativeData {
  [key: string]: number;
}

export interface ChartTheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  grid: string;
}

export interface ChartProps {
  data: QuantitativeData;
  theme?: ChartTheme;
  width?: number;
  height?: number;
  title?: string;
}

export interface ComparativeData {
  name: string;
  atual: number;
  anterior: number;
}

// ==================== TEMAS ====================

const defaultTheme: ChartTheme = {
  primary: '#009688',
  secondary: '#1E88E5',
  accent: '#4CAF50',
  text: '#2C3E50',
  background: '#FFFFFF',
  grid: '#E0E0E0'
};

const darkTheme: ChartTheme = {
  primary: '#26A69A',
  secondary: '#42A5F5',
  accent: '#66BB6A',
  text: '#ECEFF1',
  background: '#263238',
  grid: '#455A64'
};

// ==================== COMPONENTES DE GRÁFICOS ====================

/**
 * Gráfico de barras para análise quantitativa
 */
export const QuantitativeBarChart: React.FC<ChartProps> = ({ 
  data, 
  theme = defaultTheme, 
  width = 600, 
  height = 400,
  title = 'Análise Quantitativa'
}) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: formatFieldName(key),
    value: Math.round(value * 100),
    percentage: `${Math.round(value * 100)}%`
  }));

  const colors = [theme.primary, theme.secondary, theme.accent, '#FF6B6B', '#4ECDC4'];

  return (
    <div 
      style={{ 
        width, 
        height, 
        backgroundColor: theme.background,
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <h3 style={{ 
        color: theme.text, 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        {title}
      </h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: theme.text, fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: theme.text, fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Percentual']}
            labelStyle={{ color: theme.text }}
            contentStyle={{ 
              backgroundColor: theme.background, 
              border: `1px solid ${theme.grid}`,
              borderRadius: '4px'
            }}
          />
          <Bar 
            dataKey="value" 
            fill={theme.primary}
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Gráfico de pizza para distribuição de problemas
 */
export const DistributionPieChart: React.FC<ChartProps> = ({ 
  data, 
  theme = defaultTheme, 
  width = 500, 
  height = 400,
  title = 'Distribuição dos Achados'
}) => {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0.1) // Filtrar valores muito baixos
    .map(([key, value]) => ({
      name: formatFieldName(key),
      value: Math.round(value * 100),
      percentage: `${Math.round(value * 100)}%`
    }));

  const colors = [theme.primary, theme.secondary, theme.accent, '#FF6B6B', '#4ECDC4', '#FFD93D'];

  return (
    <div 
      style={{ 
        width, 
        height, 
        backgroundColor: theme.background,
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <h3 style={{ 
        color: theme.text, 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        {title}
      </h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}`}
            outerRadius={120}
            fill={theme.primary}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Percentual']}
            contentStyle={{ 
              backgroundColor: theme.background, 
              border: `1px solid ${theme.grid}`,
              borderRadius: '4px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Gráfico de linha para comparativo temporal
 */
export const ComparativeLineChart: React.FC<{
  data: ComparativeData[];
  theme?: ChartTheme;
  width?: number;
  height?: number;
  title?: string;
}> = ({ 
  data, 
  theme = defaultTheme, 
  width = 600, 
  height = 400,
  title = 'Comparativo de Evolução'
}) => {
  return (
    <div 
      style={{ 
        width, 
        height, 
        backgroundColor: theme.background,
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <h3 style={{ 
        color: theme.text, 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        {title}
      </h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: theme.text, fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: theme.text, fontSize: 12 }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value, name) => [`${value}%`, name === 'atual' ? 'Atual' : 'Anterior']}
            contentStyle={{ 
              backgroundColor: theme.background, 
              border: `1px solid ${theme.grid}`,
              borderRadius: '4px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="anterior" 
            stroke={theme.secondary} 
            strokeWidth={3}
            dot={{ fill: theme.secondary, strokeWidth: 2, r: 6 }}
            name="Anterior"
          />
          <Line 
            type="monotone" 
            dataKey="atual" 
            stroke={theme.primary} 
            strokeWidth={3}
            dot={{ fill: theme.primary, strokeWidth: 2, r: 6 }}
            name="Atual"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Componente de resumo com métricas principais
 */
export const MetricsSummary: React.FC<{
  data: QuantitativeData;
  theme?: ChartTheme;
  width?: number;
  height?: number;
}> = ({ 
  data, 
  theme = defaultTheme, 
  width = 600, 
  height = 200 
}) => {
  const metrics = Object.entries(data).map(([key, value]) => ({
    name: formatFieldName(key),
    value: Math.round(value * 100),
    color: getMetricColor(value, theme)
  }));

  return (
    <div 
      style={{ 
        width, 
        height, 
        backgroundColor: theme.background,
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}
    >
      {metrics.map((metric, index) => (
        <div 
          key={index}
          style={{
            textAlign: 'center',
            minWidth: '120px',
            margin: '10px'
          }}
        >
          <div 
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: metric.color,
              marginBottom: '5px'
            }}
          >
            {metric.value}%
          </div>
          <div 
            style={{
              fontSize: '14px',
              color: theme.text,
              fontWeight: '500'
            }}
          >
            {metric.name}
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================== UTILITÁRIOS ====================

/**
 * Formata nome do campo para exibição
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^\w/, c => c.toUpperCase())
    .trim();
}

/**
 * Determina cor baseada no valor da métrica
 */
function getMetricColor(value: number, theme: ChartTheme): string {
  if (value < 0.3) return theme.accent; // Verde para valores baixos (bom)
  if (value < 0.7) return '#FFD93D'; // Amarelo para valores médios
  return '#FF6B6B'; // Vermelho para valores altos (problemático)
}

/**
 * Hook para capturar componente como imagem
 */
export const useChartCapture = () => {
  const captureChart = async (elementId: string, options?: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  }): Promise<string> => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Elemento com ID ${elementId} não encontrado`);
    }

    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(element, {
      width: options?.width,
      height: options?.height,
      backgroundColor: options?.backgroundColor || '#ffffff',
      scale: 2, // Para melhor qualidade
      useCORS: true,
      allowTaint: true
    });

    return canvas.toDataURL('image/png', 0.9);
  };

  return { captureChart };
};

// ==================== COMPONENTE WRAPPER PARA PDF ====================

/**
 * Wrapper que renderiza gráficos para captura em PDF
 */
export const PDFChartRenderer: React.FC<{
  data: QuantitativeData;
  comparative?: ComparativeData[];
  theme?: 'light' | 'dark';
  onChartsReady?: (charts: { [key: string]: string }) => void;
}> = ({ data, comparative, theme = 'light', onChartsReady }) => {
  const chartTheme = theme === 'dark' ? darkTheme : defaultTheme;
  const { captureChart } = useChartCapture();

  React.useEffect(() => {
    const captureAllCharts = async () => {
      try {
        const charts: { [key: string]: string } = {};
        
        // Capturar gráfico de barras
        charts.barChart = await captureChart('quantitative-bar-chart');
        
        // Capturar gráfico de pizza
        charts.pieChart = await captureChart('distribution-pie-chart');
        
        // Capturar resumo de métricas
        charts.metrics = await captureChart('metrics-summary');
        
        // Capturar gráfico comparativo se disponível
        if (comparative && comparative.length > 0) {
          charts.comparative = await captureChart('comparative-line-chart');
        }
        
        onChartsReady?.(charts);
      } catch (error) {
        console.error('Erro ao capturar gráficos:', error);
      }
    };

    // Aguardar renderização completa
    const timer = setTimeout(captureAllCharts, 1000);
    return () => clearTimeout(timer);
  }, [data, comparative, captureChart, onChartsReady]);

  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
      <div id="quantitative-bar-chart">
        <QuantitativeBarChart data={data} theme={chartTheme} />
      </div>
      
      <div id="distribution-pie-chart">
        <DistributionPieChart data={data} theme={chartTheme} />
      </div>
      
      <div id="metrics-summary">
        <MetricsSummary data={data} theme={chartTheme} />
      </div>
      
      {comparative && comparative.length > 0 && (
        <div id="comparative-line-chart">
          <ComparativeLineChart data={comparative} theme={chartTheme} />
        </div>
      )}
    </div>
  );
};