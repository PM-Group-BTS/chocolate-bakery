import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
}

