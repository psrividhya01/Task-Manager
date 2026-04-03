import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  console.log('Auth guard - token:', token ? 'EXISTS' : 'MISSING');

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
