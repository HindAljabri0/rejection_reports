import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { changeSelectedTab } from '../store/claim.actions';
import { MatTabChangeEvent } from '@angular/material';
import {
  getClaimObjectErrors,
  FieldError,
  ClaimPageType,
  getPageType,
  ClaimPageMode,
  getPageMode,
  getCaseType,
  getClaim
} from '../store/claim.reducer';
import { Claim } from '../models/claim.model';

@Component({
  selector: 'claim-data',
  templateUrl: './claim-data.component.html',
  styles: []
})
export class ClaimDataComponent implements OnInit {

  errors: {
    genInfoErrors: FieldError[],
    diagnosisErrors: FieldError[],
    invoicesErrors: FieldError[],
    uncategorised: FieldError[],
    labResultsErrors: FieldError[]
  };

  pageMode: ClaimPageMode;
  pageType: ClaimPageType;

  isInpatientClaim: boolean;
  @Input() claimType = '';
  claim: Claim;

  claim:Claim;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getPageMode).subscribe(mode => this.pageMode = mode);
    this.store.select(getPageType).subscribe(type => this.pageType = type);
    this.store.select(getClaimObjectErrors).subscribe(errors => this.errors = errors);
    this.store.select(getCaseType).subscribe(type => this.isInpatientClaim = (type == 'INPATIENT'));
    this.store.select(getClaim).subscribe(claim => this.claim = claim);
  }

  changeTab(event: MatTabChangeEvent) {
    this.store.dispatch(changeSelectedTab({
      tab: event.tab.textLabel.replace('&', '').split(' ').filter(str => str.length > 0).join('_').toUpperCase()
    }));
  }

  genInfoTabHasErrors() {
    if (this.errors != null && this.errors.genInfoErrors != null) {
      return this.errors.genInfoErrors.length > 0 ;
    }
    return false;
  }

  diagnosisTabHasErrors() {
    if (this.errors != null && this.errors.diagnosisErrors != null) {
      return this.errors.diagnosisErrors.length > 0;
    }
    return false;
  }

  invoiceServicesTabHasErrors() {
    if (this.errors != null && this.errors.invoicesErrors != null) {
      return this.errors.invoicesErrors.length > 0;
    }
    return false;
  }

  admissionTabHasErrors() {
    //if (this.errors != null) {
    //  return this.errors.admissionErrors.length > 0;
  //  }
    return false;
  }

  labResultsTabHasErrors() {
    if (this.errors != null && this.errors.labResultsErrors != null) {
      return this.errors.labResultsErrors.length > 0;
    }
    return false;
  }

  claimHaveLabData() {
    return this.claim != null
      && this.claim.caseInformation != null
      && this.claim.caseInformation.caseDescription != null
      && this.claim.caseInformation.caseDescription.investigation != null
      && this.claim.caseInformation.caseDescription.investigation.length > 0;
  }
}
