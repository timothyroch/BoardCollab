export interface Task {
  id: string;
  title: string;
  tenantId: string;
  creatorId: string;
  creator?: { email: string };
  assignees?: { email: string }[];
  dueDate?: string;
  status?: 'to_do' | 'in_progress' | 'done';
}