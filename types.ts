// Lon Suite - Type Definitions

export enum ViewState {
  HOME = 'HOME',
  ATIVOS = 'ATIVOS',
  CASES = 'CASES',
  TRASH = 'TRASH',
  SETTINGS = 'SETTINGS'
}

export type AssetType = 'image' | 'pdf' | 'video' | 'document' | 'case';
export type EvidenceLevel = 'Alto' | 'Moderado' | 'Baixo';

export interface CaseBlock {
  id: string;
  type: 'text' | 'image' | 'title' | 'subtitle' | 'reference' | 'asset';
  content: string;
  assetId?: string;  // referência ao ativo quando type === 'asset'
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  data?: string; // Opcional agora, pois pode estar no IndexedDB
  size: number;
}

export type CaseStatus = 'em_andamento' | 'completo' | 'arquivado';
export type CaseVisibility = 'private' | 'shared' | 'public';
export type DemandPriority = 'alta' | 'media' | 'baixa';

export interface Asset {
  id: string;
  title: string;
  type: AssetType;
  tags: string[];
  date: string;
  thumbnail?: string;
  summary?: string;
  scientificContext?: string;
  blocks?: CaseBlock[];
  attachments?: Attachment[];
  evidenceLevel?: EvidenceLevel;
  publicationYear?: string;
  keyFindings?: string;
  content?: string;
  description?: string;
  caseStatus?: CaseStatus;
  visibility?: CaseVisibility;
  ownerId?: string;
  ownerName?: string;
  accessCount?: number;
  sharedWith?: string[];
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export const MOCK_ASSETS: Asset[] = [];

// Additional types for Notes/Folders functionality
export interface Nota {
  id: string;
  title: string;
  content: string;
  pastaId?: string;
  linkedAssetIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Pasta {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export type UploadIntention = 'caso_clinico' | 'artigo_pdf' | 'imagem_unica';

export interface ProjectLink {
  id: string;
  title: string;
  url: string;
}

export interface ProjectScheduleItem {
  id: string;
  date: string;
  type: 'Post' | 'Story' | 'Reel' | 'Outro';
  title: string;
  description: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
}

export interface ProjectDesignSystem {
  colors: string[];
  typography: string;
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  date: string;
  links: ProjectLink[];
  attachments: Attachment[];
  schedule: ProjectScheduleItem[];
  designSystem: ProjectDesignSystem;
  autoSummarizeDemands?: boolean;
  demandsSummary?: string;
  scheduleFileData?: string; // base64 do xlsx
  scheduleFileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Demand {
  id: string;
  intentProjectTitle: string;
  description: string;
  dueDate: string;
  status: 'Pendente' | 'Concluído';
  priority?: DemandPriority;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}
