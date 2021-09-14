import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

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
    if (this.data && this.data.items) {
      this.data.items.forEach(x => {
        x.startDate =  moment(moment(x.startDate, 'YYYY-MM-DD')).format('DD-MM-YYYY');
        x.supportingInfoSequence = x.supportingInfoSequence.toString();
        x.careTeamSequence = x.careTeamSequence.toString();
        x.diagnosisSequence = x.diagnosisSequence.toString();
      });
    }
  }

  toggleItem(index) {
    if (this.currentSelectedItem === index) {
      this.currentSelectedItem = -1;
    } else {
      this.currentSelectedItem = index;
    }
  }

}
