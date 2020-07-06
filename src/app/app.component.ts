import { Component } from '@angular/core';
import { AuthService } from './services/authService/authService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  languageList = [ // <--- add this
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'عربى' }
  ];
  title = 'Waseele';
  constructor(public authService: AuthService) {
  }

  get isLoggedIn() {
    return this.authService.loggedIn;
  }
}
