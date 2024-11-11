import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  successMessage: string = '';
  errMessage: string = '';
  
    constructor(private authService: AuthService,private route:Router) {}
  
    onSignUp(form: NgForm): void {
      if (form.valid) {
        const { email, password } = form.value;
        this.authService.signUp(email, password).subscribe({
          next: (response) => {
            console.log('Signup successful', response);
            this.successMessage = 'Registration successful! Please log in.';
            setTimeout(() => {
              this.successMessage = "";
              this.route.navigate(['/login']);
            }, 1000);
          },
          error: (error) => {
            console.error('Signup failed', error);
            this.errMessage = 'Registration failed. Please try again.';
            setTimeout(() => {
              this.errMessage = "";
            
            }, 1000);
          }
        });
      }
    }
  }
