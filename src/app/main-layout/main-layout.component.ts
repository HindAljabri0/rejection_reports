import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { isHeaderAndSideMenuHidden } from '../store/mainStore.reducer';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styles: []
})
export class MainLayoutComponent implements OnInit {

  isHeaderAndSideMenuHidden$: Observable<boolean>;
  languageList = [ // <--- add this
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'عربى', dir: 'rtl' }
  ];

  @HostBinding('attr.dir') dir = 'ltr';

  activeLanguageLabel = 'English';

  constructor(
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

}
