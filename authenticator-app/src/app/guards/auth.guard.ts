import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Integration } from '../services/integration';

export const authGuard: CanActivateFn = (route, state) => {
  const integration = inject(Integration);
  const router = inject(Router);

  if (integration.isLoggedIn()) {
    return true;
  }

  // Not logged in, redirect to login page
  router.navigate(['/login']);
  return false;
};
