import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import {
  getNonSubmittedClaims,
  getAcceptedClaims,
  getNotAcceptedClaims,
  getUnderSubmissionClaims,
  DashboardCardData
} from '../../store/dashboard.reducer';

@Component({
  selector: 'app-non-submitted-claims',
  templateUrl: './non-submitted-claims.component.html',
  styles: []
})
export class NonSubmittedClaimsComponent implements OnInit {

  summaries: DashboardCardData[] = [];

  constructor(private sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.store.select(getNonSubmittedClaims).subscribe(data => this.summaries[0] = { ...data, title: 'All Claims Before Submission' });
    this.store.select(getAcceptedClaims).subscribe(data => this.summaries[1] = data);
    this.store.select(getNotAcceptedClaims).subscribe(data => this.summaries[2] = data);
    this.store.select(getUnderSubmissionClaims).subscribe(data => this.summaries[3] = data);
  }

  getCardName(status: string) {
    return this.sharedServices.statusToName(status);
  }

  getCardColor(status: string) {
    return this.sharedServices.getCardAccentColor(status);
  }

  calculatePercetage(first: number, second: number, roundValue: number = 4) {
    return parseFloat(((first / second) * 100).toFixed(roundValue)).toString();
  }
}
