
import { Tool, BusinessUnit, UserProfile, ToolCategory, BusinessArea, SpreadsheetData } from './types';

export const PANASONIC_BLUE = '#004098';
export const PANASONIC_RED = '#E11D48';

export const TOOLS_REGISTRY: Tool[] = [
  {
    id: 'cep-stats',
    name: 'CEP - Controle Estatístico',
    category: ToolCategory.QUALITY,
    area: BusinessArea.QMS,
    businessUnits: [BusinessUnit.WM, BusinessUnit.RF, BusinessUnit.QA],
    allowedProfiles: [UserProfile.OPERATOR, UserProfile.QUALITY, UserProfile.ENGINEERING, UserProfile.MANAGER],
    icon: 'fa-chart-line',
    description: 'Monitoramento em tempo real e análise de capabilidade (Cp/Cpk).'
  },
  {
    id: 'industrial-bi',
    name: 'Industrial BI Dashboard',
    category: ToolCategory.BI,
    area: BusinessArea.BI,
    businessUnits: [BusinessUnit.WM, BusinessUnit.RF, BusinessUnit.MA],
    allowedProfiles: [UserProfile.MANAGER, UserProfile.ADMIN, UserProfile.ENGINEERING],
    icon: 'fa-gauge-high',
    description: 'Indicadores globais, monitoramento de OEE e Gestão à Vista.'
  },
  {
    id: 'fmea-dashboard',
    name: 'Análise de FMEA',
    category: ToolCategory.QUALITY,
    area: BusinessArea.QMS,
    businessUnits: [BusinessUnit.EN, BusinessUnit.QA],
    allowedProfiles: [UserProfile.ENGINEERING, UserProfile.QUALITY, UserProfile.ADMIN],
    icon: 'fa-triangle-exclamation',
    description: 'Análise de Modos de Falha e Efeitos com cálculo de RPN.'
  },
  {
    id: 'pareto-dashboard',
    name: 'Diagrama de Pareto',
    category: ToolCategory.QUALITY,
    area: BusinessArea.QMS,
    businessUnits: [BusinessUnit.QA, BusinessUnit.MA],
    allowedProfiles: [UserProfile.QUALITY, UserProfile.MANAGER, UserProfile.ADMIN],
    icon: 'fa-chart-bar',
    description: 'Priorização de falhas 80/20 com cálculo cumulativo.'
  },
  {
    id: 'swot-dashboard',
    name: 'Análise SWOT',
    category: ToolCategory.ANALYTICS,
    area: BusinessArea.BI,
    businessUnits: [BusinessUnit.EN, BusinessUnit.MA],
    allowedProfiles: [UserProfile.MANAGER, UserProfile.ENGINEERING, UserProfile.ADMIN],
    icon: 'fa-square-poll-vertical',
    description: 'Matriz estratégica para análise de ambiente interno e externo.'
  },
  {
    id: '5s-dashboard',
    name: 'Metodologia 5S',
    category: ToolCategory.PRODUCTION,
    area: BusinessArea.MES,
    businessUnits: [BusinessUnit.MA, BusinessUnit.WM, BusinessUnit.RF],
    allowedProfiles: [UserProfile.OPERATOR, UserProfile.TECHNICIAN, UserProfile.QUALITY, UserProfile.ADMIN],
    icon: 'fa-broom',
    description: 'Checklist operacional de organização e limpeza industrial.'
  }
];

export const TOOL_TEMPLATES: Record<string, SpreadsheetData> = {
  'fmea-dashboard': {
    headers: ['Processo/Item', 'Modo de Falha', 'Efeito', 'Severidade (S)', 'Ocorrência (O)', 'Detecção (D)', 'RPN', 'Ação Corretiva'],
    rows: [
      ['Injeção Plástica', 'Rebarba excessiva', 'Refugo de peça', 7, 4, 3, 0, 'Ajustar pressão molde'],
      ['Estamparia', 'Trinca em dobra', 'Comprometimento estrutural', 9, 2, 2, 0, 'Revisar lubrificação'],
    ]
  },
  'pareto-dashboard': {
    headers: ['Tipo de Defeito', 'Frequência', 'Cumulativo %'],
    rows: [
      ['Riscos superficiais', 120, 0],
      ['Dimensional fora', 45, 0],
      ['Manchas de pintura', 12, 0],
      ['Outros', 5, 0]
    ]
  },
  'swot-dashboard': {
    headers: ['Categoria', 'Descrição', 'Impacto'],
    rows: [
      ['Força', 'Tecnologia Japonesa proprietária', 'Alto'],
      ['Fraqueza', 'Tempo de setup elevado', 'Médio'],
      ['Oportunidade', 'Expansão linha branca regional', 'Alto'],
      ['Ameaça', 'Variação custo matéria-prima', 'Médio']
    ]
  },
  '5s-dashboard': {
    headers: ['Senso', 'Descrição da Auditoria', 'Status', 'Nota (1-5)'],
    rows: [
      ['Seiri (Seleção)', 'Apenas ferramentas necessárias no posto?', 'Em Conformidade', 5],
      ['Seiton (Ordenação)', 'Layout segue o padrão FIT visual?', 'Parcial', 3],
      ['Seiso (Limpeza)', 'Piso e bancada isentos de óleo/poeira?', 'Não Conforme', 1],
    ]
  }
};
