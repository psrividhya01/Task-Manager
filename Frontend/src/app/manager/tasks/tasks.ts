import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../service/task-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.taskService.getAll().subscribe({
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

  deleteTask(id: number) {
    if (confirm('Are you sure?')) {
      this.taskService.delete(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter((t) => t.id !== id);
          this.cdr.detectChanges();
        },
        error: () => alert('Failed to delete task'),
      });
    }
  }

  getStatusClass(status: string): string {
    if (status === 'To Do') return 'status-todo';
    if (status === 'In Progress') return 'status-progress';
    if (status === 'Done') return 'status-done';
    return '';
  }
}
