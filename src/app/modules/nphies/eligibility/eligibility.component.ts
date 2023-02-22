import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { EligibilityRequestModel } from 'src/app/models/nphies/eligibilityRequestModel';
import { EligibilityResponseModel } from 'src/app/models/nphies/eligibilityResponseModel';
import { Payer } from 'src/app/models/nphies/payer';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { ProvidersNphiesEligibilityService } from 'src/app/services/providersNphiesEligibilitiyService/providers-nphies-eligibility.service';
import { SharedServices } from 'src/app/services/shared.services';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-eligibility',
  templateUrl: './eligibility.component.html',
  styles: []
})
export class EligibilityComponent implements OnInit, AfterContentInit {

  beneficiarySearchController = new FormControl();
  subscriberSearchController = new FormControl();
  transfer = false;
  isNewBorn = false;

  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  subscriberSearchResult: BeneficiariesSearchResult[] = [];

  payers: Payer[] = [];

  selectedBeneficiary: BeneficiariesSearchResult;
  selectedSubscriber: BeneficiariesSearchResult;
  //
  @Input() claimReuseId: number;

  detailsModel: any = {};
  model: any = {};

  selectedPlanId: string;
  selectedPlanIdError: string;
  serviceDateControl = new FormControl(new Date());
  serviceDateError: string;
  endDateControl = new FormControl();
  endDateError: string;
  selectedPayer: string;
  selectedDestination: string;
  selectedPayerError: string;
  purposeRadioButton: string;
  isBenefits = false;
  isDiscovery = false;
  isValidation = false;
  purposeError: string;
  payerNphiesId: string;
  eligibilityResponseModel: EligibilityResponseModel;

  showDetails = false;
  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private beneficiaryService: ProvidersBeneficiariesService,
    private nphiesSearchService: ProviderNphiesSearchService,
    private sharedServices: SharedServices,
    private datePipe: DatePipe,
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
        });
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

    console.log("test")
    console.log(this.transfer);
  }

  onChangeState(transfer) {
    this.transfer = !transfer;
    console.log(this.transfer);
  }
  onNewBornChangeState(isNewBorn) {
    this.isNewBorn = !isNewBorn;

    if (this.isNewBorn) {
      this.purposeRadioButton = '1';
      this.subscriberSearchController.setValidators([Validators.required]);
      this.subscriberSearchController.updateValueAndValidity();
    } else {
      // tslint:disable-next-line:max-line-length
      if (this.selectedBeneficiary.plans != null && this.selectedBeneficiary.plans instanceof Array && this.selectedBeneficiary.plans.length > 0) {
        this.purposeRadioButton = '1';
        const primaryPlanIndex = this.selectedBeneficiary.plans.findIndex(plan => plan.primary);
        if (primaryPlanIndex != -1) {
          this.selectedPlanId = this.selectedBeneficiary.plans[primaryPlanIndex].planId;
        }
      } else {
        this.purposeRadioButton = '2';
      }
      this.subscriberSearchController.clearValidators();
      this.subscriberSearchController.updateValueAndValidity();
    }
    console.log(this.isNewBorn);
  }

  get IsSubscriberRequired() {
    if (this.isNewBorn) {
      return true;
    } else {
      return false;
    }
  }

  selectPayer(event) {
    this.selectedPayer = event.value.payerNphiesId;
    this.selectedDestination = event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : event.value.payerNphiesId;
  }

  searchBeneficiaries(IsSubscriber = null) {
    let searchStr = '';
    if (!IsSubscriber) {
      searchStr = this.beneficiarySearchController.value;
    } else {
      searchStr = this.subscriberSearchController.value;
    }

    if (searchStr.length > 3) {
      this.nphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, searchStr).subscribe(event => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (body instanceof Array) {

            if (!IsSubscriber) {
              this.beneficiariesSearchResult = body;
            } else {
              this.subscriberSearchResult = body;
            }
          }
        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {

        }
      });
    }
  }

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    this.beneficiarySearchController.setValue(beneficiary.name + ' (' + beneficiary.documentId + ')');
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
    this.subscriberSearchController.setValue('');
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { beneficiary: beneficiary.id }
    });
  }

  selectSubscriber(subscriber: BeneficiariesSearchResult) {
    this.subscriberSearchController.setValue(subscriber.name + ' (' + subscriber.documentId + ')');
    // if (subscriber.plans != null && subscriber.plans instanceof Array && subscriber.plans.length > 0) {
    //   this.purposeRadioButton = '1';
    //   const primaryPlanIndex = subscriber.plans.findIndex(plan => plan.primary);
    //   if (primaryPlanIndex != -1) {
    //     this.selectedPlanId = subscriber.plans[primaryPlanIndex].planId;
    //   }
    // } else {
    //   this.purposeRadioButton = '2';
    // }
    this.selectedSubscriber = subscriber;
    // this.router.navigate([], {
    //   relativeTo: this.activatedRoute,
    //   queryParams: { beneficiary: subscriber.id }
    // })
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

  checkNewBornValidation() {

    if (this.isNewBorn) {
      let serviceDate = new Date(this.serviceDateControl.value);
      if (this.endDateControl.value) {
        serviceDate = new Date(this.endDateControl.value);
      }
      const dob = new Date(this.selectedBeneficiary.dob);
      if (serviceDate < dob) {
        if (this.endDateControl.value) {
          // tslint:disable-next-line:max-line-length
          this.dialogService.showMessage('Error', 'Service Period End Date cannot be less than New Born Date of Birth (dob: ' + this.datePipe.transform(dob, 'dd-MM-yyyy') + ')', 'alert', true, 'OK');
        } else {
          // tslint:disable-next-line:max-line-length
          this.dialogService.showMessage('Error', 'Service Date cannot be less than New Born Date of Birth (dob: ' + this.datePipe.transform(dob, 'dd-MM-yyyy') + ')', 'alert', true, 'OK');
        }

        return false;
      } else {
        const diff = this.daysDiff(dob, serviceDate);
        if (diff > 90) {
          if (this.endDateControl.value) {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', 'Difference between Service Period End Date and New Born Date of Birth cannot be greater than 90 days (Newborn DOB: ' + this.datePipe.transform(dob, 'dd-MM-yyyy') + ')', 'alert', true, 'OK');
          } else {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', 'Difference between Service Period Date and New Born Date of Birth cannot be greater than 90 days (Newborn DOB: ' + this.datePipe.transform(dob, 'dd-MM-yyyy') + ')', 'alert', true, 'OK');
          }

          return false;
        } else {
          return true;
        }
      }

    } else {
      return true;
    }
  }

  daysDiff(d1, d2) {
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  sendRequest() {
    if (this.selectedBeneficiary == null || this.sharedServices.loading) {
      return;
    }

    if (this.isNewBorn && !this.selectedSubscriber) {
      this.subscriberSearchController.markAsTouched();
      return;
    }

    if (!this.checkNewBornValidation()) {
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

      if (this.selectedPayer == null) {
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

    const tempbeneficiary = this.selectedBeneficiary;
    tempbeneficiary.plans.forEach(x => x.payerId = x.payerNphiesId);
    const request: EligibilityRequestModel = {
      isNewBorn: this.isNewBorn,
      beneficiary: this.selectedBeneficiary,
      subscriber: this.isNewBorn ? this.selectedSubscriber : null,
      // tslint:disable-next-line:max-line-length
      insurancePlan: this.purposeRadioButton == '1' ? this.selectedBeneficiary.plans.find(plan => plan.planId == this.selectedPlanId) : { payerId: this.selectedPayer, coverageType: null, expiryDate: null, memberCardId: null, policyNumber: null, relationWithSubscriber: null, maxLimit: null, patientShare: null, payerNphiesId: null, tpaNphiesId: null, issueDate:null, networkId: null, sponsorNumber: null, policyClassName: null, policyHolder:null, insuranceStatus:null, insuranceDuration:null, insuranceType: null },
      serviceDate: moment(this.serviceDateControl.value).format('YYYY-MM-DD'),
      toDate: this._isValidDate(this.endDateControl.value) ? moment(this.endDateControl.value).format('YYYY-MM-DD') : null,
      benefits: this.isBenefits,
      discovery: this.isDiscovery,
      validation: this.isValidation,
      transfer: this.transfer,
      // tslint:disable-next-line:max-line-length
      destinationId: this.purposeRadioButton == '1' ? this.selectedBeneficiary.plans.find(plan => plan.planId == this.selectedPlanId).tpaNphiesId : this.selectedDestination
    };

    this.eligibilityService.sendEligibilityRequest(this.sharedServices.providerId, request).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        this.eligibilityResponseModel = event.body as EligibilityResponseModel;
        this.showDetails = true;
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        // tslint:disable-next-line:max-line-length
        this.dialogService.showMessage(errorEvent.error.message, 'Transaction Id: ' + errorEvent.error.transactionId, 'alert', true, 'OK', errorEvent.error.errors);
        // this.dialog.open(ApiErrorsDialogComponent, {
        //   panelClass: ['primary-dialog', 'dialog-lg'],
        //   data: errorEvent.error
        // });
      }
    });
  }


  private _isValidDate(date): boolean {
    return date != null && !Number.isNaN(new Date(moment(date).format('YYYY-MM-DD')).getTime());
  }

}
