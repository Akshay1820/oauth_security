import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Integration {

  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    console.log("API ", this.API_URL);

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
    const token = this.getToken();
    if (!token) return false;
    try {
      // Decode the payload part of the JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp; // Expiration time in Unix seconds

      // Return true if current time is less than expiration time
      return (Math.floor(Date.now() / 1000)) < expiry;
    } catch (e) {
      // If decoding fails, the token is invalid
      return false;
    }
  }

  loginWithGithub() {
    // This triggers Spring Boot's Github OAuth2 flow
    console.log(this.API_URL)
    window.location.href = `${this.API_URL}/oauth2/authorization/github`;
  }

  loginWithGoogle() {
    // This triggers Spring Boot's Google OAuth2 flow
    console.log(this.API_URL)
    window.location.href = `${this.API_URL}/oauth2/authorization/google`;
  }
}