import { AuthService } from './services/authService/authService.service';
import { Component, LOCALE_ID, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { APP_LOCALE_ID } from './models/LocaleId';
import { A } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  languageList = [ // <--- add this
    { code: 'en-US', label: 'English' },
    { code: 'ar-SA', label: 'عربى' }
  ];
  title = 'Waseele';
  
  constructor(public authService: AuthService,
              @Inject(DOCUMENT) private document: Document,
              @Inject(LOCALE_ID) protected locale: string) {
  }

  ngOnInit() {
    console.log(APP_LOCALE_ID);
    console.log(this.locale);
    console.log(this.document.documentElement.lang);
    this.document.documentElement.lang = this.locale;
  }

  public changeLanguage(loc: any ) {
    console.log('after change');
    
    this.locale = loc.code;
    this.document.documentElement.lang = this.locale;

    console.log(this.locale);
    console.log(this.document.documentElement.lang);

  }


  get isLoggedIn() {
    return this.authService.loggedIn;
  }
}
