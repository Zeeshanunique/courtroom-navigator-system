// Define Firestore data types for the application

export type CasePriority = 'Low' | 'Medium' | 'High';
export type CaseStatus = 'Pending' | 'In Progress' | 'Adjourned' | 'Closed';
export type CaseType = 'Civil' | 'Criminal' | 'Family' | 'Administrative';
export type DocumentCategory = 'Pleading' | 'Evidence' | 'Motion' | 'Verdict' | 'Report' | 'Agreement' | 'Other';
export type HearingStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Adjourned';
export type UserRole = 'Judge' | 'Lawyer' | 'Clerk' | 'Public';

// Base interface for Firestore documents
export interface FirestoreDocument {
  id: string;
}

// Case document
export interface Case extends FirestoreDocument {
  case_number: string | null;
  created_at: string;
  defendant: string | null;
  description: string | null;
  filed_by: string;
  judge_id: string | null;
  plaintiff: string | null;
  priority: CasePriority;
  status: CaseStatus;
  title: string;
  type: CaseType;
  updated_at: string;
}

// Decision document
export interface Decision extends FirestoreDocument {
  case_id: string;
  content: string;
  created_at: string;
  decided_by: string;
  document_id: string | null;
  title: string;
}

// Document record
export interface Document extends FirestoreDocument {
  case_id: string;
  category: DocumentCategory;
  created_at: string;
  description: string | null;
  file_path: string;
  file_size: string;
  file_type: string;
  name: string;
  uploaded_by: string;
}

// Hearing participant
export interface HearingParticipant extends FirestoreDocument {
  hearing_id: string;
  is_required: boolean | null;
  notification_sent: boolean | null;
  role: string;
  user_id: string;
}

// Hearing
export interface Hearing extends FirestoreDocument {
  case_id: string;
  created_at: string;
  created_by: string;
  description: string | null;
  duration_minutes: number;
  location: string | null;
  notes: string | null;
  scheduled_date: string;
  status: HearingStatus | null;
  title: string;
  updated_at: string;
  virtual_link: string | null;
}

// Notification
export interface Notification extends FirestoreDocument {
  content: string;
  created_at: string;
  is_read: boolean | null;
  related_case_id: string | null;
  related_hearing_id: string | null;
  title: string;
  user_id: string;
}

// User profile
export interface Profile extends FirestoreDocument {
  created_at: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  updated_at: string | null;
}

// Constants for enums - useful for form selects, etc.
export const CONSTANTS = {
  CASE_PRIORITIES: ['Low', 'Medium', 'High'] as CasePriority[],
  CASE_STATUSES: ['Pending', 'In Progress', 'Adjourned', 'Closed'] as CaseStatus[],
  CASE_TYPES: ['Civil', 'Criminal', 'Family', 'Administrative'] as CaseType[],
  DOCUMENT_CATEGORIES: [
    'Pleading',
    'Evidence',
    'Motion',
    'Verdict',
    'Report',
    'Agreement',
    'Other'
  ] as DocumentCategory[],
  HEARING_STATUSES: ['Scheduled', 'Completed', 'Cancelled', 'Adjourned'] as HearingStatus[],
  USER_ROLES: ['Judge', 'Lawyer', 'Clerk', 'Public'] as UserRole[]
};