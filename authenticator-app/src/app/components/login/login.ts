import { Component } from '@angular/core';
import { Integration } from '../../services/integration';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginRequest } from '../../models/login-request';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  constructor(
    private integration: Integration,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  userForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  request: LoginRequest = new LoginRequest();

  doLogin() {

    const formValue = this.userForm.value;

    if (!formValue.username || !formValue.password) {
      this.snackBar.open(
        'Username and Password are required',
        'Close',
        {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        }
      );
      return;
    }

    this.request.username = formValue.username;
    this.request.password = formValue.password;

    this.integration.login(
      formValue.username,
      formValue.password
    ).subscribe({
      next: (res) => {

        this.snackBar.open(
          'Login Successful',
          'Close',
          {
            duration: 3000,
            verticalPosition: 'bottom',
          horizontalPosition: 'center'
          }
        );

        this.router.navigate(['/dashboard']);
      },

      error: (err) => {

        if (err.status === 401) {
          this.snackBar.open(
            'Invalid username or password',
            'Close',
            {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center'
            }
          );
        } else {
          this.snackBar.open(
            'Something went wrong. Please try again.',
            'Close',
            {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center'
            }
          );
        }

        console.error(err);
      }
    });
  }
}