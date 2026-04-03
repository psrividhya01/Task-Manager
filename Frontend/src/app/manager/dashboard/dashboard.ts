import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { ProjectService } from '../../service/project-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  projects: any[] = [];
  totalTasks = 0;
  loading = true;

  constructor(
    private authService: AuthService,
    private projectService: ProjectService,
    private router: Router,
    private cdr: ChangeDetectorRef, // ✅ add this
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;

    this.projectService.getAll().subscribe({
      next: (res: any[]) => {
        this.projects = [...res];
        this.totalTasks = this.projects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0);
        this.loading = false;
        this.cdr.detectChanges(); // ✅ force UI update
        console.log('Projects loaded:', this.projects.length);
      },
      error: (err) => {
        console.log('Error:', err);
        this.loading = false;
        this.cdr.detectChanges(); // ✅ force UI update
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
