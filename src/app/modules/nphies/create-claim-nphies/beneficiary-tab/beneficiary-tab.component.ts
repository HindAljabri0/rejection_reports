import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { Payer } from 'src/app/models/nphies/payer';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-beneficiary-tab',
  templateUrl: './beneficiary-tab.component.html',
  styles: []
})
export class BeneficiaryTabComponent implements OnInit {

  @Input() pageMode: string;
  @Input() isSubmitted = false;
  @Input() FormNphiesClaim: FormGroup;
  @Input() selectedBeneficiary: BeneficiariesSearchResult;
  @Output() emitSelectedBenificiary = new EventEmitter();

  // tslint:disable-next-line:variable-name
  _onDestroy = new Subject<void>();
  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  selectedPlanId: string;
  selectedPlanIdError: string;

  filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  filteredCountry: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allMaritalStatuses: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allBloodType: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allSubscriberRelationship: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);

  selectedNationality = '';
  selectedCountry = '';
  nationalities = nationalities;
  insurancePlans = [];

  payersList: Payer[] = [];
  // subscriberRelationship: { Code: string, Name: string }[] = [
  //   { Code: 'CHILD', Name: 'Child' },
  //   { Code: 'PARENT', Name: 'Parent' },
  //   { Code: 'SPOUSE', Name: 'Spouse' },
  //   { Code: 'COMMON', Name: 'Common Law Spouse' },
  //   { Code: 'SELF', Name: 'Self' },
  //   { Code: 'INJURED', Name: 'Injured Party' },
  //   { Code: 'OTHER', Name: 'Other' },
  // ];

  subscriberRelationship: { Code: string, Name: string }[] = [
    { Code: 'child', Name: 'Child' },
    { Code: 'parent', Name: 'Parent' },
    { Code: 'spouse', Name: 'Spouse' },
    { Code: 'common', Name: 'Common Law Spouse' },
    { Code: 'self', Name: 'Self' },
    { Code: 'injured', Name: 'Injured Party' },
    { Code: 'other', Name: 'Other' },
  ];

  maritalStatuses: { Code: string, Name: string }[] = [
    { Code: 'D', Name: 'Divorced' },
    { Code: 'L', Name: 'Legally Separated' },
    { Code: 'M', Name: 'Married' },
    { Code: 'U', Name: 'Un Married' },
    { Code: 'W', Name: 'Widowed' }];

  // bloodGroup: { Code: string, Name: string }[] = [
  //   { Code: 'O_PLUS', Name: 'O+' },
  //   { Code: 'O_MINUS', Name: 'O-' },
  //   { Code: 'A_PLUS', Name: 'A+' },
  //   { Code: 'A_MINUS', Name: 'A-' },
  //   { Code: 'B_PLUS', Name: 'B+' },
  //   { Code: 'B_MINUS', Name: 'B-' },
  //   { Code: 'AB_PLUS', Name: 'AB+' },
  //   { Code: 'AB_MINUS', Name: 'AB-' },
  // ];

  bloodGroup: { Code: string, Name: string }[] = [
    { Code: 'O+', Name: 'O+' },
    { Code: 'O-', Name: 'O-' },
    { Code: 'A+', Name: 'A+' },
    { Code: 'A-', Name: 'A-' },
    { Code: 'B+', Name: 'B+' },
    { Code: 'B-', Name: 'B-' },
    { Code: 'AB+', Name: 'AB+' },
    { Code: 'AB-', Name: 'AB-' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private providersBeneficiariesService: ProvidersBeneficiariesService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private sharedServices: SharedServices) { }

  ngOnInit() {
    this.filteredNations.next(this.nationalities.slice());
    this.filteredCountry.next(this.nationalities.slice());
    this.allMaritalStatuses.next(this.maritalStatuses.slice());
    this.allBloodType.next(this.bloodGroup.slice());
    this.allSubscriberRelationship.next(this.subscriberRelationship.slice());

    if (this.pageMode === 'EDIT') {
      const model: any = {};
      model.coverageType = this.FormNphiesClaim.controls.insurancePlanCoverageType.value;
      model.expiryDate = this.FormNphiesClaim.controls.insurancePlanExpiryDate.value;
      model.memberCardId = this.FormNphiesClaim.controls.insurancePlanMemberCardId.value;
      model.payerId = this.FormNphiesClaim.controls.insurancePlanPayerId.value;
      model.primary = this.FormNphiesClaim.controls.insurancePrimary.value;
      model.relationWithSubscriber = this.FormNphiesClaim.controls.insurancePlanRelationWithSubscriber.value;

      this.insurancePlans.push(model);
    }
    this.getPayers();

    this.FormNphiesClaim.controls.nationality.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterNationality();
      });

    this.FormNphiesClaim.controls.bCountry.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCountry();
      });
  }

  getPayers() {
    this.providersBeneficiariesService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array) {
          this.payersList = event.body as Payer[];
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        console.log(err.message);
      }
    });
  }

  searchBeneficiaries() {
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormNphiesClaim.controls.beneficiaryName.value).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.beneficiariesSearchResult = body;
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    this.selectedBeneficiary = beneficiary;
    this.FormNphiesClaim.patchValue({
      beneficiaryName: beneficiary.name + ' (' + beneficiary.documentId + ')',
      beneficiaryId: beneficiary.id,

      firstName: beneficiary.firstName ? beneficiary.firstName : '',
      middleName: beneficiary.secondName ? beneficiary.secondName : '',
      lastName: beneficiary.thirdName ? beneficiary.thirdName : '',
      familyName: beneficiary.familyName ? beneficiary.familyName : '',
      fullName: beneficiary.fullName ? beneficiary.fullName : '',
      beneficiaryFileld: beneficiary.fileId ? beneficiary.fileId : '',
      dob: beneficiary.dob ? beneficiary.dob : '',
      gender: beneficiary.gender ? beneficiary.gender : '',
      documentType: beneficiary.documentType ? beneficiary.documentType : '',
      documentId: beneficiary.documentId ? beneficiary.documentId : '',
      eHealthId: beneficiary.eHealthId ? beneficiary.eHealthId : '',
      nationality: beneficiary.nationality ? beneficiary.nationality : '',
      // tslint:disable-next-line:max-line-length
      nationalityName: beneficiary.nationality ? (nationalities.filter(x => x.Code === beneficiary.nationality)[0] ? nationalities.filter(x => x.Code === beneficiary.nationality)[0].Name : '') : '',
      residencyType: beneficiary.residencyType ? beneficiary.residencyType : '',
      contactNumber: beneficiary.contactNumber ? beneficiary.contactNumber : '',
      martialStatus: beneficiary.maritalStatus ? beneficiary.maritalStatus : '',
      bloodGroup: beneficiary.bloodGroup ? beneficiary.bloodGroup : '',
      preferredLanguage: beneficiary.preferredLanguage ? beneficiary.preferredLanguage : '',
      emergencyNumber: beneficiary.emergencyPhoneNumber ? beneficiary.emergencyPhoneNumber : '',
      email: beneficiary.email ? beneficiary.email : '',
      addressLine: beneficiary.addressLine ? beneficiary.addressLine : '',
      streetLine: beneficiary.streetLine ? beneficiary.streetLine : '',
      bcity: beneficiary.city ? beneficiary.city : '',
      bstate: beneficiary.state ? beneficiary.state : '',
      bcountry: beneficiary.country ? beneficiary.country : '',
      // tslint:disable-next-line:max-line-length
      bcountryName: beneficiary.country ? (this.nationalities.filter(x => x.Name.toLowerCase() === beneficiary.country.toLowerCase())[0] ? this.nationalities.filter(x => x.Name.toLowerCase() == beneficiary.country.toLowerCase())[0].Name : '') : '',
      postalCode: beneficiary.postalCode ? beneficiary.postalCode : '',
    });
    this.emitSelectedBenificiary.emit(this.selectedBeneficiary);
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

  selectPlan(plan) {
    this.insurancePlans = [];
    if (this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0]) {
      this.insurancePlans.push(this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0]);

      this.FormNphiesClaim.controls.insurancePlanPayerId.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].payerNphiesId, 10);
      this.FormNphiesClaim.controls.insurancePlanExpiryDate.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].expiryDate);
      this.FormNphiesClaim.controls.insurancePlanMemberCardId.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].memberCardId);
      this.FormNphiesClaim.controls.insurancePlanRelationWithSubscriber.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].relationWithSubscriber);
      this.FormNphiesClaim.controls.insurancePlanCoverageType.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].coverageType);
      // this.FormNphiesClaim.controls.insurancePlanPayerId.disable();
    }
  }

  filterNationality() {
    if (!this.nationalities) {
      return;
    }
    let search = this.FormNphiesClaim.controls.nationality.value;
    if (!search) {
      this.filteredNations.next(this.nationalities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredNations.next(
      this.nationalities.filter(nation => nation.Name.toLowerCase().indexOf(search) > -1)
    );
  }

  filterCountry() {
    if (!this.nationalities) {
      return;
    }
    let search = this.FormNphiesClaim.controls.bcountry.value;
    if (!search) {
      this.filteredCountry.next(this.nationalities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCountry.next(
      this.nationalities.filter(nation => nation.Name.toLowerCase().indexOf(search) > -1)
    );
  }

  getPayerName(PayerId: string) {
    for (const payer of this.payersList) {
      if (payer.payerId == PayerId) {
        return payer.englistName;
      }
    }

  }

  selectedPayer(payerId: string) {
    for (const payer of this.payersList) {
      if (payer.payerId == payerId) {
        return payer.englistName + '(' + payer.arabicName + ')';
      }
    }
  }

}
