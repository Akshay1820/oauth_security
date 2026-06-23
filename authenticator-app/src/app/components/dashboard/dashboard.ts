import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Integration } from '../../services/integration';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  protected readonly username = signal<string>('User');
  protected readonly token = signal<string>('');
  protected readonly showToken = signal<boolean>(false);
  protected readonly copySuccess = signal<boolean>(false);

  constructor(
    private integration: Integration,
    public router: Router
  ) { }

  ngOnInit(): void {
    const storedUsername = this.integration.getUsername();
    if (storedUsername) {
      this.username.set(storedUsername);
    }

    const storedToken = this.integration.getToken();
    if (storedToken) {
      this.token.set(storedToken);
    }
  }

  toggleTokenVisibility(): void {
    this.showToken.update(v => !v);
  }

  copyToken(): void {
    if (!this.token()) return;

    navigator.clipboard.writeText(this.token()).then(() => {
      this.copySuccess.set(true);
      setTimeout(() => {
        this.copySuccess.set(false);
      }, 2000);
    });
  }

  logout(): void {
    this.integration.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.integration.isAdmin();
  }
}
