export interface Project {
  id: number;
  name: string;
  description: string;
  createdByUserId: string;
  tasks?: any[];
}

export interface CreateProjectModel {
  name: string;
  description: string;
}
