import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
    successMessage: string = '';
    errorMessage: string = '';
  
    constructor(private authService: AuthService) {}
  
    onSignUp(form: NgForm): void {
      if (form.valid) {
        const { email, password } = form.value;
        this.authService.signUp(email, password).subscribe({
          next: (response) => {
            console.log('Signup successful', response);
            this.successMessage = 'Registration successful! Please log in.';
          },
          error: (error) => {
            console.error('Signup failed', error);
            this.errorMessage = 'Registration failed. Please try again.';
          }
        });
      }
    }
  }
