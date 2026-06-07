import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.html',
  styleUrl: './callback.css',
})
export class Callback implements OnInit{

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
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
      this.router.navigate(['/login']);
    }
  }

}

