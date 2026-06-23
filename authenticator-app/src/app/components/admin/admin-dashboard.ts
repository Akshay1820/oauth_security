import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Integration } from '../../services/integration';
import { AdminService } from '../../services/admin.service';
import { AppUser } from '../../models/app-user';
import { DashboardStats } from '../../models/dashboard-stats';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  protected readonly username = signal<string>('Admin');
  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly users = signal<AppUser[]>([]);
  protected readonly loading = signal<boolean>(true);
  protected readonly actionLoading = signal<number | null>(null);
  protected readonly deleteConfirmId = signal<number | null>(null);

  constructor(
    private integration: Integration,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUsername = this.integration.getUsername();
    if (storedUsername) {
      this.username.set(storedUsername);
    }
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);

    this.adminService.getDashboardStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: (err) => console.error('Failed to load stats', err),
    });

    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.loading.set(false);
      },
    });
  }

  toggleRole(user: AppUser): void {
    const newRole = user.accountType === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    this.actionLoading.set(user.id);

    this.adminService.changeUserRole(user.id, newRole).subscribe({
      next: (updatedUser) => {
        this.users.update((users) =>
          users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
        this.actionLoading.set(null);
        // Refresh stats after role change
        this.adminService.getDashboardStats().subscribe({
          next: (stats) => this.stats.set(stats),
        });
      },
      error: (err) => {
        console.error('Failed to change role', err);
        this.actionLoading.set(null);
      },
    });
  }

  confirmDelete(userId: number): void {
    this.deleteConfirmId.set(userId);
  }

  cancelDelete(): void {
    this.deleteConfirmId.set(null);
  }

  deleteUser(userId: number): void {
    this.actionLoading.set(userId);
    this.deleteConfirmId.set(null);

    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.users.update((users) => users.filter((u) => u.id !== userId));
        this.actionLoading.set(null);
        // Refresh stats after deletion
        this.adminService.getDashboardStats().subscribe({
          next: (stats) => this.stats.set(stats),
        });
      },
      error: (err) => {
        console.error('Failed to delete user', err);
        this.actionLoading.set(null);
      },
    });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.integration.logout();
    this.router.navigate(['/login']);
  }

  getProviderIcon(provider: string): string {
    switch (provider?.toLowerCase()) {
      case 'github': return 'bx bxl-github';
      case 'google': return 'bx bxl-google';
      case 'local': return 'bx bx-key';
      default: return 'bx bx-user';
    }
  }

  getInitials(name: string | null): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
