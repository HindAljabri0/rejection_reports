import { Component, Input, Output } from '@angular/core';
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
