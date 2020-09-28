import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { changeSelectedTab } from '../store/claim.actions';
import { MatTabChangeEvent } from '@angular/material';
import { getClaimObjectErrors, FieldError, ClaimPageType, getPageType, ClaimPageMode, getPageMode, getCaseType } from '../store/claim.reducer';

@Component({
  selector: 'claim-data',
  templateUrl: './claim-data.component.html',
  styleUrls: ['./claim-data.component.css']
})
export class ClaimDataComponent implements OnInit {

  errors: {
    claimGDPN: FieldError[];
    patientInfoErrors: FieldError[];
    physicianErrors: FieldError[];
    genInfoErrors: FieldError[];
    diagnosisErrors: FieldError[];
    invoicesErrors: FieldError[];
  };

  pageMode:ClaimPageMode;
  pageType:ClaimPageType;

  isInpatientClaim:Boolean;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getPageMode).subscribe(mode => this.pageMode = mode);
    this.store.select(getPageType).subscribe(type => this.pageType = type);
    this.store.select(getClaimObjectErrors).subscribe(errors => this.errors = errors);
    this.store.select(getCaseType).subscribe(type => this.isInpatientClaim = (type == 'INPATIENT'))
  }

  changeTab(event: MatTabChangeEvent) {
    this.store.dispatch(changeSelectedTab({ tab: event.index }));
  }

  genInfoTabHasErrors() {
    if (this.errors != null) {
      return this.errors.genInfoErrors.length > 0;
    }
    return false;
  }

  diagnosisTabHasErrors() {
    if (this.errors != null) {
      return this.errors.diagnosisErrors.length > 0;
    }
    return false;
  }

  invoiceServicesTabHasErrors() {
    if (this.errors != null) {
      return this.errors.invoicesErrors.length > 0;
    }
    return false;
  }
}
