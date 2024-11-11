import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OtpService } from '../Services/otp.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  data={
    email:'',
  }
  data1={
    password:'',
    email:''
  }
  confirmPassword=''
  userInput:any
  message='';
  errMassage='';
  verified=false;
  isOtpSent=false
  constructor(private otpService:OtpService,private route:Router){}
    onSubmit(){
      this.otpService.sendOtp(this.data).subscribe((res:any)=>{
        if(res)
          {
           this.isOtpSent=true; 
            this.otpService.currentOtpEmail=this.data.email;
            this.message="otp sent successfully"
            setTimeout(()=>{
              this.message='';
            },1000)
          }
      },    (Error:HttpErrorResponse)=>{
        {
        this.errMassage=Error.error.message  
        setTimeout(()=>{
          this.errMassage='';
        },3000)
  
        }
      })
    }
    onVerify()
    {
      if (this.userInput != '') {
        const email=this.otpService.getOtpEmail();
        console.log(email);      
        this.otpService.verifyOtp(this.userInput,email).subscribe((result:any)=>{
          if(result==true)
            {
                this.verified=result;
                 this.message="Otp verified Successfully"; 
                 this.verified=true;
                 this.isOtpSent=false;
                 this.errMassage='' ;  
                 setTimeout(()=>{
                  this.message='';
                },4000)                 
            }
        },
        (Error:HttpErrorResponse)=>{
          {
          this.errMassage=Error.error.message  
          this.message="";  
          setTimeout(()=>{
            this.errMassage='';
          },3000)
  
          }
        })
    } 
    }
    onUpdate(){
      if(this.verified)
        {
          this.data1.email=this.otpService.getOtpEmail();
          console.log(this.data1.email);
          
      this.otpService.updatePassword(this.data1).subscribe((res: any)=>{
        if(res){
          alert("password updated successfully");
          this.route.navigate(['/login'])
        }
      },    (Error:HttpErrorResponse)=>{
        {
        this.errMassage=Error.error.message  
        setTimeout(()=>{
          this.errMassage='';
        },3000)
  
        }
      })
    }
  }
  
}
