import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { Payer } from 'src/app/models/nphies/payer';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-beneficiary-tab',
  templateUrl: './beneficiary-tab.component.html',
  styles: []
})
export class BeneficiaryTabComponent implements OnInit, OnChanges {

  @Input() IsNewBorn = false;
  @Input() IsSubscriber = false;
  @Input() otherDataModel: any;
  @Input() pageMode: string;
  @Input() isSubmitted = false;
  @Input() FormNphiesClaim: FormGroup;
  @Input() selectedBeneficiary: BeneficiariesSearchResult;
  @Output() emitSelectedBenificiary = new EventEmitter();
  @Output() emitNewBornStatus = new EventEmitter();

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
    { Code: 'U', Name: 'Unmarried' },
    { Code: 'W', Name: 'Widowed' }];

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

  genders: { Code: string, Name: string }[] = [
    { Code: 'MALE', Name: 'Male' },
    { Code: 'FEMALE', Name: 'Female' },
    { Code: 'UNKNOWN', Name: 'unknown' },
    { Code: 'U', Name: 'Undetermined' },
    { Code: 'N', Name: 'Undifferentiated' },
    { Code: 'A', Name: 'Sex changed to Male' },
    { Code: 'B', Name: 'Sex changed to female' },
    { Code: 'C', Name: 'Not Completed' }
  ];

  documentTypes: { Code: string, Name: string }[] = [
    { Code: 'PRC', Name: 'Resident Card' },
    { Code: 'PPN', Name: 'Passport' },
    { Code: 'VP', Name: 'Visa' },
    { Code: 'NI', Name: 'National Card' },
    { Code: 'MR', Name: 'Medical Record Number' }
  ];

  recedencetypes: { Code: string, Name: string }[] = [
    { Code: 'visitor', Name: 'Visitor' },
    { Code: 'dependent', Name: 'Dependent' },
    { Code: 'citizen', Name: 'Citizen or Resident' }
  ];

  preferredLanguages: { Code: string, Name: string }[] = [
    { Code: 'EN', Name: 'English' },
    { Code: 'AR', Name: 'Arabic' }
  ];

  coverageTypes: { Code: string, Name: string }[] = [
    { Code: 'EHCPOL', Name: 'Extended healthcare' },
    { Code: 'PUBLICPOL', Name: 'Public healthcare' }
  ];

  IsLoading = true;

  constructor(
    private formBuilder: FormBuilder,
    private providersBeneficiariesService: ProvidersBeneficiariesService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private sharedServices: SharedServices) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.IsSubscriber) {
      if (changes.IsNewBorn && changes.IsNewBorn.previousValue !== changes.IsNewBorn.currentValue) {
        this.updateValidations();
      }
    }
  }

  ngOnInit() {
    this.getPayers();

    if (this.pageMode === 'CREATE' || this.pageMode === 'EDIT' || this.pageMode === 'RESUBMIT') {
      this.filteredNations.next(this.nationalities.slice());
      this.filteredCountry.next(this.nationalities.slice());
      this.allMaritalStatuses.next(this.maritalStatuses.slice());
      this.allBloodType.next(this.bloodGroup.slice());
      this.allSubscriberRelationship.next(this.subscriberRelationship.slice());

      if (this.pageMode === 'EDIT' || this.pageMode === 'RESUBMIT') {
        const model: any = {};
        model.coverageType = this.FormNphiesClaim.controls.insurancePlanCoverageType.value;
        model.expiryDate = this.FormNphiesClaim.controls.insurancePlanExpiryDate.value;
        model.memberCardId = this.FormNphiesClaim.controls.insurancePlanMemberCardId.value;
        model.policyNumber = this.FormNphiesClaim.controls.insurancePlanPolicyNumber.value;
        model.payerId = this.FormNphiesClaim.controls.insurancePlanPayerId.value;
        model.primary = this.FormNphiesClaim.controls.insurancePlanPrimary.value;
        model.relationWithSubscriber = this.FormNphiesClaim.controls.insurancePlanRelationWithSubscriber.value;
        model.maxLimit = this.FormNphiesClaim.controls.insurancePlanPrimary.value;
        model.patientShare = this.FormNphiesClaim.controls.insurancePlanRelationWithSubscriber.value;
        this.insurancePlans.push(model);
      }

      this.FormNphiesClaim.controls.nationality.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterNationality();
        });

      this.FormNphiesClaim.controls.bcountry.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterCountry();
        });

    }
  }

  updateValidations() {
    if (this.IsSubscriber) {

      if (this.IsNewBorn) {
        this.FormNphiesClaim.controls.beneficiaryName.setValidators(Validators.required);
        this.FormNphiesClaim.controls.beneficiaryName.updateValueAndValidity();
        this.setValidators();
      } else {
        if (this.selectedBeneficiary && this.selectedBeneficiary.name) {
          this.setValidators();
        } else {
          this.removeValidators();
        }

      }
    }
  }

  setValidators() {
    this.FormNphiesClaim.controls.beneficiaryId.setValidators(Validators.required);
    this.FormNphiesClaim.controls.beneficiaryId.updateValueAndValidity();

    this.FormNphiesClaim.controls.fullName.setValidators(Validators.required);
    this.FormNphiesClaim.controls.fullName.updateValueAndValidity();

    this.FormNphiesClaim.controls.dob.setValidators(Validators.required);
    this.FormNphiesClaim.controls.dob.updateValueAndValidity();

    this.FormNphiesClaim.controls.gender.setValidators(Validators.required);
    this.FormNphiesClaim.controls.gender.updateValueAndValidity();

    this.FormNphiesClaim.controls.documentType.setValidators(Validators.required);
    this.FormNphiesClaim.controls.documentType.updateValueAndValidity();

    this.FormNphiesClaim.controls.documentId.setValidators(Validators.required);
    this.FormNphiesClaim.controls.documentId.updateValueAndValidity();

  }

  removeValidators() {
    this.FormNphiesClaim.controls.beneficiaryName.clearValidators();
    this.FormNphiesClaim.controls.beneficiaryName.updateValueAndValidity();

    this.FormNphiesClaim.controls.beneficiaryId.clearValidators();
    this.FormNphiesClaim.controls.beneficiaryId.updateValueAndValidity();

    this.FormNphiesClaim.controls.fullName.clearValidators();
    this.FormNphiesClaim.controls.fullName.updateValueAndValidity();

    this.FormNphiesClaim.controls.dob.clearValidators();
    this.FormNphiesClaim.controls.dob.updateValueAndValidity();

    this.FormNphiesClaim.controls.gender.clearValidators();
    this.FormNphiesClaim.controls.gender.updateValueAndValidity();

    this.FormNphiesClaim.controls.documentType.clearValidators();
    this.FormNphiesClaim.controls.documentType.updateValueAndValidity();

    this.FormNphiesClaim.controls.documentId.clearValidators();
    this.FormNphiesClaim.controls.documentId.updateValueAndValidity();

  }

  getPayers() {
    this.providersBeneficiariesService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array) {
          this.payersList = event.body as Payer[];
          if (this.pageMode === 'VIEW' && this.otherDataModel && this.otherDataModel.beneficiary) {
            this.setData();
          } else {
            this.IsLoading = false;
          }
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        console.log(err.message);
      }
    });
  }

  setData() {

    this.otherDataModel.beneficiary.dobLabel = moment(this.otherDataModel.beneficiary.dob, 'YYYY-MM-DD').format('DD-MM-YYYY');
    // tslint:disable-next-line:max-line-length
    this.otherDataModel.beneficiary.genderName = this.genders.filter(x => x.Code === this.otherDataModel.beneficiary.gender)[0] ? this.genders.filter(x => x.Code === this.otherDataModel.beneficiary.gender)[0].Name : '-';
    // tslint:disable-next-line:max-line-length
    this.otherDataModel.beneficiary.documentTypeName = this.documentTypes.filter(x => x.Code === this.otherDataModel.beneficiary.documentType)[0] ? this.documentTypes.filter(x => x.Code === this.otherDataModel.beneficiary.documentType)[0].Name : '-';
    // tslint:disable-next-line:max-line-length
    this.otherDataModel.beneficiary.nationalityName = this.nationalities.filter(x => x.Code === this.otherDataModel.beneficiary.nationality)[0] ? this.nationalities.filter(x => x.Code === this.otherDataModel.beneficiary.nationality)[0].Name : '-';
    // tslint:disable-next-line:max-line-length
    this.otherDataModel.beneficiary.residencyTypeName = this.recedencetypes.filter(x => x.Code === this.otherDataModel.beneficiary.residencyType)[0] ? this.recedencetypes.filter(x => x.Code === this.otherDataModel.beneficiary.residencyType)[0].Name : '-';
    // tslint:disable-next-line:max-line-length
    this.otherDataModel.beneficiary.maritalStatusName = this.maritalStatuses.filter(x => x.Code === this.otherDataModel.beneficiary.maritalStatus)[0] ? this.maritalStatuses.filter(x => x.Code === this.otherDataModel.beneficiary.maritalStatus)[0].Name : '-';
    // tslint:disable-next-line:max-line-length
    this.otherDataModel.beneficiary.bloodGroupName = this.bloodGroup.filter(x => x.Code === this.otherDataModel.beneficiary.bloodGroup)[0] ? this.bloodGroup.filter(x => x.Code === this.otherDataModel.beneficiary.bloodGroup)[0].Name : '-';
    // tslint:disable-next-line:max-line-length
    this.otherDataModel.beneficiary.preferredLanguageName = this.preferredLanguages.filter(x => x.Code === this.otherDataModel.beneficiary.preferredLanguage)[0] ? this.preferredLanguages.filter(x => x.Code === this.otherDataModel.beneficiary.preferredLanguage)[0].Name : '-';

    if (this.otherDataModel.beneficiary.country) {
      // tslint:disable-next-line:max-line-length
      this.otherDataModel.beneficiary.countryName = this.nationalities.filter(x => x.Name.toLowerCase() === this.otherDataModel.beneficiary.country.toLowerCase())[0] ? this.nationalities.filter(x => x.Name.toLowerCase() === this.otherDataModel.beneficiary.country.toLowerCase())[0].Name : '-';
    }

    if (this.otherDataModel.beneficiary.insurancePlan) {

      if (this.otherDataModel.beneficiary.insurancePlan.payerId) {
        this.otherDataModel.beneficiary.insurancePlan.payerName = this.payersList.filter(x => x.nphiesId === this.otherDataModel.beneficiary.insurancePlan.payerId)[0] ? (this.payersList.filter(x => x.nphiesId === this.otherDataModel.beneficiary.insurancePlan.payerId)[0].englistName + ' (' + this.payersList.filter(x => x.nphiesId === this.otherDataModel.beneficiary.insurancePlan.payerId)[0].arabicName + ')') : '-';
      }

      if (this.otherDataModel.beneficiary.insurancePlan.relationWithSubscriber) {
        this.otherDataModel.beneficiary.insurancePlan.relationWithSubscriberName = this.subscriberRelationship.filter(x => x.Code.toLowerCase() === this.otherDataModel.beneficiary.insurancePlan.relationWithSubscriber.toLowerCase())[0] ? this.subscriberRelationship.filter(x => x.Code.toLowerCase() === this.otherDataModel.beneficiary.insurancePlan.relationWithSubscriber.toLowerCase())[0].Name : '-';
      }

      if (this.otherDataModel.beneficiary.insurancePlan.coverageType) {
        this.otherDataModel.beneficiary.insurancePlan.coverageTypeName = this.coverageTypes.filter(x => x.Code.toLowerCase() === this.otherDataModel.beneficiary.insurancePlan.coverageType.toLowerCase())[0] ? this.coverageTypes.filter(x => x.Code.toLowerCase() === this.otherDataModel.beneficiary.insurancePlan.coverageType.toLowerCase())[0].Name : '-';
      }
    }


    if (this.otherDataModel.subscriber) {
      this.otherDataModel.subscriber.dobLabel = moment(this.otherDataModel.subscriber.dob, 'YYYY-MM-DD').format('DD-MM-YYYY');
      // tslint:disable-next-line:max-line-length
      this.otherDataModel.subscriber.genderName = this.genders.filter(x => x.Code === this.otherDataModel.subscriber.gender)[0] ? this.genders.filter(x => x.Code === this.otherDataModel.subscriber.gender)[0].Name : '-';
      // tslint:disable-next-line:max-line-length
      this.otherDataModel.subscriber.documentTypeName = this.documentTypes.filter(x => x.Code === this.otherDataModel.subscriber.documentType)[0] ? this.documentTypes.filter(x => x.Code === this.otherDataModel.subscriber.documentType)[0].Name : '-';
      // tslint:disable-next-line:max-line-length
      this.otherDataModel.subscriber.nationalityName = this.nationalities.filter(x => x.Code === this.otherDataModel.subscriber.nationality)[0] ? this.nationalities.filter(x => x.Code === this.otherDataModel.subscriber.nationality)[0].Name : '-';
      // tslint:disable-next-line:max-line-length
      this.otherDataModel.subscriber.residencyTypeName = this.recedencetypes.filter(x => x.Code === this.otherDataModel.subscriber.residencyType)[0] ? this.recedencetypes.filter(x => x.Code === this.otherDataModel.subscriber.residencyType)[0].Name : '-';
      // tslint:disable-next-line:max-line-length
      this.otherDataModel.subscriber.maritalStatusName = this.maritalStatuses.filter(x => x.Code === this.otherDataModel.subscriber.maritalStatus)[0] ? this.maritalStatuses.filter(x => x.Code === this.otherDataModel.subscriber.maritalStatus)[0].Name : '-';
      // tslint:disable-next-line:max-line-length
      this.otherDataModel.subscriber.bloodGroupName = this.bloodGroup.filter(x => x.Code === this.otherDataModel.subscriber.bloodGroup)[0] ? this.bloodGroup.filter(x => x.Code === this.otherDataModel.subscriber.bloodGroup)[0].Name : '-';
      // tslint:disable-next-line:max-line-length
      this.otherDataModel.subscriber.preferredLanguageName = this.preferredLanguages.filter(x => x.Code === this.otherDataModel.subscriber.preferredLanguage)[0] ? this.preferredLanguages.filter(x => x.Code === this.otherDataModel.subscriber.preferredLanguage)[0].Name : '-';

      if (this.otherDataModel.subscriber.country) {
        // tslint:disable-next-line:max-line-length
        this.otherDataModel.subscriber.countryName = this.nationalities.filter(x => x.Name.toLowerCase() === this.otherDataModel.subscriber.country.toLowerCase())[0] ? this.nationalities.filter(x => x.Name.toLowerCase() === this.otherDataModel.subscriber.country.toLowerCase())[0].Name : '-';
      }
    }

    this.IsLoading = false;

  }

  searchBeneficiaries() {
    // tslint:disable-next-line:max-line-length
    if (this.FormNphiesClaim.controls.beneficiaryName.value.length > 3) {
      this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, this.FormNphiesClaim.controls.beneficiaryName.value).subscribe(event => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (body instanceof Array) {
            this.beneficiariesSearchResult = body;
            if (!this.FormNphiesClaim.controls.beneficiaryName.value) {
              this.deSelectBeneficiary();
            }
          }
        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {

        }
      });
    }
  }

  deSelectBeneficiary() {
    this.selectedBeneficiary = new BeneficiariesSearchResult();
    this.FormNphiesClaim.controls.beneficiaryName.setValue('');
    this.FormNphiesClaim.controls.beneficiaryId.setValue('');
    this.FormNphiesClaim.controls.firstName.setValue('');
    this.FormNphiesClaim.controls.middleName.setValue('');
    this.FormNphiesClaim.controls.lastName.setValue('');
    this.FormNphiesClaim.controls.familyName.setValue('');
    this.FormNphiesClaim.controls.fullName.setValue('');
    this.FormNphiesClaim.controls.beneficiaryFileld.setValue('');
    this.FormNphiesClaim.controls.dob.setValue('');
    this.FormNphiesClaim.controls.gender.setValue('');
    this.FormNphiesClaim.controls.documentType.setValue('');
    this.FormNphiesClaim.controls.documentId.setValue('');
    this.FormNphiesClaim.controls.eHealthId.setValue('');
    this.FormNphiesClaim.controls.nationality.setValue('');
    this.FormNphiesClaim.controls.nationalityName.setValue('');
    this.FormNphiesClaim.controls.residencyType.setValue('');
    this.FormNphiesClaim.controls.contactNumber.setValue('');
    this.FormNphiesClaim.controls.martialStatus.setValue('');
    this.FormNphiesClaim.controls.bloodGroup.setValue('');
    this.FormNphiesClaim.controls.preferredLanguage.setValue('');
    this.FormNphiesClaim.controls.emergencyNumber.setValue('');
    this.FormNphiesClaim.controls.email.setValue('');
    this.FormNphiesClaim.controls.addressLine.setValue('');
    this.FormNphiesClaim.controls.streetLine.setValue('');
    this.FormNphiesClaim.controls.bcity.setValue('');
    this.FormNphiesClaim.controls.bstate.setValue('');
    this.FormNphiesClaim.controls.bcountry.setValue('');
    this.FormNphiesClaim.controls.bcountryName.setValue('');
    this.FormNphiesClaim.controls.postalCode.setValue('');
    this.insurancePlans = [];
    this.updateValidations();
    this.emitSelectedBenificiary.emit(this.selectedBeneficiary);
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
      nationalityName: beneficiary.nationality ? (this.nationalities.filter(x => x.Code === beneficiary.nationality)[0] ? this.nationalities.filter(x => x.Code === beneficiary.nationality)[0].Name : '') : '',
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

    if (beneficiary.plans.length > 0 && beneficiary.plans.filter(x => x.primary)[0]) {
      this.FormNphiesClaim.controls.insurancePlanId.setValue(beneficiary.plans.filter(x => x.primary)[0].payerNphiesId);
      const plan: any = {};
      plan.value = this.selectedBeneficiary.plans.filter(x => x.primary)[0].payerNphiesId;
      plan.memberCardId = this.selectedBeneficiary.plans.filter(x => x.primary)[0].memberCardId;
      this.selectPlan(plan);
    }

    this.updateValidations();
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

  selectedPlan(planObj) {
    const plan: any = {};
    plan.value = planObj.payerNphiesId;
    plan.memberCardId = planObj.memberCardId;
    this.selectPlan(plan);
  }

  selectPlan(plan) {
    this.insurancePlans = [];
    if (this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0]) {
      // tslint:disable-next-line:max-line-length
      this.insurancePlans.push(this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0]);

      // tslint:disable-next-line:max-line-length
      const tpaNphiesId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].tpaNphiesId === '-1' ? '-1' : this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].tpaNphiesId;
      // tslint:disable-next-line:max-line-length
      const payerNphiesId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].payerNphiesId;

      this.FormNphiesClaim.controls.insurancePlanPayerId.setValue(tpaNphiesId + ':' + payerNphiesId, 10);

      this.FormNphiesClaim.controls.insurancePlanExpiryDate.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].expiryDate);
      this.FormNphiesClaim.controls.insurancePlanMemberCardId.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].memberCardId);
      // tslint:disable-next-line:max-line-length
      this.FormNphiesClaim.controls.insurancePlanRelationWithSubscriber.setValue(this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].relationWithSubscriber ? this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].relationWithSubscriber.toLowerCase() : '');
      this.FormNphiesClaim.controls.insurancePlanCoverageType.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].coverageType);

      this.FormNphiesClaim.controls.insurancePlanPayerName.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].payerName);
      this.FormNphiesClaim.controls.insurancePayerNphiesId.setValue(
        // tslint:disable-next-line:max-line-length
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].payerNphiesId);

      this.FormNphiesClaim.controls.insurancePlanPrimary.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].primary);
      // tslint:disable-next-line:max-line-length
      this.FormNphiesClaim.controls.insurancePlanTpaNphiesId.setValue(tpaNphiesId);
      // this.FormNphiesClaim.controls.insurancePlanPayerId.disable();
      this.FormNphiesClaim.controls.insurancePlanPolicyNumber.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].policyNumber);
      this.FormNphiesClaim.controls.maxLimit.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].maxLimit);
      this.FormNphiesClaim.controls.patientShare.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value && x.memberCardId === plan.memberCardId)[0].patientShare);
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

  selectPayer(event) {
    if (event.value) {
      this.FormNphiesClaim.patchValue({
        insurancePlanPayerId: event.value.payerNphiesId,
        destinationId: event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : event.value.payerNphiesId
      });
    } else {
      this.FormNphiesClaim.controls.insurancePlanPayerId.setValue('');
      this.FormNphiesClaim.controls.destinationId.setValue('');
    }
  }

}
