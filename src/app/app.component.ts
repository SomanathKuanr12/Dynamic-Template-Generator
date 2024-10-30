import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Frontend';
  LoginToken: string | null | undefined; // Specify the type as string or null
  isLoggedIn = false;

  ngOnInit(): void {
    this.LoginToken = sessionStorage.getItem('token'); // This can return null

    // Check if the token exists and its length is greater than 3
    this.isLoggedIn = this.LoginToken !== null && this.LoginToken.length > 3;

    console.log(this.isLoggedIn);
  }
}
