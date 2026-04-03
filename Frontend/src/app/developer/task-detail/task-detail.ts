import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DeveloperService } from '../../service/developer-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetailComponent implements OnInit {
  taskId = 0;
  task: any = null;
  comments: any[] = [];
  newComment = '';
  selectedStatus = '';
  loading = false;
  commentLoading = false;
  statusLoading = false;
  errorMessage = '';
  successMessage = '';

  statusOptions = ['To Do', 'In Progress', 'Done'];

  constructor(
    private developerService: DeveloperService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTask();
  }

  loadTask() {
    this.loading = true;
    this.developerService.getTaskById(this.taskId).subscribe({
      next: (res: any) => {
        this.task = res;
        this.comments = res.comments || [];
        this.selectedStatus = res.status;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load task';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateStatus() {
    this.statusLoading = true;
    this.developerService
      .updateStatus(this.taskId, {
        status: this.selectedStatus,
      })
      .subscribe({
        next: () => {
          this.statusLoading = false;
          this.successMessage = 'Status updated successfully!';
          this.task.status = this.selectedStatus;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: () => {
          this.statusLoading = false;
          this.errorMessage = 'Failed to update status';
          this.cdr.detectChanges();
        },
      });
  }

  addComment() {
    if (!this.newComment.trim()) return;

    this.commentLoading = true;
    this.developerService
      .addComment(this.taskId, {
        content: this.newComment,
      })
      .subscribe({
        next: () => {
          this.commentLoading = false;
          this.newComment = '';
          this.loadTask();
        },
        error: () => {
          this.commentLoading = false;
          this.errorMessage = 'Failed to add comment';
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
}
