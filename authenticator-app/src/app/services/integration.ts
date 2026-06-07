import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Integration {

  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.API_URL}/login`, { username, password })
      .pipe(
        tap((res: any) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', res.token);
            localStorage.setItem('username', username);
          }
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  loginWithGithub() {
    // This triggers Spring Boot's OAuth2 flow
    window.location.href = 'http://localhost:8080/oauth2/authorization/github';
  }
}