// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private baseUrl = 'http://localhost:4700'; 

 

  private loggedIn = new BehaviorSubject<boolean>(false); // default to logged out
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    // Initialize based on session storage
    const userid = sessionStorage.getItem('userid');
    this.loggedIn.next(!!userid);
  }

  loginStatus(userid: string) {
    sessionStorage.setItem('userid', userid);
    this.loggedIn.next(true); // Notify components of login
  }

  logout() {
    sessionStorage.removeItem('userid');
    sessionStorage.removeItem('token');
    this.loggedIn.next(false); // Notify components of logout
  }
  signUp(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/sign_up`, { email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/log_in`, { email, password });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset_password`, data);
  }
}
