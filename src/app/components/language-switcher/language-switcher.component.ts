import { Component, OnInit, Input } from '@angular/core';

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