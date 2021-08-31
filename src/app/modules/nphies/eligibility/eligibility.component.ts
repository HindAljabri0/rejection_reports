import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { EligibilityRequestModel } from 'src/app/models/nphies/eligibilityRequestModel';
import { EligibilityResponseModel } from 'src/app/models/nphies/eligibilityResponseModel';
import { Payer } from 'src/app/models/nphies/payer';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { ProvidersNphiesEligibilityService } from 'src/app/services/providersNphiesEligibilitiyService/providers-nphies-eligibility.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-eligibility',
  templateUrl: './eligibility.component.html',
  styles: []
})
export class EligibilityComponent implements OnInit, AfterContentInit {

  beneficiarySearchController = new FormControl();

  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];

  payers: Payer[] = [];

  selectedBeneficiary: BeneficiariesSearchResult;

  selectedPlanId: string;
  selectedPlanIdError: string;
  serviceDateControl = new FormControl();
  serviceDateError: string;
  endDateControl = new FormControl();
  endDateError: string;
  selectedPayer: string;
  selectedPayerError: string;
  purposeRadioButton: string;
  isBenefits = false;
  isDiscovery = false;
  isValidation = false;
  purposeError: string;
  payerNphiesId: string;

  showDetails = false;
  constructor(
    private dialogService: DialogService,
    private dialog: MatDialog,
    private beneficiaryService: ProvidersBeneficiariesService,
    private nphiesSearchService: ProviderNphiesSearchService,
    private sharedServices: SharedServices,
    private eligibilityService: ProvidersNphiesEligibilityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }


  ngAfterContentInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const beneficiaryId = params.beneficiary;
      if (beneficiaryId != null && beneficiaryId.trim().length > 0) {
        this.sharedServices.loadingChanged.next(true);
        this.beneficiaryService.getBeneficiaryById(this.sharedServices.providerId, beneficiaryId, true).subscribe(event => {
          if (event instanceof HttpResponse) {
            this.sharedServices.loadingChanged.next(false);
            try {
              this.selectBeneficiary(event.body as BeneficiariesSearchResult);
            } catch (e) {
              console.log(e);
            }
          }
        }, errorEvent => {
          this.sharedServices.loadingChanged.next(false);
          if (errorEvent instanceof HttpErrorResponse) {

          }
        })
      }
    }).unsubscribe();
  }

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.beneficiaryService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        const body = event.body;
        if (body instanceof Array) {
          this.payers = body;
        }
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {

      }
    })
  }

  searchBeneficiaries() {
    this.nphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.beneficiarySearchController.value).subscribe(event => {
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
    if (beneficiary.plans != null && beneficiary.plans instanceof Array && beneficiary.plans.length > 0) {
      this.purposeRadioButton = '1';
      const primaryPlanIndex = beneficiary.plans.findIndex(plan => plan.primary);
      if (primaryPlanIndex != -1) {
        this.selectedPlanId = beneficiary.plans[primaryPlanIndex].planId;
      }
    } else {
      this.purposeRadioButton = '2';
    }
    this.selectedBeneficiary = beneficiary;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { beneficiary: beneficiary.id }
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

  eligibilityResponseModel: EligibilityResponseModel = null;

  sendRequest() {
    if (this.selectedBeneficiary == null || this.sharedServices.loading) {
      return;
    }
    this.sharedServices.loadingChanged.next(true);
    let requestHasErrors = false;
    this.selectedPlanIdError = null;
    this.selectedPayerError = null;
    this.serviceDateError = null;
    this.endDateError = null;
    this.purposeError = null;

    if (this.purposeRadioButton == '1') {
      this.isDiscovery = false;
      if (this.selectedBeneficiary.plans == null || this.selectedBeneficiary.plans.length == 0) {
        this.selectedPlanIdError = "Selected beneficiary does not have any insurance plan.";
        requestHasErrors = true;
      }
      if (this.selectedPlanId == null || this.selectedBeneficiary.plans.findIndex(plan => plan.planId == this.selectedPlanId) == -1) {
        this.selectedPlanIdError = "Please select an insurance plan first";
        requestHasErrors = true;
      }
      if (!this.isBenefits && !this.isValidation) {
        this.purposeError = "Select at least one purpose for this request."
        requestHasErrors = true;
      }
    } else {
      this.isDiscovery = true;
      this.isBenefits = false;
      this.isValidation = false;
      if (this.selectedPayer == null || this.payers.findIndex(payer => payer.nphiesId == this.selectedPayer) == -1) {
        this.selectedPayerError = "Please select a payer first";
        requestHasErrors = true;
      }
    }

    if (!this._isValidDate(this.serviceDateControl.value)) {
      this.serviceDateError = "Please select a valid service date";
      requestHasErrors = true;
    }
    if (this._isValidDate(this.endDateControl.value) && this._isValidDate(this.serviceDateControl)) {
      const startDate: Date = new Date(this.serviceDateControl.value);
      const endDate: Date = new Date(this.endDateControl.value)
      if (startDate.getTime() > endDate.getTime()) {
        this.serviceDateError = "service date should be before the to date.";
        this.endDateError = "To date should be after service date.";
        requestHasErrors = true;
      }
    }


    if (requestHasErrors) {
      this.sharedServices.loadingChanged.next(false);
      return;
    }

    const request: EligibilityRequestModel = {
      beneficiaryId: this.selectedBeneficiary.id,
      memberCardId: this.purposeRadioButton == '1'? this.selectedBeneficiary.plans.find(plan => plan.planId == this.selectedPlanId).memberCardId : null,
      serviceDate: moment(this.serviceDateControl.value).format('YYYY-MM-DD'),
      toDate: this._isValidDate(this.endDateControl.value) ? moment(this.endDateControl.value).format('YYYY-MM-DD') : null,
      payerNphiesId: this.purposeRadioButton == '1'? this.selectedBeneficiary.plans.find(plan => plan.planId == this.selectedPlanId).payerNphiesId : this.selectedPayer,
      benefits: this.isBenefits,
      discovery: this.isDiscovery,
      validation: this.isValidation
    }



    this.eligibilityService.sendEligibilityRequest(this.sharedServices.providerId, request).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        this.eligibilityResponseModel = event.body as EligibilityResponseModel
        this.showDetails = true;
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: errorEvent.message,
          isError: true
        });
      }
    });
  }


  private _isValidDate(date): boolean {
    return date != null && !Number.isNaN(new Date(moment(date).format('YYYY-MM-DD')).getTime());
  }

}
