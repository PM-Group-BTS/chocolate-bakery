

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecoverPasswordComponent } from './recover-password';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule, RecoverPasswordComponent]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  loginInProgress: boolean = false;
  showRecover: boolean = false;

  constructor(private apiService: ApiService) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loginInProgress = true;
    this.apiService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        if (res && res.status === 'success') {
          this.successMessage = 'Login successful!';
          // Optionally, store token and redirect
          localStorage.setItem('token', res.data.token);
        } else {
          this.errorMessage = res?.message || 'Login failed.';
        }
        this.loginInProgress = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Login failed.';
        this.loginInProgress = false;
      }
    });
  }

  toggleRecover() {
    this.showRecover = !this.showRecover;
  }

  onRecoveryRequested(event: {username: string, email: string}) {
    // Optionally handle recovery event here
  }
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post('/api/auth/login', { username, password });
  }
}
