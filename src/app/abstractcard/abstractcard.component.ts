import { Component, Input, Output, ContentChildren } from '@angular/core';
// import { MatCardModule } from '@angular/material/card';
// import { MatCard } from '@angular/material/card';
// import { MatButton } from '@angular/material/button';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-abstractcard',
  templateUrl: './abstractcard.component.html',
  styleUrls: ['./abstractcard.component.css']
})
export class AbstractcardComponent  {

  constructor() { }

  @Input() title: string;
  @Input() actionText: string;
  @Input() accentColor:string;
  @Input() clickable:boolean = true;
  @Output() action = new EventEmitter();
}
