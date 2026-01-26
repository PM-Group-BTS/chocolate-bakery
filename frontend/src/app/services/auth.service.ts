import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { 
  AuthState, 
  User, 
  LoginRequest, 
  LoginResponse, 
  TokenPayload,
  RefreshTokenRequest,
  RefreshTokenResponse 
} from '../models/auth.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';

  private apiService = inject(ApiService);

  // Using Angular signals for reactive state management
  private authStateSignal = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null
  });

  // Public computed signals
  public readonly authState = this.authStateSignal.asReadonly();
  public readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  public readonly currentUser = computed(() => this.authState().user);
  public readonly token = computed(() => this.authState().token);

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuthState(): void {
    const token = this.getStoredToken();
    const refreshToken = this.getStoredRefreshToken();
    const user = this.getStoredUser();

    if (token && user && this.isTokenValid(token)) {
      this.authStateSignal.set({
        isAuthenticated: true,
        user,
        token,
        refreshToken
      });
    } else {
      // Clear invalid/expired tokens
      this.clearStoredAuth();
    }
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.login(credentials).pipe(
      tap((response: LoginResponse) => {
        this.setAuthState(response);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user and clear authentication state
   */
  logout(): Observable<void> {
    return this.apiService.logout().pipe(
      tap(() => {
        this.clearAuthState();
      }),
      catchError((error) => {
        // Even if logout API fails, clear local state
        console.warn('Logout API failed, clearing local state:', error);
        this.clearAuthState();
        return of(void 0);
      })
    );
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.authState().refreshToken;
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.apiService.refreshToken({ refreshToken }).pipe(
      tap((response: RefreshTokenResponse) => {
        const currentState = this.authState();
        this.authStateSignal.set({
          ...currentState,
          token: response.token,
          refreshToken: response.refreshToken || currentState.refreshToken
        });
        
        // Update stored token
        this.storeToken(response.token);
        if (response.refreshToken) {
          this.storeRefreshToken(response.refreshToken);
        }
      }),
      catchError((error) => {
        console.error('Token refresh failed:', error);
        this.clearAuthState();
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.roles?.includes(role) ?? false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Set authentication state after successful login
   */
  private setAuthState(loginResponse: LoginResponse): void {
    const { user, token, refreshToken } = loginResponse;
    
    this.authStateSignal.set({
      isAuthenticated: true,
      user,
      token,
      refreshToken: refreshToken || null
    });

    // Store in localStorage
    this.storeToken(token);
    this.storeUser(user);
    if (refreshToken) {
      this.storeRefreshToken(refreshToken);
    }
  }

  /**
   * Clear authentication state
   */
  private clearAuthState(): void {
    this.authStateSignal.set({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null
    });

    this.clearStoredAuth();
  }

  /**
   * Check if token is valid (not expired)
   */
  private isTokenValid(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  /**
   * Decode JWT token payload
   */
  private decodeToken(token: string): TokenPayload {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  // Storage methods
  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private storeRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
