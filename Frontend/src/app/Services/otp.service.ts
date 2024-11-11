import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  private baseUrl = 'http://localhost:4700'; 
  constructor(private http:HttpClient) { }
  LogInEmail=''
  getEmail():any{ 
  return this.LogInEmail
  }
  currentOtpEmail=''
  getOtpEmail():any{
    return this.currentOtpEmail
  }

  sendOtp(data:any)
  {
    return this.http.post(`${this.baseUrl}/otp`,data);
  }
  verifyOtp(otp:any,email:any)
  {
    return this.http.get(`${this.baseUrl}/${otp}/${email}`)
  }
  updatePassword(data:any)
  {
    return this.http.put(`${this.baseUrl}/update`,data);
  }
}
