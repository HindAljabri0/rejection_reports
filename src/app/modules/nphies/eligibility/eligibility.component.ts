import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ViewEligibilityDetailsComponent } from '../view-eligibility-details/view-eligibility-details.component';

@Component({
  selector: 'app-eligibility',
  templateUrl: './eligibility.component.html',
  styles: []
})
export class EligibilityComponent implements OnInit {

  beneficiarySearchController = new FormControl();

  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];

  selectedBeneficiary: BeneficiariesSearchResult;
  selectedPlanId: string;

  showDetails = false;
  constructor(
    private dialog: MatDialog,
    private beneficiaryService: ProvidersBeneficiariesService,
    private sharedServices: SharedServices,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  searchBeneficiaries() {
    this.beneficiaryService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.beneficiarySearchController.value).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.beneficiariesSearchResult = body;
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
    })
  }

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    const primaryPlanIndex = beneficiary.plans.findIndex(plan => plan.primary);
    if (primaryPlanIndex != -1) {
      this.selectedPlanId = beneficiary.plans[primaryPlanIndex].planId;
    }
    this.selectedBeneficiary = beneficiary;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {beneficiary: beneficiary.id}
    })
  }

  isPlanExpired(date: Date) {
    if (date != null) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      return date.getTime() > Date.now() ? ' (Active)' : ' (Expired)';
    }
    return '';
  }

}
