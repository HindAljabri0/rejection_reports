import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detailscard',
  templateUrl: './detailscard.component.html',
  styles: []
})
export class DetailscardComponent {

  constructor() { }

  @Input() title: string;

  @Input() topLeftActionText: string;
  @Input() topRightActionText: string;

  @Input() bottomLeftActionText: string;
  @Input() bottomLeftActionDisabled = false;
  @Input() bottomRightActionText: string;
  @Input() bottomRightActionDisabled = false;

  @Input() bottomDetails: string;

  @Output() topLeftAction = new EventEmitter();
  @Output() topRightAction = new EventEmitter();

  @Output() bottomLeftAction = new EventEmitter();
  @Output() bottomRightAction = new EventEmitter();

}
