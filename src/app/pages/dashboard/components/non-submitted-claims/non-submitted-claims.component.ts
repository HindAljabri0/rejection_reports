import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { Store } from '@ngrx/store';
import { getNonSubmittedClaims, getAcceptedClaims, getNotAcceptedClaims, getUnderSubmissionClaims } from '../../store/dashboard.reducer';
import { setCardIsLoading } from '../../store/dashboard.actions';

@Component({
  selector: 'app-non-submitted-claims',
  templateUrl: './non-submitted-claims.component.html',
  styleUrls: ['./non-submitted-claims.component.css']
})
export class NonSubmittedClaimsComponent implements OnInit {

  summaries:{loading:boolean, summary:SearchStatusSummary, error?:string, title?:string}[] = [];

  constructor(private sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.store.select(getNonSubmittedClaims).subscribe(data => this.summaries[0] = {...data, title: 'All Claims Before Submission'});
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
}
