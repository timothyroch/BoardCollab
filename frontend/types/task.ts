export interface Task {
  id: string;
  title: string;
  tenantId: string;
  creatorId: string;
  creator?: { 
    id?: string;
    email: string };
  assignees?: { email: string }[];
  dueDate?: string;
  status?: 'to_do' | 'in_progress' | 'done';
    issues?: {
    id: string;
    github_repo: string;
    github_issue_number: number;
    github_issue_title: string;
  }[];
}