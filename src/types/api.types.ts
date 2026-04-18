export enum ProjectStatus {
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  status: ProjectStatus;
  tags?: string[];
  siteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  title: string;
  description?: string;
  status?: ProjectStatus;
  tags?: string[];
  siteUrl?: string;
}

export interface Price {
  id: string;
  title: string;
  description: string;
  priceFrom: number;
  durationDays: number;
  features: string[];
  isPopular?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePriceDto {
  title: string;
  description: string;
  priceFrom: number;
  durationDays: number;
  features: string[];
  isPopular?: boolean;
}

export type UpdatePriceDto = Partial<CreatePriceDto>;
