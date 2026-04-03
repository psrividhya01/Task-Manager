import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../service/task-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class KanbanComponent implements OnInit {
  projectId = 0;
  kanban: any = {
    toDo: [],
    inProgress: [],
    done: [],
  };
  loading = false;
  errorMessage = '';

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadKanban();
  }

  loadKanban() {
    this.loading = true;
    this.taskService.getKanban(this.projectId).subscribe({
      next: (res: any) => {
        this.kanban = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load kanban board';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
