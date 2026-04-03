import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';

export const managerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  console.log('Manager guard - token:', token ? 'EXISTS' : 'MISSING');
  console.log('Manager guard - role:', authService.getRole());

  if (authService.getRole() === 'Manager') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
