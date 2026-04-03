import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../service/project-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.projectService.getAll().subscribe({
      next: (res) => {
        this.projects = [...res];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load projects';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  deleteProject(id: number) {
    if (confirm('Are you sure?')) {
      this.projectService.delete(id).subscribe({
        next: () => {
          this.projects = this.projects.filter((p) => p.id !== id);
          this.cdr.detectChanges();
        },
        error: () => alert('Failed to delete project'),
      });
    }
  }
}
