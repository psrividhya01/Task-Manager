import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateCommentModel, Comment } from '../model/comment.model';
import { Task, UpdateStatusModel } from '../model/task.model';

@Injectable({
  providedIn: 'root',
})
export class DeveloperService {
  private apiUrl = 'https://localhost:7063/api/developer';

  constructor(private http: HttpClient) {}

  // Get my tasks
  getMyTasks() {
    return this.http.get<Task[]>(`${this.apiUrl}/mytasks`);
  }

  // Get task by id with comments
  getTaskById(id: number) {
    return this.http.get(`${this.apiUrl}/mytasks/${id}`);
  }

  // Update task status
  updateStatus(id: number, model: UpdateStatusModel) {
    return this.http.patch(`${this.apiUrl}/mytasks/${id}/status`, model);
  }

  // Add comment
  addComment(taskId: number, model: CreateCommentModel) {
    return this.http.post(`${this.apiUrl}/mytasks/${taskId}/comments`, model);
  }

  // Get comments
  getComments(taskId: number) {
    return this.http.get<Comment[]>(`${this.apiUrl}/mytasks/${taskId}/comments`);
  }
}
