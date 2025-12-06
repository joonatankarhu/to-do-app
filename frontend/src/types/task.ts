export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'TODO' | 'DOING' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  deadline: string | null;
  owner: number;
  created_at: string;
  updated_at: string;
}

