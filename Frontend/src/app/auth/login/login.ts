import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { form } from '@angular/forms/signals';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        const role = this.authService.getRole();

        if (role === 'Manager') {
          this.router.navigate(['/manager/dashboard']);
        } else if (role === 'Developer') {
          this.router.navigate(['/developer/my-tasks']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error || 'Login failed. Try again.';
      },
    });
  }
}
