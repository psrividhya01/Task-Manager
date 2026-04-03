import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  console.log('=== INTERCEPTOR RUNNING ===');
  console.log('Token found:', token ? 'YES' : 'NO');
  console.log('Request URL:', req.url);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Token attached to request ✅');
  }

  return next(req);
};
