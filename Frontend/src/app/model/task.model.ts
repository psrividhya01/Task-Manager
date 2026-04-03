export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  projectId: number;
  assignedToUserId: string;
  projectName?: string;
}

export interface CreateTaskModel {
  title: string;
  description: string;
  projectId: number;
  assignedToUserId: string;
}

export interface UpdateStatusModel {
  status: string;
}
