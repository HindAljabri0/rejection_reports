import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/authService/authService.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })

  export class LoginComponent {

    constructor(public authService:AuthService, public router:Router, public commen:CommenServicesService){}
    ngOnInit() {}

    username = new FormControl();
    password = new FormControl();

    isLoading = false;

    errors:String;

    progressSpinnerDiameter = 35;

    login(){
      if(this.isLoading) return;
      this.isLoading = true;
      if(this.username.value == undefined || this.username.value == "" ){
        this.errors = "Please provide a vaild username!";
        this.isLoading = false;
        return;
      } else if(this.password.value == undefined || this.password.value == ""){
        this.errors = "Please provide a password!";
        this.isLoading = false;
        return;
      }
      this.authService.login(this.username.value, this.password.value).subscribe(event => {
        if(event instanceof HttpResponse){
          this.authService.setTokens(event.body);
          this.router.navigate(['/']);
          this.isLoading = false;
        }
      }, errorEvent =>{
        if(errorEvent instanceof HttpErrorResponse){
           if(errorEvent.status < 500 && errorEvent.status >= 400){
            this.errors = "username/password is invaild!";
          } else
            this.errors = "Could not reach server at the moment. Please try again later.";
          this.isLoading = false;
        } 
      });
    }
  }