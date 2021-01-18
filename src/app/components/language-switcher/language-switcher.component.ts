import { Component, LOCALE_ID, Inject, OnInit, HostBinding, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styles: []
})
export class LanguageSwitcherComponent implements OnInit {

  @Input() activeLanguageLabel: string;

  @Input() languageList;

  constructor() { }

  ngOnInit() {

  }


}
