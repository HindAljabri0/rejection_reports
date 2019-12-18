import { Component } from '@angular/core';
import { AuthService } from './services/authService/authService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Waseele';
  constructor(public authService: AuthService) {
  }

  get isLoggedIn() {
    return this.authService.loggedIn;
  }
}
