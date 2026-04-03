import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../service/project-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProjectComponent {
  name = '';
  description = '';
  errorMessage = '';
  loading = false;

  constructor(
    private projectService: ProjectService,
    private router: Router,
  ) {}

  create() {
    this.loading = true;
    this.errorMessage = '';

    this.projectService
      .create({
        name: this.name,
        description: this.description,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/manager/projects']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Failed to create project. Try again.';
        },
      });
  }
}
