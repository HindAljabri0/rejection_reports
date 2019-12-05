import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/authService/authService.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })

  export class LoginComponent {

    constructor(public authService:AuthService, public router:Router){}
    ngOnInit() {}

    username = new FormControl();
    password = new FormControl();

    login(){
      this.authService.login(this.username.value, this.password.value).subscribe(event => {
        if(event instanceof HttpResponse){
          this.authService.setTokens(event.body);
          this.router.navigate(['/']);
        }
      }, errorEvent =>{
        if(errorEvent instanceof HttpErrorResponse){

        }
      });
    }
  }