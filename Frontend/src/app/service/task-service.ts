import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateTaskModel, Task } from '../model/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'https://localhost:7063/api/tasks';

  constructor(private http: HttpClient) {}

  // Get all tasks
  getAll() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Get tasks by project
  getByProject(projectId: number) {
    return this.http.get<Task[]>(`${this.apiUrl}/project/${projectId}`);
  }

  // Get kanban board
  getKanban(projectId: number) {
    return this.http.get(`${this.apiUrl}/kanban/${projectId}`);
  }

  // Create task
  create(model: CreateTaskModel) {
    return this.http.post(this.apiUrl, model);
  }

  // Update task
  update(id: number, model: any) {
    return this.http.put(`${this.apiUrl}/${id}`, model);
  }

  // Delete task
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Get all developers
  getDevelopers() {
    return this.http.get<any[]>(`${this.apiUrl}/developers`);
  }

  // Get comments of task
  getComments(taskId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${taskId}/comments`);
  }
}
