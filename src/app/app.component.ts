import { AuthService } from './services/authService/authService.service';
import { Component, OnInit } from '@angular/core';
import { A } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  title = 'Waseele';
  
  constructor(public authService: AuthService) {
  }

  ngOnInit() {
   
  }

  
  get isLoggedIn() {
    return this.authService.loggedIn;
  }
}
