import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  message = ''
  errMassage = ''
  isValidate=false;
  encryptedEmail = ''
  key = ''

  data = {
    userid: 0,
    oldPassword: '',
    newPassword: ''
  }

  userid:any=0
  isUpdated = false
  isAlreadyUpdated = false;
  constructor(private route: ActivatedRoute, private authService: AuthService) { }
  ngOnInit(): void {
   this.userid=sessionStorage.getItem('userid');
   console.log(this.userid);
   this.data.userid=this.userid
  }

  confirmPassword=''

  onUpdate() {
    console.log(this.data);
    
    if (this.data.oldPassword ==''|| this.data.newPassword=='' || this.confirmPassword=='') {
      this.errMassage = "Please fill all the field"
      setTimeout(() => {
        this.errMassage = '';
      }, 3000);
    }else if (this.data.newPassword.length < 6) {
      this.errMassage = "New password must be at least 6 characters";
    }
    
    else if(this.data.newPassword!=this.confirmPassword){
      this.errMassage = "newPassword and  confirmPassword does not match"
      setTimeout(() => {
        this.errMassage = '';
      }, 3000);
    }else {
      this.authService.resetPassword(this.data).subscribe((res: any) => {
        if (res.state == true) {
          this.isUpdated = true;
        }
      }, (Error: HttpErrorResponse) => {
        {  
            this.errMassage = Error.error.message
            setTimeout(() => {
              this.errMassage = '';
            }, 3000)
          }
        
      })
    }
  }
}


