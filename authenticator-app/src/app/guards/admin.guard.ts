import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Integration } from '../services/integration';

export const adminGuard: CanActivateFn = (route, state) => {
  const integration = inject(Integration);
  const router = inject(Router);

  if (integration.isLoggedIn() && integration.isAdmin()) {
    return true;
  }

  // Not admin, redirect to user dashboard
  router.navigate(['/dashboard']);
  return false;
};
