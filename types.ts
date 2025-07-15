
export type Sector = string;

export enum ReportType {
  Experience = 'EXPERIENCE',
  JobOffer = 'JOB_OFFER',
}

interface BaseReport {
  id: string;
  companyName: string;
  createdAt: Date;
  supportCount: number;
}

export interface ExperienceReport extends BaseReport {
  type: ReportType.Experience;
  title: string;
  description: string;
  sector: Sector;
  isAnonymous: boolean;
  authorName?: string;
  tags: string[];
  unkeptPromises?: string[];
}

export interface JobOfferReport extends BaseReport {
  type: ReportType.JobOffer;
  jobTitle: string;
  description: string; // Why it's being reported
  fileDataUrl?: string; // Base64 encoded file
  fileName?: string;
  linkOrText?: string; // For URL or long text
  ralIndicated?: boolean;
  ralAmount?: number;
}

export type Report = ExperienceReport | JobOfferReport;


export interface AnalysisResult {
  tags: string[];
  summary: string;
}

export type AppView = 
  | "DASHBOARD" 
  | "RESOURCES" 
  | "VIEW_REPORT" 
  | "ADD_REPORT_CHOICE"
  | "ADD_EXPERIENCE_FORM"
  | "ADD_JOB_OFFER_FORM";