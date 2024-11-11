import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  canActivate(): boolean {
    if (sessionStorage.getItem('token') !== null && sessionStorage.getItem('userid') !== null) {
      console.log("true");
      return true;
    } else {
      console.log("false");
      this.router.navigate(['login']);
      return false;
    }
  }
}
