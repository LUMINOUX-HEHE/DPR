
export enum UserRole {
  ADMIN = 'ADMIN',
  REVIEWER = 'REVIEWER',
  DEPARTMENT = 'DEPARTMENT'
}

export enum ProjectStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
}

export interface DPR {
  id: string;
  title: string;
  type: string;
  location: string;
  budget: number;
  timeline: string;
  status: ProjectStatus;
  riskLevel: RiskLevel;
  submissionDate: string;
  summary?: string;
  aiInsights?: string[];
  complianceScore: number;
}

export interface ValidationReport {
  dprId: string;
  status: 'PASS' | 'FAIL' | 'FLAGGED';
  issues: string[];
  timestamp: string;
}

export type Language = 'EN' | 'HI' | 'AS';

export interface TranslationStrings {
  [key: string]: {
    EN: string;
    HI: string;
    AS: string;
  };
}
