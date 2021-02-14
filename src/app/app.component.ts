import { AuthService } from './services/authService/authService.service';
import { Component, LOCALE_ID, Inject, OnInit, HostBinding } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isHeaderAndSideMenuHidden } from './store/mainStore.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Waseele';

  languageList = [ // <--- add this
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'عربى', dir: 'rtl' }
  ];

  @HostBinding('attr.dir') dir = 'ltr';

  activeLanguageLabel = 'English';

  isHeaderAndSideMenuHidden$: Observable<boolean>;

  constructor(
    public authService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) protected locale: string,
    private store: Store
  ) {
    this.isHeaderAndSideMenuHidden$ = this.store.select(isHeaderAndSideMenuHidden);
  }

  ngOnInit() {

    if (this.locale.startsWith('ar')) {
      this.activeLanguageLabel = 'عربى';
      // this.dir = 'rtl';
    }

    this.document.documentElement.lang = this.locale;
  }

  get isLoggedIn() {
    return this.authService.loggedIn;
  }
}
