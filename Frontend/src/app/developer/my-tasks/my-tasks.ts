import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DeveloperService } from '../../service/developer-service';
import { AuthService } from '../../service/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-tasks.html',
  styleUrl: './my-tasks.css',
})
export class MyTasksComponent implements OnInit {
  tasks: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private developerService: DeveloperService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.developerService.getMyTasks().subscribe({
      next: (res) => {
        this.tasks = [...res];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load tasks';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getStatusClass(status: string): string {
    if (status === 'To Do') return 'status-todo';
    if (status === 'In Progress') return 'status-progress';
    if (status === 'Done') return 'status-done';
    return '';
  }

  logout() {
    this.authService.logout();
  }
}
