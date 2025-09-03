import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  registerInProgress: boolean = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.registerInProgress = true;
    this.http.post('/api/auth/register', {
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        if (res && res.status === 'success') {
          this.successMessage = 'Registration successful!';
          this.confirmPassword = '';
        } else {
          this.errorMessage = res?.message || 'Registration failed.';
        }
        this.registerInProgress = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Registration failed.';
        this.registerInProgress = false;
      }
    });
  }
}
