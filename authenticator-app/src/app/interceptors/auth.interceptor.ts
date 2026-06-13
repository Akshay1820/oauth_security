import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Integration } from '../services/integration';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const integration = inject(Integration);
    const router = inject(Router);

    // Automatically attach the JWT token to every request header if it exists
    const token = integration.getToken();
    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Clear local storage and redirect to login page
                integration.logout();
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
