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
    if (this.data.items) {
      this.data.items.map(x => {
        x.supportingInfoSequence = x.supportingInfoSequence.toString();
        x.careTeamSequence = x.careTeamSequence.toString();
        x.diagnosisSequence = x.diagnosisSequence.toString();
      });
    }
  }

  toggleItem(index) {
    if (this.currentSelectedItem == index) {
      this.currentSelectedItem = -1;
    } else {
      this.currentSelectedItem = index;
    }
  }

}
