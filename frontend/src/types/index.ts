export type Role = 'STUDENT' | 'COORDINATOR' | 'ADMIN';

export type ClubCategory =
  | 'NSS_COMMUNITY'
  | 'ENVIRONMENT_ECO'
  | 'HEALTH_WELFARE'
  | 'TECH_SOCIAL';

export type AttendanceStatus = 'REGISTERED' | 'PRESENT' | 'ABSENT';

export interface User {
  id: number;
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  email: string;
  role: Role;
  totalVerifiedHours: number;
  createdAt?: string;
}

export interface ClubOrUnit {
  id: number;
  name: string;
  unitCode: string;
  category: ClubCategory;
  facultyAdvisor: string;
  coordinator?: User;
}

export interface ActivityEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  durationHours: number;
  location: string;
  maxParticipants: number;
  registeredCount: number;
  club: ClubOrUnit;
  createdAt?: string;
}

export interface AttendanceLog {
  id: number;
  student: User;
  event: ActivityEvent;
  status: AttendanceStatus;
  hoursAwarded: number;
  registeredAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  certificateHash?: string;
}

export interface StudentDashboardDTO {
  user: User;
  totalVerifiedHours: number;
  milestoneTier: string;
  milestoneStage: number;
  hoursToNextMilestone: number;
  certificateEligible: boolean;
  recentLogs: AttendanceLog[];
  contributingClubs: string[];
}

export interface RankedStudent {
  rank: number;
  id: number;
  name: string;
  rollNumber: string;
  department: string;
  semester: number;
  totalVerifiedHours: number;
  tierBadge: string;
  verifiedEventsCount: number;
}

export interface LeaderboardDTO {
  students: RankedStudent[];
  departmentTotals: Record<string, number>;
  filteredDepartment: string;
}
