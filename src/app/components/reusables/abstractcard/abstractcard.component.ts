import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-abstractcard',
  templateUrl: './abstractcard.component.html',
  styles: ['']
})
export class AbstractcardComponent {

  constructor() { }

  @Input() title: string;
  @Input() totalCount: string;
  @Input() inactiveCount?: string;
  @Input() actionText: string;
  @Input() accentColor: string;
  @Input() clickable = true;
  @Output() action = new EventEmitter();
}
