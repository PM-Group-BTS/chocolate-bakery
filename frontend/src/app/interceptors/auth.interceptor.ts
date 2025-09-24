import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor that adds Authorization header to outgoing requests
 * when user is authenticated. Uses Angular 20's functional interceptor approach.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);
  
  // Get current authentication state
  const isAuthenticated = authService.isAuthenticated();
  const token = authService.token();

  // Skip authentication for certain endpoints
  if (shouldSkipAuth(req)) {
    return next(req);
  }

  // If user is authenticated and has a token, add Authorization header
  if (isAuthenticated && token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq).pipe(
      catchError((error) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          return handleUnauthorizedError(authService, req, next, error);
        }
        
        // Handle 403 Forbidden errors
        if (error.status === 403) {
          console.warn('Access forbidden:', error);
          // Could redirect to access denied page or show notification
        }

        return throwError(() => error);
      })
    );
  }

  // If not authenticated, proceed without Authorization header
  return next(req);
};

/**
 * Determine if authentication should be skipped for this request
 */
function shouldSkipAuth(req: HttpRequest<unknown>): boolean {
  const skipAuthUrls = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh-token',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/public'
  ];

  return skipAuthUrls.some(url => req.url.includes(url));
}

/**
 * Handle 401 Unauthorized errors by attempting token refresh
 */
function handleUnauthorizedError(
  authService: AuthService,
  originalReq: HttpRequest<unknown>,
  next: HttpHandlerFn,
  error: any
): Observable<any> {
  // If this is already a refresh token request, don't retry
  if (originalReq.url.includes('/auth/refresh-token')) {
    console.error('Refresh token failed, logging out user');
    authService.logout().subscribe();
    return throwError(() => error);
  }

  // Attempt to refresh the token
  return authService.refreshToken().pipe(
    switchMap(() => {
      // Retry the original request with the new token
      const newToken = authService.token();
      if (newToken) {
        const retryReq = originalReq.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next(retryReq);
      }
      
      // If no new token, logout and throw error
      authService.logout().subscribe();
      return throwError(() => error);
    }),
    catchError((refreshError) => {
      // If refresh fails, logout user and throw original error
      console.error('Token refresh failed:', refreshError);
      authService.logout().subscribe();
      return throwError(() => error);
    })
  );
}
