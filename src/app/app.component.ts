import { AuthService } from './services/authService/authService.service';
import { Component, LOCALE_ID, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LocaleId } from './models/LocaleId';
import { A } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  languageList = [ // <--- add this
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'عربى' }
  ];
  title = 'Waseele';
  
  constructor(public authService: AuthService,
              @Inject(DOCUMENT) private document: Document,
              @Inject(LOCALE_ID) protected locale: string) {
  }

  ngOnInit() {
   // console.log(LocaleId.getCurrentLocale());
    console.log(this.locale);
    console.log(this.document.documentElement.lang);
    this.document.documentElement.lang = this.locale;
  }

  public changeLanguage(loc: any ) {
    console.log('after change');
    
    this.locale = loc.code;
    this.document.documentElement.lang = this.locale;
   // LocaleId.setCurrentLocale(loc.code);

    console.log(this.locale);
    console.log(this.document.documentElement.lang);
   // console.log(LocaleId.getCurrentLocale());

    window.location.reload();
  }


  get isLoggedIn() {
    return this.authService.loggedIn;
  }
}
