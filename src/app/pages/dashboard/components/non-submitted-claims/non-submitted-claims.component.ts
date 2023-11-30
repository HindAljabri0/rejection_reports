import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import {
  getNonSubmittedClaims,
  DashboardCardData
} from '../../store/dashboard.reducer';
import { NON_BINDABLE_ATTR } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-non-submitted-claims',
  templateUrl: './non-submitted-claims.component.html',
  styles: []
})
export class NonSubmittedClaimsComponent implements OnInit {

  summaries: DashboardCardData;

  constructor(public sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.store.select(getNonSubmittedClaims).subscribe(data => this.summaries = { ...data, title: 'All Claims Before Submission' });
  }

  getCardName(status: string) {
    return this.sharedServices.statusToName(status);
  }

  getCardColor(status: string) {
    return this.sharedServices.getCardAccentColor(status);
  }

  calculatePercetage(first: number, second: number, roundValue: number = 4) {
    const retval = parseFloat(((first / second) * 100).toFixed(roundValue));
    return isNaN(retval) ? 0 : retval.toString();
  }

  getConvertfromStringToNumber(value: string) {

    if (value != null || value != '') {
      return (Number(value));
    } else {
      return 0;
    }

  }

  PercentageCalculator(value_1: string, value_2: string, value_3: string, total: number) {

    let result = (this.getConvertfromStringToNumber(value_1) + this.getConvertfromStringToNumber(value_2)
      + this.getConvertfromStringToNumber(value_3)) / total * 100;
    if (isNaN(result)) {
      result = 0;
    }
    if (result == 100 || result == 0) {
      return result;
    } else {
      return result.toFixed(2);
    }
  }
}
