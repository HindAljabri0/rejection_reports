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
  paymentAmount = 0;
  constructor() { }

  ngOnInit() {
    if (this.data && this.data.items) {
      this.data.items.forEach(x => {
        debugger;
        this.paymentAmount += x.net;
        x.startDate = moment(moment(x.startDate, 'YYYY-MM-DD')).format('DD-MM-YYYY');

        // x.supportingInfoSequence = x.supportingInfoSequence ? x.supportingInfoSequence.toString() : '-';
        // x.careTeamSequence = x.careTeamSequence ? x.careTeamSequence.toString() : '';
        // x.diagnosisSequence = x.diagnosisSequence ? x.diagnosisSequence.toString() : '';

        if (x.supportingInfoSequence) {
          x.supportingInfoNames = '';
          x.supportingInfoSequence.forEach(s => {
            x.supportingInfoNames = ', [' + this.data.supportingInfo.filter(y => y.sequence === s)[0].category + ']';
          });
          x.supportingInfoNames = x.supportingInfoNames.slice(2, x.supportingInfoNames.length);
        }

        if (x.careTeamSequence) {
          x.careTeamNames = '';
          x.careTeamSequence.forEach(s => {
            x.careTeamNames += ', [' + this.data.careTeam.filter(y => y.sequence === s)[0].practitionerName + ']';
          });
          x.careTeamNames = x.careTeamNames.slice(2, x.careTeamNames.length);
        }

        if (x.diagnosisSequence) {
          x.diagnosisNames = '';
          x.diagnosisSequence.forEach(s => {
            x.diagnosisNames += ', [' + this.data.diagnosis.filter(y => y.sequence === s)[0].diagnosisCode + ']';
          });
          x.diagnosisNames = x.diagnosisNames.slice(2, x.diagnosisNames.length);
        }

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
