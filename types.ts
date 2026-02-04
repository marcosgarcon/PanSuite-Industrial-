
export enum UserProfile {
  OPERATOR = 'OPERATOR',
  TECHNICIAN = 'TECHNICIAN',
  QUALITY = 'QUALITY',
  ENGINEERING = 'ENGINEERING',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export enum BusinessUnit {
  WM = 'Washing Machine',
  QA = 'Quality Assurance',
  RF = 'Refrigeration',
  MA = 'Manufacturing',
  EN = 'Engineering'
}

export enum BusinessArea {
  PLM = 'Product Lifecycle Management',
  QMS = 'Quality Management System',
  MES = 'Manufacturing Execution System',
  BI = 'Business Intelligence',
  SIM = 'Simulation & Digital Twin',
  RND = 'Research & Development'
}

export enum ToolCategory {
  PRODUCTION = 'Production',
  QUALITY = 'Quality',
  ENGINEERING = 'Engineering',
  BI = 'Business Intelligence',
  DESIGN = 'Industrial Design',
  ANALYTICS = 'Advanced Analytics'
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
  unit: BusinessUnit;
  active: boolean;
  lastLogin: string;
}

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  area: BusinessArea;
  businessUnits: BusinessUnit[];
  allowedProfiles: UserProfile[];
  icon: string;
  description: string;
  external?: boolean;
}

export interface SpreadsheetData {
  headers: string[];
  rows: any[][];
}

export interface DrawingData {
  partCode: string;
  modelName: string;
  nominal: number;
  usl: number;
  lsl: number;
  revision: string;
}
