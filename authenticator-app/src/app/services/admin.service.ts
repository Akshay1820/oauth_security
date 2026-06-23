import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppUser } from '../models/app-user';
import { DashboardStats } from '../models/dashboard-stats';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/api/admin/dashboard`);
  }

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.API_URL}/api/admin/users`);
  }

  getUserById(id: number): Observable<AppUser> {
    return this.http.get<AppUser>(`${this.API_URL}/api/admin/users/${id}`);
  }

  changeUserRole(id: number, role: string): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.API_URL}/api/admin/users/${id}/role`, { role });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/api/admin/users/${id}`);
  }
}
