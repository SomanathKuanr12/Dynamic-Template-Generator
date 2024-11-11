import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;

  constructor(private route: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to the login state
    this.authService.loggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  onlogout() {
    // Call the logout method from AuthService
    this.authService.logout();
    this.route.navigate(['']);
  }
}
