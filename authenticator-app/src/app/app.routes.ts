import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Callback } from './auth/callback/callback';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { AdminDashboard } from './components/admin/admin-dashboard';

export const routes: Routes = [
    {path: '', redirectTo: 'login',pathMatch:'full'},
    {path:'login',component: Login},
    {path:'auth/callback', component: Callback},
    {path:'dashboard',component: Dashboard, canActivate: [authGuard]},
    {path:'admin',component: AdminDashboard, canActivate: [authGuard, adminGuard]}
];
