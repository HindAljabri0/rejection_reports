import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import {
  getSubmittedClaims,
  getPaidClaims,
  getPartiallyPaidClaims,
  getUnderProcessingClaims,
  getRejectedClaims,
  DashboardCardData
} from '../../store/dashboard.reducer';

@Component({
  selector: 'app-submitted-claims',
  templateUrl: './submitted-claims.component.html',
  styleUrls: ['./submitted-claims.component.css']
})
export class SubmittedClaimsComponent implements OnInit {

  summaries: DashboardCardData[] = [];

  constructor(private sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.store.select(getSubmittedClaims).subscribe(data => this.summaries[0] = { ...data, title: 'All Claims After Submission' });
    this.store.select(getPaidClaims).subscribe(data => this.summaries[1] = data);
    this.store.select(getPartiallyPaidClaims).subscribe(data => this.summaries[2] = data);
    this.store.select(getRejectedClaims).subscribe(data => this.summaries[3] = data);
    this.store.select(getUnderProcessingClaims).subscribe(data => this.summaries[4] = data);
  }

  getCardName(status: string) {
    return this.sharedServices.statusToName(status);
  }

  getCardColor(status: string) {
    return this.sharedServices.getCardAccentColor(status);
  }

}
