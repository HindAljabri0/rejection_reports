import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { Store } from '@ngrx/store';
import { getNonSubmittedClaims, getAcceptedClaims, getNotAcceptedClaims, getUnderSubmissionClaims, DashboardCardData } from '../../store/dashboard.reducer';
import { setCardIsLoading } from '../../store/dashboard.actions';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-non-submitted-claims',
  templateUrl: './non-submitted-claims.component.html',
  styles: []
})
export class NonSubmittedClaimsComponent implements OnInit {
  owlCarouselOptions: OwlOptions = {
    mouseDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 300,
    navText: ['', ''],
    margin: 14,
    responsive: {
      0: {
        items: 2,
        slideBy: 2
      },
      992: {
        items: 3,
        slideBy: 3
      },
      1440: {
        items: 4,
        slideBy: 4
      }
    },
    nav: true
  };

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
}
