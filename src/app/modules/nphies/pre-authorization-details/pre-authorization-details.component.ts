import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pre-authorization-details',
  templateUrl: './pre-authorization-details.component.html',
  styles: []
})
export class PreAuthorizationDetailsComponent implements OnInit {

  @Input() data: any;
  currentSelectedItem = -1;
  constructor() { }

  ngOnInit() {
  }

  toggleItem(index) {
    if (this.currentSelectedItem == index) {
      this.currentSelectedItem = -1;
    } else {
      this.currentSelectedItem = index;
    }
  }

}
