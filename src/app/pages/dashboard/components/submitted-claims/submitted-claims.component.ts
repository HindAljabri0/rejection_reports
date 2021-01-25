import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { Store } from '@ngrx/store';
import { getSubmittedClaims, getPaidClaims, getPartiallyPaidClaims, getUnderProcessingClaims, getRejectedClaims, DashboardCardData } from '../../store/dashboard.reducer';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-submitted-claims',
  templateUrl: './submitted-claims.component.html',
  styles: []
})
export class SubmittedClaimsComponent implements OnInit {
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
