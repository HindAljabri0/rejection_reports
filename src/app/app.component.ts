import { AuthService } from './services/authService/authService.service';
import { Component, LOCALE_ID, Inject, OnInit, HostBinding } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { A } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
 
  title = 'Waseele';

  languageList = [ // <--- add this
    { code: 'en', label: 'English', dir:'ltr' },
    { code: 'ar', label: 'عربى', dir: 'rtl' }
  ];

  @HostBinding('attr.dir') dir = 'ltr';

  activeLanguageLabel = 'English';
  
  constructor(public authService: AuthService, @Inject(DOCUMENT) private document: Document,
              @Inject(LOCALE_ID) protected locale: string) {
  }

  ngOnInit() {
    console.log(this.locale);
    console.log(this.document.documentElement.lang);

    if (this.locale.startsWith('ar')) {
      this.activeLanguageLabel = 'عربى';
      //this.dir = 'rtl';
    }

    this.document.documentElement.lang = this.locale;
  }

  
  get isLoggedIn() {
    return this.authService.loggedIn;
  }
}
