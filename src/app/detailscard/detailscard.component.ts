import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detailscard',
  templateUrl: './detailscard.component.html',
  styleUrls: ['./detailscard.component.css']
})
export class DetailscardComponent  {

  constructor() { }

  @Input() title: string;

  @Input() topLeftActionText: string;
  @Input() topRightActionText: string;

  @Input() bottomLeftActionText: string;
  @Input() bottomRightActionText: string;

  @Input() bottomDetails: string;

  @Input() accentColor:string;

  @Output() topLeftAction = new EventEmitter();
  @Output() topRightAction = new EventEmitter();

  @Output() bottomLeftAction = new EventEmitter();
  @Output() bottomRightAction = new EventEmitter();

}
