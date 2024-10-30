import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  data={
    email:sessionStorage.getItem('logginEmail')
  }
constructor(private route:Router){}


onlogout(){

    sessionStorage.removeItem('token')
    this.route.navigate([''])
    //alert('Logout successfuly')  
    
}
}
