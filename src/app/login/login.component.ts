
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage: string = '';

  constructor(private authService: AuthService,private route:Router) {}

  onLogin(form: NgForm): void {
    if (form.valid) {
      const { email, password } = form.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          const resp=JSON.stringify(response);
        const result=JSON.parse(resp)
        
        
        sessionStorage.setItem('token',JSON.stringify(result.token))
        sessionStorage.setItem('email',JSON.stringify(result.email))
        sessionStorage.setItem('userid',JSON.stringify(result.userid))
        
        this.route.navigate(['/dashboard']);
        location.reload();

          // Handle successful login
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid email or password';
        }
      });
    }
  }
}
