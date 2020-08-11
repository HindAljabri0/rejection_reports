import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';

@Component({
  selector: 'app-non-submitted-claims',
  templateUrl: './non-submitted-claims.component.html',
  styleUrls: ['./non-submitted-claims.component.css']
})
export class NonSubmittedClaimsComponent implements OnInit {

  allClaimsSummary: SearchStatusSummary = {
    statuses: ['Accepted', 'Failed', 'NotAccepted', 'Batched'],
    totalClaims: 0,
    totalNetAmount: 0,
    totalVatNetAmount: 0,
    uploadName: null,
    gross: 0
  };
  acceptedClaimsSummary: SearchStatusSummary = {
    statuses: ['Accepted', 'Failed'],
    totalClaims: 0,
    totalNetAmount: 0,
    totalVatNetAmount: 0,
    uploadName: null,
    gross: 0
  };
  notAcceptedClaimsSummary: SearchStatusSummary = {
    statuses: ['NotAccepted'],
    totalClaims: 0,
    totalNetAmount: 0,
    totalVatNetAmount: 0,
    uploadName: null,
    gross: 0
  };
  queuedClaimsSummary: SearchStatusSummary = {
    statuses: ['Batched'],
    totalClaims: 0,
    totalNetAmount: 0,
    totalVatNetAmount: 0,
    uploadName: null,
    gross: 0
  };

  constructor(private sharedServices: SharedServices) { }

  ngOnInit() {
  }

  getCardName(status: string) {
    return this.sharedServices.statusToName(status);
  }

  getCardColor(status: string) {
    return this.sharedServices.getCardAccentColor(status);
  }
}
