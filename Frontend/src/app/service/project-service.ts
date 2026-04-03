import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateProjectModel, Project } from '../model/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = 'https://localhost:7063/api/projects';

  constructor(private http: HttpClient) {}

  // Get all projects
  getAll() {
    return this.http.get<Project[]>(this.apiUrl);
  }

  // Get single project
  getById(id: number) {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  // Create project
  create(model: CreateProjectModel) {
    return this.http.post(this.apiUrl, model);
  }

  // Update project
  update(id: number, model: CreateProjectModel) {
    return this.http.put(`${this.apiUrl}/${id}`, model);
  }

  // Delete project
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
