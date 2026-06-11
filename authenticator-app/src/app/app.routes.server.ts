import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'dashboard',
    renderMode: RenderMode.Client
  },
  {
    // OAuth callback reads ?token= query param at runtime — must NOT be prerendered
    path: 'auth/callback',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
