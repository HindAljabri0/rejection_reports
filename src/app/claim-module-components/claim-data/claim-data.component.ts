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
  getClaim,
  getRetrievedClaimProps
} from '../store/claim.reducer';
import { Claim } from '../models/claim.model';
import { RetrievedClaimProps } from '../models/retrievedClaimProps.model';
import { HttpResponse } from '@angular/common/http';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'claim-data',
  templateUrl: './claim-data.component.html',
  styles: []
})
export class ClaimDataComponent implements OnInit {

  errors: {
    uncategorised: FieldError[],
    genInfoErrors: FieldError[],
    admissionErrors: FieldError[],
    invoicesErrors: FieldError[],
    vitalSignsErrors: FieldError[],
    diagnosisErrors: FieldError[],
    illnessErrors: FieldError[],
    labResultsErrors: FieldError[]
  };

  pageMode: ClaimPageMode;
  pageType: ClaimPageType;

  isInpatientClaim: boolean;
  @Input() claimType = '';
  claim: Claim;
  claimProps: RetrievedClaimProps;
  isPBMValidationVisible = false;

  constructor(private store: Store, private adminService: AdminService, private commen: SharedServices) { }

  ngOnInit() {
    this.store.select(getPageMode).subscribe(mode => this.pageMode = mode);
    this.store.select(getPageType).subscribe(type => this.pageType = type);
    this.store.select(getClaimObjectErrors).subscribe(errors => this.errors = errors);
    this.store.select(getCaseType).subscribe(type => this.isInpatientClaim = (type == 'INPATIENT')||(type == 'OUTPATIENT'));

    this.store.select(getClaim).subscribe(claim => this.claim = claim);
    this.store.select(getRetrievedClaimProps).subscribe(props => this.claimProps = props);
    this.getPBMValidation();
  }

  changeTab(event: MatTabChangeEvent) {
    this.store.dispatch(changeSelectedTab({
      tab: event.tab.textLabel.replace('&', '').split(' ').filter(str => str.length > 0).join('_').toUpperCase()
    }));
  }

  genInfoTabHasErrors() {
    if (this.errors != null && this.errors.genInfoErrors != null) {
      return this.errors.genInfoErrors.length > 0;
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
    if (this.errors != null) {
      return this.errors.admissionErrors.length > 0;
    }
    return false;
  }

  labResultsTabHasErrors() {
    if (this.errors != null && this.errors.labResultsErrors != null) {
      return this.errors.labResultsErrors.length > 0;
    }
    return false;
  }

  illnessTabHasErrors() {
    if (this.errors != null && this.errors.illnessErrors != null) {
      return this.errors.illnessErrors.length > 0;
    }
    return false;
  }

  vitalSignsTabHasErrors() {
    if (this.errors != null && this.errors.vitalSignsErrors != null) {
      return this.errors.vitalSignsErrors.length > 0;
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

  getPBMValidation() {
    this.adminService.checkIfPBMValidationIsEnabled(this.commen.providerId, '101').subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const body = event['body'];
        // this.isPBMValidationVisible = body.value === "1"
        // && this.claimProps.statusCode.toLowerCase() === ClaimStatus.Accepted.toLowerCase() ? true : false;
        this.isPBMValidationVisible = body.value === '1'
          && (this.claimProps.statusCode.toLowerCase() === ClaimStatus.Accepted.toLowerCase()
            || this.claimProps.statusCode.toLowerCase() === ClaimStatus.Downloadable.toLowerCase()) ? true : false;
      }
    }, err => {
      console.log(err);
    });

  }
}
