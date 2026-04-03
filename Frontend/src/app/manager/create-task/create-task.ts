import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../service/task-service';
import { ProjectService } from '../../service/project-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTaskComponent implements OnInit {
  title = '';
  description = '';
  projectId = 0;
  assignedToUserId = '';
  projects: any[] = [];
  developers: any[] = [];
  errorMessage = '';
  loading = false;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.loadDevelopers();
  }

  loadProjects() {
    this.projectService.getAll().subscribe({
      next: (res) => {
        this.projects = [...res];
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load projects';
        this.cdr.detectChanges();
      },
    });
  }

  loadDevelopers() {
    this.taskService.getDevelopers().subscribe({
      next: (res) => {
        this.developers = [...res];
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load developers';
        this.cdr.detectChanges();
      },
    });
  }

  create() {
    if (!this.title || !this.description || !this.projectId || !this.assignedToUserId) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.taskService
      .create({
        title: this.title,
        description: this.description,
        projectId: this.projectId,
        assignedToUserId: this.assignedToUserId,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/manager/tasks']);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Failed to create task. Try again.';
          this.cdr.detectChanges();
        },
      });
  }
}
