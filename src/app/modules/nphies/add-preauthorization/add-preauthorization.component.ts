import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig, ErrorStateMatcher } from '@angular/material';
import { AddEditPreauthorizationItemComponent } from '../add-edit-preauthorization-item/add-edit-preauthorization-item.component';
import { AddEditCareTeamModalComponent } from './add-edit-care-team-modal/add-edit-care-team-modal.component';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BeneficiariesSearchResult } from 'src/app/models/nphies/beneficiaryFullTextSearchResult';
import { DatePipe } from '@angular/common';
import { AddEditDiagnosisModalComponent } from './add-edit-diagnosis-modal/add-edit-diagnosis-modal.component';
import { AddEditSupportingInfoModalComponent } from './add-edit-supporting-info-modal/add-edit-supporting-info-modal.component';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
// tslint:disable-next-line:max-line-length
import { AddEditVisionLensSpecificationsComponent } from './add-edit-vision-lens-specifications/add-edit-vision-lens-specifications.component';
import * as moment from 'moment';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { ReplaySubject } from 'rxjs';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';
import { AddEditItemDetailsModalComponent } from '../add-edit-item-details-modal/add-edit-item-details-modal.component';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-preauthorization',
  templateUrl: './add-preauthorization.component.html',
  styles: []
})
export class AddPreauthorizationComponent implements OnInit {

  @Input() claimReuseId: number;
  @Input() data: any;
  @Output() closeEvent = new EventEmitter();
  paymentAmount = 0;

  beneficiarySearchController = new FormControl();
  subscriberSearchController = new FormControl();

  beneficiariesSearchResult: BeneficiariesSearchResult[] = [];
  subscriberSearchResult: BeneficiariesSearchResult[] = [];

  selectedBeneficiary: BeneficiariesSearchResult;
  selectedSubscriber: BeneficiariesSearchResult;

  selectedPlanId: string;
  selectedPlanIdError: string;
  IsSubscriberRequired = false;

  filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);


  FormPreAuthorization: FormGroup = this.formBuilder.group({
    beneficiaryName: ['', Validators.required],
    beneficiaryId: ['', Validators.required],
    insurancePlanId: ['', Validators.required],
    dateOrdered: ['', Validators.required],
    payee: ['', Validators.required],
    payeeType: ['', Validators.required],
    type: ['', Validators.required],
    subType: [''],
    accidentType: [''],
    streetName: [''],
    city: [''],
    state: [''],
    country: [''],
    countryName: [''],
    date: [''],
    dateWritten: [''],
    prescriber: [''],
    eligibilityOfflineDate: [''],
    eligibilityOfflineId: [''],
    eligibilityResponseId: [''],

    firstName: [''],
    middleName: [''],
    lastName: [''],
    familyName: [''],
    fullName: ['', Validators.required],
    beneficiaryFileld: [''],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    documentType: ['', Validators.required],
    documentId: ['', Validators.required],
    eHealthId: [''],
    nationality: [''],
    nationalityName: [''],
    residencyType: [''],
    contactNumber: [''],
    martialStatus: [''],
    bloodGroup: [''],
    preferredLanguage: [''],
    emergencyNumber: [''],
    email: [''],
    addressLine: [''],
    streetLine: [''],
    bcity: [''],
    bstate: [''],
    bcountry: [''],
    bcountryName: [''],
    postalCode: [''],
    insurancePlanPayerId: [''],
    insurancePlanExpiryDate: [''],
    insurancePlanMemberCardId: [''],
    insurancePlanRelationWithSubscriber: [''],
    insurancePlanCoverageType: [''],
    insurancePlanPayerName: [''],
    insurancePlanPrimary: [''],
    insurancePayerNphiesId: [''],
    insurancePlanTpaNphiesId: [],
    isNewBorn: [false],
    transfer: [false],
    subscriberName: ['']
  });

  FormSubscriber: FormGroup = this.formBuilder.group({
    beneficiaryName: ['', Validators.required],
    beneficiaryId: ['', Validators.required],
    firstName: [''],
    middleName: [''],
    lastName: [''],
    familyName: [''],
    fullName: ['', Validators.required],
    beneficiaryFileld: [''],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    documentType: ['', Validators.required],
    documentId: ['', Validators.required],
    eHealthId: [''],
    nationality: [''],
    nationalityName: [''],
    residencyType: [''],
    contactNumber: [''],
    martialStatus: [''],
    bloodGroup: [''],
    preferredLanguage: [''],
    emergencyNumber: [''],
    email: [''],
    addressLine: [''],
    streetLine: [''],
    bcity: [''],
    bstate: [''],
    bcountry: [''],
    bcountryName: [''],
    postalCode: ['']
  });

  typeList = this.sharedDataService.claimTypeList;
  payeeTypeList = this.sharedDataService.payeeTypeList;
  payeeList = [];
  subTypeList = [];

  accidentTypeList = this.sharedDataService.accidentTypeList;

  VisionSpecifications = [];
  SupportingInfo = [];
  CareTeams = [];
  Diagnosises = [];
  Items = [];

  model: any = {};
  detailsModel: any = {};

  isSubmitted = false;
  IsLensSpecificationRequired = false;
  IsDiagnosisRequired = false;
  // IsCareTeamRequired = false;
  IsItemRequired = false;
  IsDateWrittenRequired = false;
  IsPrescriberRequired = false;

  IsDateRequired = false;
  IsAccidentTypeRequired = false;
  IsJSONPosted = false;

  today: Date;
  nationalities = nationalities;
  selectedCountry = '';

  currentOpenItem: number = null;

  constructor(
    private sharedDataService: SharedDataService,
    private dialogService: DialogService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private sharedServices: SharedServices,
    private datePipe: DatePipe,
    private providerNphiesSearchService: ProviderNphiesSearchService,
    private providersBeneficiariesService: ProvidersBeneficiariesService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService) {
    this.today = new Date();
  }

  ngOnInit() {
    this.getPayees();
    this.FormPreAuthorization.controls.dateOrdered.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.filteredNations.next(this.nationalities.slice());
    if (this.claimReuseId) {
      this.setReuseValues();
    }
  }

  setReuseValues() {
    const date = moment(this.data.preAuthorizationInfo.dateOrdered, 'DD-MM-YYYY').format('YYYY-MM-DD');
    // tslint:disable-next-line:max-line-length
    this.FormPreAuthorization.controls.dateOrdered.setValue(date);
    if (this.data.preAuthorizationInfo.payeeType) {
      // tslint:disable-next-line:max-line-length
      this.FormPreAuthorization.controls.payeeType.setValue(this.sharedDataService.payeeTypeList.filter(x => x.value === this.data.preAuthorizationInfo.payeeType)[0] ? this.sharedDataService.payeeTypeList.filter(x => x.value === this.data.preAuthorizationInfo.payeeType)[0] : '');
      // tslint:disable-next-line:max-line-length
      this.FormPreAuthorization.controls.payee.setValue(this.payeeList.filter(x => x.nphiesId === this.data.preAuthorizationInfo.payeeId)[0] ? this.payeeList.filter(x => x.nphiesId === this.data.preAuthorizationInfo.payeeId)[0].nphiesId : '');
    }
    // tslint:disable-next-line:max-line-length
    this.FormPreAuthorization.controls.type.setValue(this.sharedDataService.claimTypeList.filter(x => x.value === this.data.preAuthorizationInfo.type)[0] ? this.sharedDataService.claimTypeList.filter(x => x.value === this.data.preAuthorizationInfo.type)[0] : '');
    switch (this.data.preAuthorizationInfo.type) {
      case 'institutional':
        this.subTypeList = this.sharedDataService.subTypeList.filter(x => x.value === 'ip' || x.value === 'emr');
        break;
      case 'professional':
      case 'vision':
      case 'pharmacy':
      case 'oral':
        this.subTypeList = this.sharedDataService.subTypeList.filter(x => x.value === 'op');
        break;
    }
    if (this.data.preAuthorizationInfo.subType != null) {
      // tslint:disable-next-line:max-line-length
      this.FormPreAuthorization.controls.subType.setValue(this.sharedDataService.subTypeList.filter(x => x.value === this.data.preAuthorizationInfo.subType)[0] ? this.sharedDataService.subTypeList.filter(x => x.value === this.data.preAuthorizationInfo.subType)[0] : '');
    }
    if (this.data.preAuthorizationInfo.eligibilityOfflineId != null) {
      // tslint:disable-next-line:max-line-length
      this.FormPreAuthorization.controls.eligibilityOfflineId.setValue(this.data.preAuthorizationInfo.eligibilityOfflineId);
    }
    if (this.data.preAuthorizationInfo.eligibilityOfflineDate != null) {
      // tslint:disable-next-line:max-line-length
      this.FormPreAuthorization.controls.eligibilityOfflineDate.setValue(this.data.preAuthorizationInfo.eligibilityOfflineDate);
    }
    if (this.data.preAuthorizationInfo.eligibilityResponseId != null) {
      // tslint:disable-next-line:max-line-length
      this.FormPreAuthorization.controls.eligibilityResponseId.setValue(this.data.preAuthorizationInfo.eligibilityResponseId);
    }
    if (this.data.accident) {
      if (this.data.accident.accidentType) {
        // tslint:disable-next-line:max-line-length
        this.FormPreAuthorization.controls.accidentType.setValue(this.sharedDataService.accidentTypeList.filter(x => x.value === this.data.accident.accidentType)[0]);
      }
      if (this.data.accident.streetName) {
        this.FormPreAuthorization.controls.streetName.setValue(this.data.accident.streetName);
      }
      if (this.data.accident.city) {
        this.FormPreAuthorization.controls.city.setValue(this.data.accident.city);
      }
      if (this.data.accident.state) {
        this.FormPreAuthorization.controls.state.setValue(this.data.accident.state);
      }
      if (this.data.accident.country) {
        this.FormPreAuthorization.controls.country.setValue(this.data.accident.country);
      }
      // this.FormPreAuthorization.controls.countryName.setValue(this.data.beneficiary.beneficiaryName);
      if (this.data.accident.date) {
        this.FormPreAuthorization.controls.date.setValue(this.data.accident.date);
      }
    }
    this.Diagnosises = this.data.diagnosis;
    this.SupportingInfo = this.data.supportingInfo;
    this.CareTeams = this.data.careTeam;
    if (this.data.visionPrescription && this.data.visionPrescription.lensSpecifications) {
      this.FormPreAuthorization.controls.dateWritten.setValue(new Date(this.data.visionPrescription.dateWritten));
      this.FormPreAuthorization.controls.prescriber.setValue(this.data.visionPrescription.prescriber);
      this.VisionSpecifications = this.data.visionPrescription.lensSpecifications;
    }

    this.Items = this.data.items;
    this.setBeneficiary(this.data);
  }

  setBeneficiary(res) {
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, res.beneficiary.documentId).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.beneficiariesSearchResult = body;
          this.selectedBeneficiary = body[0];
          this.FormPreAuthorization.patchValue({
            beneficiaryName: res.beneficiary.beneficiaryName + ' (' + res.beneficiary.documentId + ')',
            beneficiaryId: res.beneficiary.beneficiaryId
          });
          this.FormPreAuthorization.controls.insurancePlanId.setValue(res.payerNphiesId.toString());

          if (this.claimReuseId) {
            this.FormPreAuthorization.controls.beneficiaryName.disable();
            this.FormPreAuthorization.controls.beneficiaryId.disable();
            this.FormPreAuthorization.controls.insurancePlanId.disable();
            this.FormPreAuthorization.controls.type.disable();
            this.FormPreAuthorization.controls.subType.disable();
            this.FormPreAuthorization.controls.payee.disable();
            this.FormPreAuthorization.controls.payeeType.disable();
            this.FormPreAuthorization.controls.accidentType.disable();
            this.FormPreAuthorization.controls.streetName.disable();
            this.FormPreAuthorization.controls.city.disable();
            this.FormPreAuthorization.controls.state.disable();
            this.FormPreAuthorization.controls.country.disable();
            this.FormPreAuthorization.controls.countryName.disable();
            this.FormPreAuthorization.controls.date.disable();
          }
        }

        // this.disableFields();
        this.sharedServices.loadingChanged.next(false);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
      this.sharedServices.loadingChanged.next(false);
    });
  }

  disableFields() {
    this.FormPreAuthorization.controls.beneficiaryName.disable();
    this.FormPreAuthorization.controls.beneficiaryId.disable();
    this.FormPreAuthorization.controls.insurancePlanId.disable();
    this.FormPreAuthorization.controls.dateOrdered.disable();
    this.FormPreAuthorization.controls.payee.disable();
    this.FormPreAuthorization.controls.payeeType.disable();
    this.FormPreAuthorization.controls.type.disable();
    this.FormPreAuthorization.controls.subType.disable();
    this.FormPreAuthorization.controls.accidentType.disable();
    this.FormPreAuthorization.controls.streetName.disable();
    this.FormPreAuthorization.controls.city.disable();
    this.FormPreAuthorization.controls.state.disable();
    this.FormPreAuthorization.controls.country.disable();
    this.FormPreAuthorization.controls.countryName.disable();
    this.FormPreAuthorization.controls.date.disable();
    this.FormPreAuthorization.controls.dateWritten.disable();
    this.FormPreAuthorization.controls.prescriber.disable();
    this.FormPreAuthorization.controls.eligibilityOfflineDate.disable();
    this.FormPreAuthorization.controls.eligibilityOfflineId.disable();
    this.FormPreAuthorization.controls.eligibilityResponseId.disable();
  }

  getPayees() {
    this.sharedServices.loadingChanged.next(true);
    this.providersBeneficiariesService.getPayees().subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        if (event.body != null && event.body instanceof Array) {
          this.payeeList = event.body;
          // tslint:disable-next-line:max-line-length
          this.FormPreAuthorization.controls.payeeType.setValue(this.sharedDataService.payeeTypeList.filter(x => x.value === 'provider')[0]);
          this.onPayeeTypeChange();
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        console.log('Error');
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  filterNationality() {

    if (!this.nationalities) {
      return;
    }
    // get the search keyword
    let search = this.FormPreAuthorization.controls.nationalityFilterCtrl.value;
    if (!search) {
      this.filteredNations.next(this.nationalities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the nations
    this.filteredNations.next(
      this.nationalities.filter(nation => nation.Name.toLowerCase().indexOf(search) > -1)
    );
  }

  onPayeeTypeChange() {
    if (this.FormPreAuthorization.controls.payeeType.value && this.FormPreAuthorization.controls.payeeType.value.value === 'provider') {
      // tslint:disable-next-line:max-line-length
      this.FormPreAuthorization.controls.payee.setValue(this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0] ? this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0].nphiesId : '');
    }
    this.FormPreAuthorization.controls.payeeType.disable();
    this.FormPreAuthorization.controls.payee.disable();
  }

  onTypeChange($event) {
    if ($event.value) {
      switch ($event.value.value) {
        case 'institutional':
          this.subTypeList = [
            { value: 'ip', name: 'InPatient' },
            { value: 'emr', name: 'Emergency' },
          ];
          break;
        case 'professional':
        case 'vision':
        case 'pharmacy':
        case 'oral':
          this.subTypeList = [
            { value: 'op', name: 'OutPatient' },
          ];
          break;
      }

      this.VisionSpecifications = [];
      this.Items = [];
      this.Diagnosises = [];
    }
  }

  searchBeneficiaries(IsSubscriber = null) {
    let searchStr = '';
    if (!IsSubscriber) {
      searchStr = this.FormPreAuthorization.controls.beneficiaryName.value;
    } else {
      searchStr = this.FormPreAuthorization.controls.subscriberName.value;
    }
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.beneficiaryFullTextSearch(this.sharedServices.providerId, searchStr).subscribe(event => {
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

  selectBeneficiary(beneficiary: BeneficiariesSearchResult) {
    this.selectedBeneficiary = beneficiary;
    this.FormPreAuthorization.patchValue({
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
  }

  selectSubscriber(beneficiary: BeneficiariesSearchResult) {
    this.selectedSubscriber = beneficiary;
    this.FormPreAuthorization.controls.subscriberName.setValue(beneficiary.name + ' (' + beneficiary.documentId + ')');
    this.FormSubscriber.patchValue({
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
    if (this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0]) {
      this.FormPreAuthorization.controls.insurancePlanPayerId.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].payerNphiesId, 10);
      this.FormPreAuthorization.controls.insurancePlanExpiryDate.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].expiryDate);
      this.FormPreAuthorization.controls.insurancePlanMemberCardId.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].memberCardId);
      this.FormPreAuthorization.controls.insurancePlanRelationWithSubscriber.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].relationWithSubscriber);
      this.FormPreAuthorization.controls.insurancePlanCoverageType.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].coverageType);

      this.FormPreAuthorization.controls.insurancePlanPayerName.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].payerName);
      this.FormPreAuthorization.controls.insurancePayerNphiesId.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].payerNphiesId);
      // this.FormPreAuthorization.controls.insurancePlanId.setValue(
      //   this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].payerNphiesId);
      this.FormPreAuthorization.controls.insurancePlanPrimary.setValue(
        this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].primary);
      // tslint:disable-next-line:max-line-length
      this.FormPreAuthorization.controls.insurancePlanTpaNphiesId.setValue(this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].tpaNphiesId === '-1' ? null : this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === plan.value)[0].tpaNphiesId);
      // this.FormPreAuthorization.controls.insurancePlanPayerId.disable();
    }
  }

  openAddEditVisionLensDialog(visionSpecification: any = null) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (visionSpecification !== null) ? visionSpecification.sequence : (this.VisionSpecifications.length === 0 ? 1 : (this.VisionSpecifications[this.VisionSpecifications.length - 1].sequence + 1)),
      item: visionSpecification
    };

    const dialogRef = this.dialog.open(AddEditVisionLensSpecificationsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.VisionSpecifications.find(x => x.sequence === result.sequence)) {
          this.VisionSpecifications.map(x => {
            if (x.sequence === result.sequence) {
              x.product = result.product;
              x.productName = result.productName;
              x.eye = result.eye;
              x.sphere = result.sphere;
              x.cylinder = result.cylinder;
              x.axis = result.axis;
              x.prismAmount = result.prismAmount;
              x.prismBase = result.prismBase;
              x.multifocalPower = result.multifocalPower;
              x.lensPower = result.lensPower;
              x.lensBackCurve = result.lensBackCurve;
              x.lensDiameter = result.lensDiameter;
              x.lensDuration = result.lensDuration;
              x.lensDurationUnit = result.lensDurationUnit;
              x.lensDurationUnitName = result.lensDurationUnitName;
              x.lensColor = result.lensColor;
              x.lensBrand = result.lensBrand;
              x.prismBaseName = result.prismBaseName;
              x.lensNote = result.lensNote;
            }
          });
        } else {
          this.VisionSpecifications.push(result);
        }
      }
    });
  }

  deleteVisionLens(index: number) {
    this.VisionSpecifications.splice(index, 1);
    if (this.VisionSpecifications.length === 0) {
      this.FormPreAuthorization.controls.dateWritten.clearValidators();
      this.FormPreAuthorization.controls.dateWritten.updateValueAndValidity();
      this.IsDateWrittenRequired = false;
    }
  }

  openAddEditCareTeam(careTeam: any = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-lg'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (careTeam !== null) ? careTeam.sequence : (this.CareTeams.length === 0 ? 1 : (this.CareTeams[this.CareTeams.length - 1].sequence + 1)),
      item: careTeam
    };

    const dialogRef = this.dialog.open(AddEditCareTeamModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.CareTeams.find(x => x.sequence === result.sequence)) {
          this.CareTeams.map(x => {
            if (x.sequence === result.sequence) {
              x.practitionerName = result.practitionerName;
              x.physicianCode = result.physicianCode;
              x.practitionerRole = result.practitionerRole;
              x.careTeamRole = result.careTeamRole;
              x.speciality = result.speciality;
              x.specialityCode = result.specialityCode;
              x.qualificationCode = result.specialityCode;
              x.practitionerRoleName = result.practitionerRoleName;
              x.careTeamRoleName = result.careTeamRoleName;
            }
          });
        } else {
          this.CareTeams.push(result);
          // this.checkCareTeamValidation();
        }
      }
    });
  }

  deleteCareTeam(sequence: number, index: number) {

    if (this.Items.find(x => x.careTeamSequence && x.careTeamSequence.find(y => y === sequence))) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['primary-dialog'];
      dialogConfig.data = {
        // tslint:disable-next-line:max-line-length
        mainMessage: 'Are you sure you want to delete this Care Team?',
        subMessage: 'This care team is referenced in some of the Items',
        mode: 'warning',
        hideNoButton: false
      };

      const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.Items.filter(x => x.careTeamSequence.find(y => y === sequence)).forEach(z => {
            z.careTeamSequence.splice(z.careTeamSequence.indexOf(sequence), 1);
          });
          this.CareTeams.splice(index, 1);
          // this.checkCareTeamValidation();
        }
      });
    } else {
      this.CareTeams.splice(index, 1);
      // this.checkCareTeamValidation();
    }
  }

  openAddEditDiagnosis(diagnosis: any = null) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (diagnosis !== null) ? diagnosis.sequence : (this.Diagnosises.length === 0 ? 1 : (this.Diagnosises[this.Diagnosises.length - 1].sequence + 1)),
      item: diagnosis,
      itemTypes: this.Diagnosises.map(x => {
        return x.type;
      }),
      type: this.FormPreAuthorization.controls.type.value ? this.FormPreAuthorization.controls.type.value.value : ''
    };

    const dialogRef = this.dialog.open(AddEditDiagnosisModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.Diagnosises.find(x => x.sequence === result.sequence)) {
          this.Diagnosises.map(x => {
            if (x.sequence === result.sequence) {
              x.diagnosisDescription = result.diagnosisDescription;
              x.type = result.type;
              x.onAdmission = result.onAdmission;
              x.diagnosisCode = result.diagnosisCode;
              x.typeName = result.typeName;
              x.onAdmissionName = result.onAdmissionName;
            }
          });
        } else {
          this.Diagnosises.push(result);
          this.checkDiagnosisValidation();
        }
      }
    });
  }

  deleteDiagnosis(sequence: number, index: number) {

    if (this.Items.find(x => x.diagnosisSequence && x.diagnosisSequence.find(y => y === sequence))) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['primary-dialog'];
      dialogConfig.data = {
        // tslint:disable-next-line:max-line-length
        mainMessage: 'Are you sure you want to delete this Diagnosis?',
        subMessage: 'This diagnosis is referenced in some of the Items',
        mode: 'warning',
        hideNoButton: false
      };

      const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.Items.filter(x => x.diagnosisSequence.find(y => y === sequence)).forEach(z => {
            z.diagnosisSequence.splice(z.diagnosisSequence.indexOf(sequence), 1);
          });
          this.Diagnosises.splice(index, 1);
          this.updateSequenceNames();
          this.checkDiagnosisValidation();
        }
      });
    } else {
      this.Diagnosises.splice(index, 1);
      this.checkDiagnosisValidation();
    }
  }

  openAddEditItemDialog(itemModel: any = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      source: 'APPROVAL',
      // tslint:disable-next-line:max-line-length
      Sequence: (itemModel !== null) ? itemModel.sequence : (this.Items.length === 0 ? 1 : (this.Items[this.Items.length - 1].sequence + 1)),
      item: itemModel,
      careTeams: this.CareTeams,
      diagnosises: this.Diagnosises,
      supportingInfos: this.SupportingInfo,
      type: this.FormPreAuthorization.controls.type.value.value,
      dateOrdered: this.FormPreAuthorization.controls.dateOrdered.value
    };

    const dialogRef = this.dialog.open(AddEditPreauthorizationItemComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.Items.find(x => x.sequence === result.sequence)) {
          this.Items.map(x => {
            if (x.sequence === result.sequence) {
              x.type = result.type;
              x.typeName = result.typeName,
                x.itemCode = result.itemCode;
              x.itemDescription = result.itemDescription;
              x.nonStandardCode = result.nonStandardCode;
              x.display = result.display;
              x.isPackage = result.isPackage;
              x.bodySite = result.bodySite;
              x.bodySiteName = result.bodySiteName;
              x.subSite = result.subSite;
              x.subSiteName = result.subSiteName;
              x.quantity = result.quantity;
              x.quantityCode = result.quantityCode;
              x.unitPrice = result.unitPrice;
              x.discount = result.discount;
              x.discountPercent = result.discountPercent;
              x.factor = result.factor;
              x.taxPercent = result.taxPercent;
              x.patientSharePercent = result.patientSharePercent;
              x.tax = result.tax;
              x.net = result.net;
              x.patientShare = result.patientShare;
              x.payerShare = result.payerShare;
              x.startDate = result.startDate;
              x.startDateStr = result.startDateStr;
              x.supportingInfoSequence = result.supportingInfoSequence;
              x.careTeamSequence = result.careTeamSequence;
              x.diagnosisSequence = result.diagnosisSequence;

              if (x.supportingInfoSequence) {
                x.supportingInfoNames = '';
                x.supportingInfoSequence.forEach(s => {
                  x.supportingInfoNames += ', [' + this.SupportingInfo.filter(y => y.sequence === s)[0].categoryName + ']';
                });
                x.supportingInfoNames = x.supportingInfoNames.slice(2, x.supportingInfoNames.length);
              } else {
                x.supportingInfoNames = '';
              }

              if (x.careTeamSequence) {
                x.careTeamNames = '';
                x.careTeamSequence.forEach(s => {
                  x.careTeamNames += ', [' + this.CareTeams.filter(y => y.sequence === s)[0].practitionerName + ']';
                });
                x.careTeamNames = x.careTeamNames.slice(2, x.careTeamNames.length);
              } else {
                x.careTeamNames = '';
              }

              if (x.diagnosisSequence) {
                x.diagnosisNames = '';
                x.diagnosisSequence.forEach(s => {
                  x.diagnosisNames += ', [' + this.Diagnosises.filter(y => y.sequence === s)[0].diagnosisCode + ']';
                });
                x.diagnosisNames = x.diagnosisNames.slice(2, x.diagnosisNames.length);
              } else {
                x.diagnosisNames = '';
              }

              if (!x.isPackage) {
                x.itemDetails = [];
              }

            }
          });
        } else {
          this.Items.push(result);
          this.Items.filter((x, i) => {
            if (i === this.Items.length - 1) {

              if (x.supportingInfoSequence) {
                x.supportingInfoNames = '';
                x.supportingInfoSequence.forEach(s => {
                  x.supportingInfoNames += ', [' + this.SupportingInfo.filter(y => y.sequence === s)[0].categoryName + ']';
                });
                x.supportingInfoNames = x.supportingInfoNames.slice(2, x.supportingInfoNames.length);
              }

              if (x.careTeamSequence) {
                x.careTeamNames = '';
                x.careTeamSequence.forEach(s => {
                  x.careTeamNames += ', [' + this.CareTeams.filter(y => y.sequence === s)[0].practitionerName + ']';
                });
                x.careTeamNames = x.careTeamNames.slice(2, x.careTeamNames.length);
              }

              if (x.diagnosisSequence) {
                x.diagnosisNames = '';
                x.diagnosisSequence.forEach(s => {
                  x.diagnosisNames += ', [' + this.Diagnosises.filter(y => y.sequence === s)[0].diagnosisCode + ']';
                });
                x.diagnosisNames = x.diagnosisNames.slice(2, x.diagnosisNames.length);
              }
            }
          });
          this.checkItemValidation();
        }
      }
    });
  }

  deleteItem(index: number) {
    this.Items.splice(index, 1);
    this.checkItemValidation();
  }

  openAddEditItemDetailsDialog(itemSequence: number, itemModel: any = null) {

    const item = this.Items.filter(x => x.sequence === itemSequence)[0];

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (itemModel !== null) ? itemModel.sequence : (item.itemDetails.length === 0 ? 1 : (item.itemDetails[item.itemDetails.length - 1].sequence + 1)),
      item: itemModel,
      type: this.FormPreAuthorization.controls.type.value.value
    };

    const dialogRef = this.dialog.open(AddEditItemDetailsModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.Items.find(x => x.sequence === itemSequence)) {
          this.Items.map(x => {
            if (x.sequence === itemSequence) {
              if (x.itemDetails.find(y => y.sequence === result.sequence)) {
                x.itemDetails.map(y => {
                  if (y.sequence === result.sequence) {
                    y.type = result.type;
                    y.typeName = result.typeName,
                      y.itemCode = result.itemCode;
                    y.itemDescription = result.itemDescription;
                    y.nonStandardCode = result.nonStandardCode;
                    y.display = result.display;
                    y.quantity = result.quantity;
                    y.quantityCode = result.quantityCode;

                  }
                });
              } else {
                x.itemDetails.push(result);
              }
            }
          });

        }
      }
    });
  }

  deleteItemDetails(itemSequence: number, index: number) {
    if (this.Items.find(x => x.sequence === itemSequence)) {
      this.Items.map(x => {
        if (x.sequence === itemSequence) {
          x.itemDetails.splice(index, 1);
        }
      });
    }
  }

  openAddEditSupportInfoDialog(supportInfoModel: any = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      Sequence: (supportInfoModel !== null) ? supportInfoModel.sequence : (this.SupportingInfo.length === 0 ? 1 : (this.SupportingInfo[this.SupportingInfo.length - 1].sequence + 1)),
      item: supportInfoModel
    };

    const dialogRef = this.dialog.open(AddEditSupportingInfoModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.SupportingInfo.find(x => x.sequence === result.sequence)) {
          this.SupportingInfo.map(x => {
            if (x.sequence === result.sequence) {
              x.category = result.category;
              x.categoryName = result.categoryName;
              x.code = result.code;
              x.fromDate = result.fromDate;
              x.toDate = result.toDate;
              x.value = result.value;
              x.reason = result.reason;
              x.attachment = result.attachment;
              x.attachmentName = result.attachmentName;
              x.attachmentType = result.attachmentType;
              x.attachmentDate = result.attachmentDate;
              x.attachmentDateStr = result.attachmentDateStr;
              x.codeName = result.codeName;
              x.reasonName = result.reasonName;
              x.fromDateStr = result.fromDateStr;
              x.toDateStr = result.toDateStr;
              x.unit = result.unit;
              x.byteArray = result.byteArray;
            }
          });
        } else {
          this.SupportingInfo.push(result);
        }
      }
    });
  }

  deleteSupportingInfo(sequence: number, index: number) {

    if (this.Items.find(x => x.supportingInfoSequence && x.supportingInfoSequence.find(y => y === sequence))) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = ['primary-dialog'];
      dialogConfig.data = {
        // tslint:disable-next-line:max-line-length
        mainMessage: 'Are you sure you want to delete this Supporting Info?',
        subMessage: 'This supporting info is referenced in some of the Items',
        mode: 'warning',
        hideNoButton: false
      };

      const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.Items.filter(x => x.supportingInfoSequence.find(y => y === sequence)).forEach(z => {
            z.supportingInfoSequence.splice(z.supportingInfoSequence.indexOf(sequence), 1);
          });
          this.SupportingInfo.splice(index, 1);
          this.updateSequenceNames();
        }
      });
    } else {
      this.SupportingInfo.splice(index, 1);
    }
  }

  // checkCareTeamValidation() {
  //   if (this.CareTeams.length === 0) {
  //     this.IsCareTeamRequired = true;
  //   } else {
  //     this.IsCareTeamRequired = false;
  //   }
  // }



  checkDiagnosisValidation() {
    if (this.Diagnosises.length === 0) {
      this.IsDiagnosisRequired = true;
    } else {
      this.IsDiagnosisRequired = false;
    }
  }

  checkItemValidation() {
    if (this.Items.length === 0) {
      this.IsItemRequired = true;
    } else {
      this.IsItemRequired = false;
    }
  }

  checkItemCareTeams() {
    if (this.Items.length > 0) {
      if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'pharmacy') {
        return true;
      } else if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value !== 'pharmacy') {
        if (this.Items.find(x => (x.careTeamSequence && x.careTeamSequence.length === 0))) {
          this.dialogService.showMessage('Error', 'All Items must have atleast one care team', 'alert', true, 'OK');
          return false;
        } else {
          return true;
        }
      }

    }
  }

  checkItemsCodeForSupportingInfo() {
    // tslint:disable-next-line:max-line-length
    if (this.Items.length > 0 && this.Items.filter(x => x.type === 'medication-codes').length > 0 && (this.SupportingInfo.filter(x => x.category === 'days-supply').length === 0)) {
      // tslint:disable-next-line:max-line-length
      this.dialogService.showMessage('Error', 'Days-Supply is required in Supporting Info if any medication-code is used', 'alert', true, 'OK');
      return false;
    } else {
      return true;
    }
  }

  updateSequenceNames() {
    this.Items.forEach(x => {
      if (x.supportingInfoSequence) {
        x.supportingInfoNames = '';
        x.supportingInfoSequence.forEach(s => {
          x.supportingInfoNames += ', [' + this.SupportingInfo.filter(y => y.sequence === s)[0].categoryName + ']';
        });
        x.supportingInfoNames = x.supportingInfoNames.slice(2, x.supportingInfoNames.length);
      } else {
        x.supportingInfoNames = '';
      }

      if (x.careTeamSequence) {
        x.careTeamNames = '';
        x.careTeamSequence.forEach(s => {
          x.careTeamNames += ', [' + this.CareTeams.filter(y => y.sequence === s)[0].practitionerName + ']';
        });
        x.careTeamNames = x.careTeamNames.slice(2, x.careTeamNames.length);
      } else {
        x.careTeamNames = '';
      }

      if (x.diagnosisSequence) {
        x.diagnosisNames = '';
        x.diagnosisSequence.forEach(s => {
          x.diagnosisNames += ', [' + this.Diagnosises.filter(y => y.sequence === s)[0].diagnosisCode + ']';
        });
        x.diagnosisNames = x.diagnosisNames.slice(2, x.diagnosisNames.length);
      } else {
        x.diagnosisNames = '';
      }
    });
  }

  checkSupposrtingInfoValidation() {
    let hasError = false;

    this.SupportingInfo.forEach(x => {
      switch (x.category) {

        case 'info':

          if (!x.value) {
            hasError = true;
          }

          break;
        case 'onset':

          if (!x.code || !x.fromDate) {
            hasError = true;
          }

          break;
        case 'attachment':

          if (!x.attachment) {
            hasError = true;
          }

          break;
        case 'missingtooth':

          if (!x.code || !x.fromDate || !x.reason) {
            hasError = true;
          }

          break;
        case 'hospitalized':
        case 'employmentImpacted':

          if (!x.fromDate || !x.toDate) {
            hasError = true;
          }

          break;

        case 'lab-test':

          if (!x.code || !x.value) {
            hasError = true;
          }

          break;
        case 'reason-for-visit':

          if (!x.code) {
            hasError = true;
          }

          break;
        case 'days-supply':
        case 'vital-sign-weight':
        case 'vital-sign-systolic':
        case 'vital-sign-diastolic':
        case 'icu-hours':
        case 'ventilation-hours':
        case 'vital-sign-height':
        case 'temperature':
        case 'pulse':
        case 'respiratory-rate':
        case 'oxygen-saturation':
        case 'birth-weight':

          if (!x.value) {
            hasError = true;
          }

          break;
        case 'chief-complaint':

          if (!x.code && !x.value) {
            hasError = true;
          }

          break;

        default:
          break;
      }
    });

    return hasError;
  }

  onSubmit() {
    this.isSubmitted = true;
    let hasError = false;
    // tslint:disable-next-line:max-line-length
    if (this.FormPreAuthorization.controls.date.value && !(this.FormPreAuthorization.controls.accidentType.value && this.FormPreAuthorization.controls.accidentType.value.value)) {
      this.FormPreAuthorization.controls.accidentType.setValidators([Validators.required]);
      this.FormPreAuthorization.controls.accidentType.updateValueAndValidity();
      this.IsAccidentTypeRequired = true;
      hasError = true;
    } else {
      this.FormPreAuthorization.controls.accidentType.clearValidators();
      this.FormPreAuthorization.controls.accidentType.updateValueAndValidity();
      this.IsAccidentTypeRequired = false;
    }
    // tslint:disable-next-line:max-line-length
    if (this.FormPreAuthorization.controls.accidentType.value && this.FormPreAuthorization.controls.accidentType.value.value && !this.FormPreAuthorization.controls.date.value) {
      this.FormPreAuthorization.controls.date.setValidators([Validators.required]);
      this.FormPreAuthorization.controls.date.updateValueAndValidity();
      this.IsDateRequired = true;
      hasError = true;
    } else {
      this.FormPreAuthorization.controls.date.clearValidators();
      this.FormPreAuthorization.controls.date.updateValueAndValidity();
      this.IsDateRequired = false;
    }
    if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'vision') {
      if (this.FormPreAuthorization.controls.dateWritten.value && this.VisionSpecifications.length === 0) {
        this.FormPreAuthorization.controls.prescriber.setValidators([Validators.required]);
        this.FormPreAuthorization.controls.prescriber.updateValueAndValidity();
        this.IsLensSpecificationRequired = true;
        hasError = true;
      } else {
        this.FormPreAuthorization.controls.prescriber.clearValidators();
        this.FormPreAuthorization.controls.prescriber.updateValueAndValidity();
        this.IsLensSpecificationRequired = false;
      }

      if (!this.FormPreAuthorization.controls.dateWritten.value && this.VisionSpecifications.length > 0) {
        this.FormPreAuthorization.controls.dateWritten.setValidators([Validators.required]);
        this.FormPreAuthorization.controls.dateWritten.updateValueAndValidity();
        this.IsDateWrittenRequired = true;
        hasError = true;
      } else {
        this.FormPreAuthorization.controls.dateWritten.clearValidators();
        this.FormPreAuthorization.controls.dateWritten.updateValueAndValidity();
        this.IsDateWrittenRequired = false;
      }

      // tslint:disable-next-line:max-line-length
      if ((this.FormPreAuthorization.controls.dateWritten.value && !this.FormPreAuthorization.controls.prescriber.value) ||
        (this.VisionSpecifications.length > 0 && !this.FormPreAuthorization.controls.prescriber.value)) {
        this.FormPreAuthorization.controls.prescriber.setValidators([Validators.required]);
        this.FormPreAuthorization.controls.prescriber.updateValueAndValidity();
        this.IsPrescriberRequired = true;
        hasError = true;
      } else {
        this.FormPreAuthorization.controls.prescriber.clearValidators();
        this.FormPreAuthorization.controls.prescriber.updateValueAndValidity();
        this.IsPrescriberRequired = false;
      }
    }

    if (this.Diagnosises.length === 0 || this.Items.length === 0) {
      hasError = true;
    }

    // this.checkCareTeamValidation();
    this.checkDiagnosisValidation();
    this.checkItemValidation();

    if (this.checkSupposrtingInfoValidation()) {
      hasError = true;
    }

    if (!this.checkItemCareTeams()) {
      hasError = true;
    }

    if (!this.checkItemsCodeForSupportingInfo()) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    if (this.FormPreAuthorization.valid) {

      this.model = {};
      if (this.claimReuseId) {
        this.model.claimReuseId = this.claimReuseId;
      } else {
        this.model.transfer = this.FormPreAuthorization.controls.transfer.value;
      }

      this.model.isNewBorn = this.FormPreAuthorization.controls.isNewBorn.value;

      this.model.beneficiary = {};
      this.model.beneficiary.firstName = this.FormPreAuthorization.controls.firstName.value;
      this.model.beneficiary.secondName = this.FormPreAuthorization.controls.middleName.value;
      this.model.beneficiary.thirdName = this.FormPreAuthorization.controls.lastName.value;
      this.model.beneficiary.familyName = this.FormPreAuthorization.controls.familyName.value;
      this.model.beneficiary.fullName = this.FormPreAuthorization.controls.fullName.value;
      this.model.beneficiary.fileId = this.FormPreAuthorization.controls.beneficiaryFileld.value;
      this.model.beneficiary.dob = this.FormPreAuthorization.controls.dob.value;
      this.model.beneficiary.gender = this.FormPreAuthorization.controls.gender.value;
      this.model.beneficiary.documentType = this.FormPreAuthorization.controls.documentType.value;
      this.model.beneficiary.documentId = this.FormPreAuthorization.controls.documentId.value;
      this.model.beneficiary.eHealthId = this.FormPreAuthorization.controls.eHealthId.value;
      this.model.beneficiary.nationality = this.FormPreAuthorization.controls.nationality.value;
      this.model.beneficiary.residencyType = this.FormPreAuthorization.controls.residencyType.value;
      this.model.beneficiary.contactNumber = this.FormPreAuthorization.controls.contactNumber.value;
      this.model.beneficiary.maritalStatus = this.FormPreAuthorization.controls.martialStatus.value;
      this.model.beneficiary.bloodGroup = this.FormPreAuthorization.controls.bloodGroup.value;
      this.model.beneficiary.preferredLanguage = this.FormPreAuthorization.controls.preferredLanguage.value;
      this.model.beneficiary.emergencyPhoneNumber = this.FormPreAuthorization.controls.emergencyNumber.value;
      this.model.beneficiary.email = this.FormPreAuthorization.controls.email.value;
      this.model.beneficiary.addressLine = this.FormPreAuthorization.controls.addressLine.value;
      this.model.beneficiary.streetLine = this.FormPreAuthorization.controls.streetLine.value;
      this.model.beneficiary.city = this.FormPreAuthorization.controls.bcity.value;
      this.model.beneficiary.state = this.FormPreAuthorization.controls.bstate.value;
      this.model.beneficiary.country = this.FormPreAuthorization.controls.bcountry.value;
      this.model.beneficiary.postalCode = this.FormPreAuthorization.controls.postalCode.value;

      if (this.FormPreAuthorization.controls.subscriberName.value) {
        this.model.subscriber = {};

        this.model.subscriber.firstName = this.FormSubscriber.controls.firstName.value;
        this.model.subscriber.secondName = this.FormSubscriber.controls.middleName.value;
        this.model.subscriber.thirdName = this.FormSubscriber.controls.lastName.value;
        this.model.subscriber.familyName = this.FormSubscriber.controls.familyName.value;
        this.model.subscriber.fullName = this.FormSubscriber.controls.fullName.value;
        this.model.subscriber.fileId = this.FormSubscriber.controls.beneficiaryFileld.value;
        this.model.subscriber.dob = this.FormSubscriber.controls.dob.value;
        this.model.subscriber.gender = this.FormSubscriber.controls.gender.value;
        this.model.subscriber.documentType = this.FormSubscriber.controls.documentType.value;
        this.model.subscriber.documentId = this.FormSubscriber.controls.documentId.value;
        this.model.subscriber.eHealthId = this.FormSubscriber.controls.eHealthId.value;
        this.model.subscriber.nationality = this.FormSubscriber.controls.nationality.value;
        this.model.subscriber.residencyType = this.FormSubscriber.controls.residencyType.value;
        this.model.subscriber.contactNumber = this.FormSubscriber.controls.contactNumber.value;
        this.model.subscriber.maritalStatus = this.FormSubscriber.controls.martialStatus.value;
        this.model.subscriber.bloodGroup = this.FormSubscriber.controls.bloodGroup.value;
        this.model.subscriber.preferredLanguage = this.FormSubscriber.controls.preferredLanguage.value;
        this.model.subscriber.emergencyPhoneNumber = this.FormSubscriber.controls.emergencyNumber.value;
        this.model.subscriber.email = this.FormSubscriber.controls.email.value;
        this.model.subscriber.addressLine = this.FormSubscriber.controls.addressLine.value;
        this.model.subscriber.streetLine = this.FormSubscriber.controls.streetLine.value;
        this.model.subscriber.city = this.FormSubscriber.controls.bcity.value;
        this.model.subscriber.state = this.FormSubscriber.controls.bstate.value;
        this.model.subscriber.country = this.FormSubscriber.controls.bcountry.value;
        this.model.subscriber.postalCode = this.FormSubscriber.controls.postalCode.value;
      } else {
        this.model.subscriber = null;
      }

      this.model.destinationId = this.FormPreAuthorization.controls.insurancePlanTpaNphiesId.value;

      this.model.insurancePlan = {};
      this.model.insurancePlan.payerId = this.FormPreAuthorization.controls.insurancePlanPayerId.value;
      this.model.insurancePlan.memberCardId = this.FormPreAuthorization.controls.insurancePlanMemberCardId.value;
      this.model.insurancePlan.coverageType = this.FormPreAuthorization.controls.insurancePlanCoverageType.value;
      this.model.insurancePlan.relationWithSubscriber = this.FormPreAuthorization.controls.insurancePlanRelationWithSubscriber.value;
      this.model.insurancePlan.expiryDate = this.FormPreAuthorization.controls.insurancePlanExpiryDate.value;
      this.model.insurancePlan.payerName = this.FormPreAuthorization.controls.insurancePlanPayerName.value;
      this.model.insurancePlan.payerNphiesId = this.FormPreAuthorization.controls.insurancePayerNphiesId.value;
      // this.model.insurancePlan.planId = this.FormPreAuthorization.controls.insurancePlanId.value;
      this.model.insurancePlan.primary = this.FormPreAuthorization.controls.insurancePlanPrimary.value;
      this.model.insurancePlan.tpaNphiesId = this.FormPreAuthorization.controls.insurancePlanTpaNphiesId.value;
      // this.model.beneficiaryId = this.FormPreAuthorization.controls.beneficiaryId.value;
      // this.model.payerNphiesId = this.FormPreAuthorization.controls.insurancePlanId.value;

      // this.model.coverageType = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].coverageType;
      // this.model.memberCardId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].memberCardId;
      // this.model.payerNphiesId = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].payerNphiesId;
      // // tslint:disable-next-line:max-line-length
      // this.model.relationWithSubscriber = this.selectedBeneficiary.plans.filter(x => x.payerNphiesId === this.model.payerNphiesId)[0].relationWithSubscriber;

      const preAuthorizationModel: any = {};
      preAuthorizationModel.dateOrdered = this.datePipe.transform(this.FormPreAuthorization.controls.dateOrdered.value, 'yyyy-MM-dd');
      if (this.FormPreAuthorization.controls.payeeType.value && this.FormPreAuthorization.controls.payeeType.value.value === 'provider') {
        // tslint:disable-next-line:max-line-length
        preAuthorizationModel.payeeId = this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0] ? this.payeeList.filter(x => x.cchiid === this.sharedServices.cchiId)[0].nphiesId : '';
      } else {
        preAuthorizationModel.payeeId = this.FormPreAuthorization.controls.payee.value;
      }

      preAuthorizationModel.payeeType = this.FormPreAuthorization.controls.payeeType.value.value;
      preAuthorizationModel.type = this.FormPreAuthorization.controls.type.value.value;
      preAuthorizationModel.subType = this.FormPreAuthorization.controls.subType.value.value;

      // tslint:disable-next-line:max-line-length
      preAuthorizationModel.eligibilityOfflineDate = this.datePipe.transform(this.FormPreAuthorization.controls.eligibilityOfflineDate.value, 'yyyy-MM-dd');
      preAuthorizationModel.eligibilityOfflineId = this.FormPreAuthorization.controls.eligibilityOfflineId.value;
      preAuthorizationModel.eligibilityResponseId = this.FormPreAuthorization.controls.eligibilityResponseId.value;
      preAuthorizationModel.episodeId = null;
      this.model.preAuthorizationInfo = preAuthorizationModel;

      this.model.supportingInfo = this.SupportingInfo.map(x => {
        // const model: any = {};
        // model.sequence = x.sequence;
        // model.category = x.category;
        // model.code = x.code;
        // model.fromDate = x.fromDate;
        // model.toDate = x.toDate;
        // model.value = x.value;
        // model.reason = x.reason;
        // model.attachment = x.byteArray;
        // model.attachmentName = x.attachmentName;
        // model.attachmentType = x.attachmentType;
        // model.attachmentDate = x.attachmentDate;
        // return model;
        const model: any = {};
        model.sequence = x.sequence;
        model.category = x.category;
        model.code = x.code;
        if (x.fromDate) {
          x.fromDate = this.datePipe.transform(x.fromDate, 'yyyy-MM-dd');
        }
        model.fromDate = x.fromDate;
        if (x.toDate) {
          x.toDate = this.datePipe.transform(x.toDate, 'yyyy-MM-dd');
        }
        model.toDate = x.toDate;
        model.value = x.value;
        model.reason = x.reason;
        model.attachment = x.attachment;
        model.attachmentName = x.attachmentName;
        model.attachmentType = x.attachmentType;
        if (x.attachmentDate) {
          x.attachmentDate = this.datePipe.transform(x.attachmentDate, 'yyyy-MM-dd');
        }
        model.attachmentDate = x.attachmentDate;
        return model;
      });

      this.model.diagnosis = this.Diagnosises.map(x => {
        const model: any = {};
        model.sequence = x.sequence;
        model.diagnosisDescription = x.diagnosisDescription;
        model.type = x.type;
        model.onAdmission = x.onAdmission;
        model.diagnosisCode = x.diagnosisCode;
        return model;
      });

      if (this.FormPreAuthorization.controls.accidentType.value.value) {
        const accidentModel: any = {};
        accidentModel.accidentType = this.FormPreAuthorization.controls.accidentType.value.value;
        accidentModel.streetName = this.FormPreAuthorization.controls.streetName.value;
        accidentModel.city = this.FormPreAuthorization.controls.city.value;
        accidentModel.state = this.FormPreAuthorization.controls.state.value;
        accidentModel.country = this.FormPreAuthorization.controls.country.value;
        accidentModel.date = this.datePipe.transform(this.FormPreAuthorization.controls.date.value, 'yyyy-MM-dd');
        this.model.accident = accidentModel;
      }

      this.model.careTeam = this.CareTeams.map(x => {
        const model: any = {};
        model.sequence = x.sequence;
        model.practitionerName = x.practitionerName;
        model.physicianCode = x.physicianCode;
        model.practitionerRole = x.practitionerRole;
        model.careTeamRole = x.careTeamRole;
        model.speciality = x.speciality;
        model.specialityCode = x.specialityCode;
        model.qualificationCode = x.qualificationCode;
        return model;
      });

      if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'vision') {
        if (this.FormPreAuthorization.controls.prescriber.value) {
          this.model.visionPrescription = {};
          // tslint:disable-next-line:max-line-length
          this.model.visionPrescription.dateWritten = this.datePipe.transform(this.FormPreAuthorization.controls.dateWritten.value, 'yyyy-MM-dd');
          this.model.visionPrescription.prescriber = this.FormPreAuthorization.controls.prescriber.value;
          this.model.visionPrescription.lensSpecifications = this.VisionSpecifications.map(x => {
            const model: any = {};
            model.sequence = x.sequence;
            model.product = x.product;
            model.eye = x.eye;
            model.sphere = x.sphere;
            model.cylinder = x.cylinder;
            model.axis = x.axis;
            model.prismAmount = x.prismAmount;
            model.prismBase = x.prismBase;
            model.multifocalPower = x.multifocalPower;
            model.lensPower = x.lensPower;
            model.lensBackCurve = x.lensBackCurve;
            model.lensDiameter = x.lensDiameter;
            model.lensDuration = x.lensDuration;
            model.lensDurationUnit = x.lensDurationUnit;
            model.lensColor = x.lensColor;
            model.lensBrand = x.lensBrand;
            model.lensNote = x.lensNote;
            return model;
          });
        }
      }

      this.model.items = this.Items.map(x => {
        // tslint:disable-next-line:max-line-length
        if ((this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value !== 'pharmacy') && x.careTeamSequence && x.careTeamSequence.length > 0) {
          const model: any = {};
          model.sequence = x.sequence;
          model.type = x.type;
          model.itemCode = x.itemCode.toString();
          model.itemDescription = x.itemDescription;
          model.nonStandardCode = x.nonStandardCode;
          model.nonStandardDesc = x.display;
          model.isPackage = x.isPackage;
          model.bodySite = x.bodySite;
          model.subSite = x.subSite;
          model.quantity = x.quantity;
          model.quantityCode = x.quantityCode;
          model.unitPrice = x.unitPrice;
          model.discount = x.discount;
          model.factor = x.factor;
          model.taxPercent = x.taxPercent;
          model.patientSharePercent = x.patientSharePercent;
          model.tax = x.tax;
          model.net = x.net;
          model.patientShare = x.patientShare;
          model.payerShare = x.payerShare;
          model.startDate = x.startDate;
          model.supportingInfoSequence = x.supportingInfoSequence;
          model.careTeamSequence = x.careTeamSequence;
          model.diagnosisSequence = x.diagnosisSequence;
          model.invoiceNo = null;

          model.itemDetails = x.itemDetails.map(y => {
            const dmodel: any = {};
            dmodel.sequence = y.sequence;
            dmodel.type = y.type;
            dmodel.code = y.itemCode.toString();
            dmodel.description = y.itemDescription;
            dmodel.nonStandardCode = y.nonStandardCode;
            dmodel.nonStandardDesc = y.display;
            dmodel.quantity = parseFloat(y.quantity);
            return dmodel;
          });

          return model;
        } else if (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value === 'pharmacy') {
          const model: any = {};
          model.sequence = x.sequence;
          model.type = x.type;
          model.itemCode = x.itemCode.toString();
          model.itemDescription = x.itemDescription;
          model.nonStandardCode = x.nonStandardCode;
          model.nonStandardDesc = x.display;
          model.isPackage = x.isPackage;
          model.bodySite = x.bodySite;
          model.subSite = x.subSite;
          model.quantity = x.quantity;
          model.unitPrice = x.unitPrice;
          model.discount = x.discount;
          model.factor = x.factor;
          model.taxPercent = x.taxPercent;
          model.patientSharePercent = x.patientSharePercent;
          model.tax = x.tax;
          model.net = x.net;
          model.patientShare = x.patientShare;
          model.payerShare = x.payerShare;
          model.startDate = x.startDate;
          model.supportingInfoSequence = x.supportingInfoSequence;
          model.careTeamSequence = x.careTeamSequence;
          model.diagnosisSequence = x.diagnosisSequence;
          model.invoiceNo = null;

          model.itemDetails = x.itemDetails.map(y => {
            const dmodel: any = {};
            dmodel.sequence = y.sequence;
            dmodel.type = y.type;
            dmodel.code = y.itemCode.toString();
            dmodel.description = y.itemDescription;
            dmodel.nonStandardCode = y.nonStandardCode;
            dmodel.nonStandardDesc = y.display;
            dmodel.quantity = parseFloat(y.quantity);
            dmodel.quantityCode = y.quantityCode;
            return dmodel;
          });

          return model;
        }
      }).filter(x => x !== undefined);

      this.model.totalNet = 0;
      this.model.items.forEach((x) => {
        this.model.totalNet += x.net;
      });

      console.log('Model', this.model);
      this.sharedServices.loadingChanged.next(true);
      this.providerNphiesApprovalService.sendApprovalRequest(this.sharedServices.providerId, this.model).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const body: any = event.body;
            if (body.status === 'OK') {
              if (body.outcome.toString().toLowerCase() === 'error') {
                const errors: any[] = [];

                if (body.disposition) {
                  errors.push(body.disposition);
                }

                if (body.errors && body.errors.length > 0) {
                  body.errors.forEach(err => {
                    err.coding.forEach(codex => {
                      errors.push(codex.code + ' : ' + codex.display);
                    });
                  });
                }
                this.sharedServices.loadingChanged.next(false);
                if (body.transactionId) {
                  this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors, null, null, body.transactionId);
                } else {
                  this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors);
                }

              } else {
                this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
                if (this.claimReuseId) {
                  this.closeEvent.emit({ IsReuse: true });
                } else {
                  this.getTransactionDetails(body.approvalRequestId, body.approvalResponseId);
                }
              }
            }
          }
        }
      }, error => {
        this.sharedServices.loadingChanged.next(false);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
          } else if (error.status === 404) {
            const errors: any[] = [];
            if (error.error.errors) {
              error.error.errors.forEach(x => {
                errors.push(x);
              });
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
            } else {
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
            }
          } else if (error.status === 500) {
            this.dialogService.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK');
          } else if (error.status === 503) {
            const errors: any[] = [];
            if (error.error.errors) {
              error.error.errors.forEach(x => {
                errors.push(x);
              });
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
            } else {
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
            }
          }
        }
      });
    }
  }

  getTransactionDetails(requestId = null, responseId = null) {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesApprovalService.getTransactionDetails(this.sharedServices.providerId, requestId, responseId).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          this.detailsModel = body;
          this.IsJSONPosted = true;
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
          } else {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
          }
        } else if (error.status === 404) {
          this.dialogService.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK');
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  reset() {
    this.model = {};
    this.detailsModel = {};
    this.FormPreAuthorization.reset();
    this.FormPreAuthorization.patchValue({
      insurancePlanId: '',
      type: '',
      subType: '',
      accidentType: '',
      country: '',
      payeeType: this.sharedDataService.payeeTypeList.filter(x => x.value === 'provider')[0]
    });
    this.onPayeeTypeChange();
    this.CareTeams = [];
    this.CareTeams = [];
    this.Diagnosises = [];
    this.SupportingInfo = [];
    this.VisionSpecifications = [];
    this.Items = [];
    this.isSubmitted = false;
    this.IsJSONPosted = false;
  }

  get IsCareTeamRequired() {
    if (this.isSubmitted) {
      // tslint:disable-next-line:max-line-length
      if (!this.FormPreAuthorization.controls.type.value || (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value !== 'pharmacy')) {
        if (this.CareTeams.length === 0) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  viewAttachment(e, item) {
    e.preventDefault();
    this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
      data: {
        filename: item.attachmentName, attachment: item.byteArray
      }, panelClass: ['primary-dialog', 'dialog-xl']
    });
  }



  getImageOfBlob(attachmentName, attachment) {
    const fileExt = attachmentName.split('.').pop();
    if (fileExt.toLowerCase() === 'pdf') {
      const objectURL = `data:application/pdf;base64,` + attachment;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    } else {
      const objectURL = `data:image/${fileExt};base64,` + attachment;
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }
  }

  onNewBornChangeState(event) {
    if (event.checked) {
      this.FormPreAuthorization.controls.subscriberName.setValidators([Validators.required]);
      this.FormPreAuthorization.controls.subscriberName.updateValueAndValidity();
      this.IsSubscriberRequired = true;
    } else {
      this.FormPreAuthorization.controls.subscriberName.clearValidators();
      this.FormPreAuthorization.controls.subscriberName.updateValueAndValidity();
      this.IsSubscriberRequired = false;
    }
  }


  get period() {
    if (this.data.period) {
      return this.data.period.replace('P', '').replace('D', ' Days').replace('M', ' Months').replace('Y', ' Years');
    } else {
      return this.data.period;
    }
  }

  disableItemsButton() {
    return !this.FormPreAuthorization.controls.type.value || (this.FormPreAuthorization.controls.type.value && this.FormPreAuthorization.controls.type.value.value !== 'pharmacy' && this.CareTeams.length === 0);
  }

}
