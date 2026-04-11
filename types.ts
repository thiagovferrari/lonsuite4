// Lon Suite — Type Definitions

export enum ViewState {
  HOME = 'HOME',
  ATIVOS = 'ATIVOS',
  CASES = 'CASES',
  TRASH = 'TRASH',
  SETTINGS = 'SETTINGS',
}

export type AssetType = 'image' | 'pdf' | 'video' | 'document' | 'case';
export type EvidenceLevel = 'Alto' | 'Moderado' | 'Baixo';
export type CaseStatus = 'em_andamento' | 'completo' | 'arquivado';
export type CaseVisibility = 'private' | 'shared' | 'public';
export type CaseBlockType = 'text' | 'image' | 'title' | 'subtitle' | 'reference' | 'asset';

export interface CaseBlock {
  id: string;
  type: CaseBlockType;
  content: string;
  /** Reference to an Asset when type === 'asset' */
  assetId?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  /** Public URL (Supabase Storage) or data URL fallback */
  data?: string;
  size: number;
}

export interface Asset {
  id: string;
  title: string;
  type: AssetType;
  tags: string[];
  date: string;

  // Media / content
  thumbnail?: string;
  content?: string;
  description?: string;
  attachments?: Attachment[];

  // Scientific metadata
  summary?: string;
  scientificContext?: string;
  evidenceLevel?: EvidenceLevel;
  publicationYear?: string;
  keyFindings?: string;

  // Case-specific
  blocks?: CaseBlock[];
  caseStatus?: CaseStatus;
  visibility?: CaseVisibility;
  ownerId?: string;
  ownerName?: string;
  accessCount?: number;
  sharedWith?: string[];

  // Timestamps & lifecycle
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}
