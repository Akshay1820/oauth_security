import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.html',
  styleUrl: './callback.css',
})
export class Callback implements OnInit{

  private platformId = inject(PLATFORM_ID);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Only run in browser — localStorage is not available during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('OAuth callback triggered, token present:', !!token);

    if (token) {
      console.log("Token found, storing and redirecting to dashboard");
      
      localStorage.setItem('token', token);

      // Decode JWT payload to extract username
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        if (decoded.sub) {
          localStorage.setItem('username', decoded.sub);
        }
      } catch (e) {
        console.error('Failed to decode JWT:', e);
      }

      this.router.navigate(['/dashboard']);
    } else {
      console.log("Token not found in callback URL, redirecting to login");
      
      this.router.navigate(['/login']);
    }
  }

}
