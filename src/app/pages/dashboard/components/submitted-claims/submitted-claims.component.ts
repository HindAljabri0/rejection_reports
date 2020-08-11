import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';

@Component({
  selector: 'app-submitted-claims',
  templateUrl: './submitted-claims.component.html',
  styleUrls: ['./submitted-claims.component.css']
})
export class SubmittedClaimsComponent implements OnInit {

  allClaimsSummary: SearchStatusSummary = {
    statuses: ['PAID', 'PARTIALLY PAID', 'REJECTED', 'INVALID', 'DUPLICATE', 'OUTSTANDING', 'PENDING'],
    totalClaims: 0,
    totalNetAmount: 0,
    totalVatNetAmount: 0,
    uploadName: null,
    gross: 0
  };

  paidClaimsSummary: SearchStatusSummary = {
    statuses: ['PAID'],
    totalClaims: 0,
    totalNetAmount: 0,
    totalVatNetAmount: 0,
    uploadName: null,
    gross: 0
  };

  partiallyPaidClaimsSummary: SearchStatusSummary = {
    statuses: ['PARTIALLY PAID'],
    totalClaims: 0,
    totalNetAmount: 0,
    totalVatNetAmount: 0,
    uploadName: null,
    gross: 0
  };

  rejectedClaimsSummary: SearchStatusSummary = {
    statuses: ['REJECTED', 'INVALID', 'DUPLICATE'],
    totalClaims: 0,
    totalNetAmount: 0,
    totalVatNetAmount: 0,
    uploadName: null,
    gross: 0
  };

  underProcessingClaimsSummary: SearchStatusSummary = {
    statuses: ['OUTSTANDING', 'PENDING'],
    totalClaims: 0,
    totalNetAmount: 0,
    totalVatNetAmount: 0,
    uploadName: null,
    gross: 0
  };

  constructor(private sharedServices:SharedServices) { }

  ngOnInit() {
  }

  getCardName(status:string){
    return this.sharedServices.statusToName(status);
  }

  getCardColor(status:string){
    return this.sharedServices.getCardAccentColor(status);
  }

}
