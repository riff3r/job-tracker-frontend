export type ApplicationStatus =
  | 'WISHLIST'
  | 'APPLIED'
  | 'PHONE_SCREEN'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'WISHLIST',
  'APPLIED',
  'PHONE_SCREEN',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
];

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  WISHLIST:     '#94A3B8',
  APPLIED:      '#3B82F6',
  PHONE_SCREEN: '#EAB308',
  INTERVIEW:    '#A855F7',
  OFFER:        '#22C55E',
  REJECTED:     '#EF4444',
  WITHDRAWN:    '#9CA3AF',
};

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: 'Wishlist',
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Phone Screen',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  company: string;
  role: string;
  jobUrl: string | null;
  location: LocationType | null;
  salary: string | null;
  notes: string | null;
  status: ApplicationStatus;
  appliedAt: string | null;
  followUpDate: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  activityLogs?: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  applicationId: string;
  userId: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  label: string;
  filePath: string;
  fileType: 'PDF' | 'DOCX';
  version: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
  user: User;
}

export type LocationType = 'ONSITE' | 'REMOTE' | 'HYBRID';

export interface CreateApplicationInput {
  company: string;
  role: string;
  jobUrl?: string;
  location?: LocationType;
  salary?: string;
  notes?: string;
  status: ApplicationStatus;
  appliedAt?: string;
  followUpDate?: string;
}

export interface UpdateApplicationInput extends Partial<CreateApplicationInput> {}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  thisWeek: number;
  perWeek: Array<{ week: string; count: number }>;
}

export interface ActivityLogWithApplication {
  id: string;
  applicationId: string;
  userId: string;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  changedAt: string;
  application: {
    id: string;
    company: string;
    role: string;
  };
}
