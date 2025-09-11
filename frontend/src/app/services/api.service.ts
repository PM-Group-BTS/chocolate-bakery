import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse 
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get welcome message from API
  getWelcomeMessage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  // Test API connection
  testApiConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test`);
  }

  // Authentication endpoints
  
  /**
   * Login user with email and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  /**
   * Logout current user
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {});
  }

  /**
   * Refresh authentication token
   */
  refreshToken(request: RefreshTokenRequest): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(`${this.apiUrl}/auth/refresh-token`, request);
  }

  /**
   * Register new user
   */
  register(userData: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, userData);
  }

  /**
   * Get current user profile
   */
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`);
  }

  /**
   * Update user profile
   */
  updateUserProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/profile`, profileData);
  }

  /**
   * Request password reset
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword });
  }
}
