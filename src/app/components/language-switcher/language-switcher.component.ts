import { Component, LOCALE_ID, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent implements OnInit {

  languageList = [ // <--- add this
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'عربى' }
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) protected locale: string) { }

  ngOnInit() {
  // console.log(LocaleId.getCurrentLocale());
    console.log(this.locale);
    console.log(this.document.documentElement.lang);
    this.document.documentElement.lang = this.locale;
  }


}
