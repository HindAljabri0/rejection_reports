
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { BeneficiaryModel } from 'src/app/models/nphies/BeneficiaryModel';
import { BeneficiarySearch } from 'src/app/models/nphies/beneficiarySearch';
import { InsurancePlan } from 'src/app/models/nphies/insurancePlan';
import { Payer } from 'src/app/models/nphies/payer';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { SharedServices } from 'src/app/services/shared.services';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styles: []
})
export class BeneficiaryComponent implements OnInit {
  addMode = false;
  editMode = false;
  viewMode = false;

  currentOpenInsuranceDetails = -1;


  selectedNationality = '';
  selectedMaritalStatus = '';
  selectedDocumentType = '';
  selectedGender = '';
  selectedResidencyType = '';
  selectedBloodGroup = '';
  selectedState = '';
  selectedLanguages = '';
  payersListErorr = '';
  messageError = '';
  setPrimary = '0';
  fullName = '';
  providerId = '';
  IdPlaceholder = "Enter national ID or Iqama";

  beneficiaryId: string;
  nationalities = nationalities;
  Beneficiaries: BeneficiarySearch[];
  payersList: Payer[] = [];
  beneficiaryinfo: BeneficiaryModel;


  dobFormControl: FormControl = new FormControl();
  documentIdFormControl: FormControl = new FormControl();
  documentIdCCHIFormControl: FormControl = new FormControl();
  systemTypeFormControl: FormControl = new FormControl('1');
  nationalityFilterCtrl: FormControl = new FormControl();
  countryFilterCtrl: FormControl = new FormControl();
  firstNameController: FormControl = new FormControl();
  secondNameController: FormControl = new FormControl();
  thirdNameController: FormControl = new FormControl();
  familyNameController: FormControl = new FormControl();
  beneficiaryFileIdController: FormControl = new FormControl();
  fullNameController: FormControl = new FormControl();
  EHealthIdNameController: FormControl = new FormControl();
  contactNumberController: FormControl = new FormControl();
  emergencyPhoneNumberController: FormControl = new FormControl();
  emailController: FormControl = new FormControl();

  BorderNoControl: FormControl = new FormControl();
  VisaExpiryControl: FormControl = new FormControl();
  VisaTitleControl: FormControl = new FormControl();
  VisaNumberControl: FormControl = new FormControl();
  VisaTypeControl: FormControl = new FormControl();
  PassportControl: FormControl = new FormControl();

  houseNumberController = new FormControl();
  streetNameController = new FormControl();
  cityNameController = new FormControl();
  stateController = new FormControl();
  selectedCountry = '';
  selectedVisaType = '';
  postalCodeController = new FormControl();

  insurancePlans: {
    isPrimary: boolean,
    selectePayer: string,
    expiryDateController: FormControl
    memberCardId: FormControl,
    policyNumber: FormControl,
    selecteSubscriberRelationship: string
    selecteCoverageType: string,
    payerErorr: string,
    patientShare: FormControl,
    maxLimit: FormControl,
    issueDate: FormControl,
    networkId: FormControl,
    sponsorNumber: FormControl,
    policyClassName: FormControl,
    policyHolder: FormControl,
    insuranceStatus: FormControl,
    insuranceDuration: FormControl,
    insuranceType: FormControl,
    memberCardIdErorr: string,
    policyNumberErorr: string,
    patientShareErorr: string,
    maxLimitErorr: string,
    selecteSubscriberRelationshipErorr: string,
    selecteCoverageTypeErorr: string,
    tpaNphiesId: string
  }[] = [];

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
  VisaTypes: { Code: number, Name: string }[] = [
    { Code: 6, Name: 'Transit - مرور' },
    { Code: 10, Name: 'Tourism - سياحية' },
    { Code: 14, Name: 'Goods delivery - توصيل بضائع' },
    { Code: 23, Name: 'Commercial visit - زيارة تجارية' },
    { Code: 24, Name: 'Family Visit - زيارة عائلية' },
    { Code: 21, Name: 'Business Man - رجال اعمال' },
    { Code: 22, Name: 'ًWork Visit - زيارة عمل' },
    { Code: 27, Name: 'Personal Visit - زيارة شخصية' },
    { Code: 40, Name: 'Dependent - مرافق' },
    { Code: 30, Name: 'ُEvent Visit - زيارة فعالية' },
  ];
  SystemTypes: { Code: number, Name: string, tooltip: string }[] = [
    { Code: 1, Name: 'HIDP', tooltip: 'Health Insurance for Nationals and Residents' },
    { Code: 2, Name: 'VIDP', tooltip: 'Health Insurance for Visitors' },
    { Code: 3, Name: 'SCTH', tooltip: 'Health Insurance for Tourists' },
    { Code: 4, Name: 'UIDP', tooltip: 'Health Insurance for Premium Residency' },
    { Code: 5, Name: 'HUIDP', tooltip: 'Health Insurance for Hajj & Umrah Visitors' }
  ];
  SubscriberRelationship: { Code: string, Name: string }[] = [
    { Code: 'CHILD', Name: 'Child' },
    { Code: 'PARENT', Name: 'Parent' },
    { Code: 'SPOUSE', Name: 'Spouse' },
    { Code: 'COMMON', Name: 'Common Law Spouse' },
    { Code: 'SELF', Name: 'Self' },
    { Code: 'INJURED', Name: 'Injured Party' },
    { Code: 'OTHER', Name: 'Other' },
  ];

  beneficiaryTypeList = this.sharedDataService.beneficiaryTypeList;

  _onDestroy = new Subject<void>();
  filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allMaritalStatuses: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allBloodType: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allSubscriberRelationship: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);


  dialogData: MessageDialogData;
  errors = {
    dob: '',
    documentType: '',
    documentId: '',
    gender: '',
    fullName: '',
    documentIdCCHI: '',
    SystemTypeCchi: ''
  };

  beneficiaryModel = new BeneficiaryModel();
  isCCHID = false;

  constructor(
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private providersBeneficiariesService: ProvidersBeneficiariesService,
    private dialogService: DialogService,
    private sharedDataService: SharedDataService
  ) {
    this.beneficiaryinfo = new BeneficiaryModel();
  }

  ngOnInit() {

    this.providersBeneficiariesService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array) {
          this.payersList = event.body as Payer[];
        }



      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          this.payersListErorr = err.message;

        }
      });

    this.providerId = this.sharedServices.providerId;
    this.filteredNations.next(this.nationalities.slice());
    this.allMaritalStatuses.next(this.maritalStatuses.slice());
    this.allBloodType.next(this.bloodGroup);
    this.allSubscriberRelationship.next(this.SubscriberRelationship);



    this.nationalityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterNationality();
      });



    this.beneficiaryId = this.activatedRoute.snapshot.paramMap.get('beneficiaryId');
    const url = this.router.url;
    if (url.endsWith('add')) {
      this.addMode = true;
    } else {
      this.getBeneficiary(this.beneficiaryId);
      this.viewMode = true;
    }
    // else if (this.beneficiaryId != null && url.endsWith('edit')) {
    //   this.editMode = true;
    //   this.getBeneficiary(this.beneficiaryId);
    // }

  }

  changeMode() {
    this.viewMode = !this.viewMode;
    this.editMode = !this.editMode;
    this.getBeneficiary(this.beneficiaryId);
  }


  getCoverageTypeName(CoverageTypeCode: string) {

    switch (CoverageTypeCode) {
      case 'EHCPOL':
        return 'Extended healthcare';

      case 'PUBLICPOL':
        return 'Public healthcare';

      default:
        return null;
    }
  }

  getSubscriberRelationshipName(SubscriberRelationshipCode: string) {
    for (const SubscriberRelationship of this.SubscriberRelationship) {
      if (SubscriberRelationship.Code == SubscriberRelationshipCode) {
        return SubscriberRelationship.Name;
      }
    }
  }


  getBloodTypeName(BloodCode: string) {
    for (const blodType of this.bloodGroup) {
      if (blodType.Code == BloodCode) {
        return blodType.Name;
      }
    }

  }

  getPayerName(PayerId: string) {
    for (const payer of this.payersList) {
      if (payer.payerId == PayerId) {
        return payer.englistName;
      }
    }

  }

  getMaritalStatusName(maritalStatusCode: string) {
    for (const maritalStatus of this.maritalStatuses) {
      if (maritalStatus.Code == maritalStatusCode) {
        return maritalStatus.Name;
      }
    }

  }

  getNationalitiesName(NationalitiesName: string) {
    for (const nationality of this.nationalities) {
      if (nationality.Code == NationalitiesName) {
        return nationality.Name;
      }
    }
  }

  getBeneficiary(beneficiaryId: string) {

    this.providersBeneficiariesService.getBeneficiaryById(this.sharedServices.providerId, beneficiaryId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.beneficiaryinfo = event.body as BeneficiaryModel;
        // tslint:disable-next-line:max-line-length
        this.beneficiaryinfo.documentTypeName = this.beneficiaryTypeList.filter(x => x.value === this.beneficiaryinfo.documentType)[0] ? this.beneficiaryTypeList.filter(x => x.value === this.beneficiaryinfo.documentType)[0].name : '-';
        this.setDateforView(this.beneficiaryinfo);

      }

    }, err => {

      if (err instanceof HttpErrorResponse) {
        console.log(err.message);


      }
    });

    this.router.resetConfig(this.router.config);
    return true;
  }

  get showbeneficiaryForm() {

    return this.viewMode || this.editMode;

  }


  isPrimary(index: string) {
    if (index === 'true') {
      return true;
    } else {
      return false;
    }
  }

  selectedPayer(payerId: string) {
    for (const payer of this.payersList) {
      if (payer.payerId == payerId) {
        return payer.englistName + '(' + payer.arabicName + ')';
      }
    }
  }

  isNull(value: string) {
    return value == null ? '_' : value;
  }

  setDateforView(beneficiaryinfo: BeneficiaryModel) {

    this.insurancePlans = [];
    this.firstNameController.setValue(beneficiaryinfo.firstName);
    this.secondNameController.setValue(beneficiaryinfo.middleName);
    this.thirdNameController.setValue(beneficiaryinfo.lastName);
    this.familyNameController.setValue(beneficiaryinfo.familyName);
    this.fullNameController.setValue(beneficiaryinfo.fullName);
    this.dobFormControl.setValue(beneficiaryinfo.dob);
    this.selectedGender = beneficiaryinfo.gender == null ? 'null' : beneficiaryinfo.gender.toLocaleUpperCase();
    this.selectedNationality = beneficiaryinfo.nationality;
    this.contactNumberController.setValue(beneficiaryinfo.contactNumber);
    this.emailController.setValue(beneficiaryinfo.email);
    this.emergencyPhoneNumberController.setValue(beneficiaryinfo.emergencyNumber);
    this.selectedDocumentType = beneficiaryinfo.documentType;
    this.documentIdFormControl.setValue(beneficiaryinfo.documentId);
    this.beneficiaryFileIdController.setValue(beneficiaryinfo.beneficiaryFileId);
    this.EHealthIdNameController.setValue(beneficiaryinfo.eHealthId);
    this.selectedResidencyType = beneficiaryinfo.residencyType;
    this.selectedBloodGroup = beneficiaryinfo.bloodGroup;
    this.selectedMaritalStatus = beneficiaryinfo.martialStatus;
    this.selectedLanguages = beneficiaryinfo.preferredLanguage;
    this.houseNumberController.setValue(beneficiaryinfo.addressLine);
    this.streetNameController.setValue(beneficiaryinfo.streetLine);
    this.cityNameController.setValue(beneficiaryinfo.city);
    this.stateController.setValue(beneficiaryinfo.state);
    this.selectedCountry = beneficiaryinfo.country;
    this.postalCodeController.setValue(beneficiaryinfo.postalCode);
    this.BorderNoControl.setValue(beneficiaryinfo.borderNumber);
    this.VisaExpiryControl.setValue(beneficiaryinfo.visaExpiryDate);
    this.VisaTitleControl.setValue(beneficiaryinfo.visitTitle);
    this.VisaNumberControl.setValue(beneficiaryinfo.visaNumber);
    this.VisaTypeControl.setValue(beneficiaryinfo.visaType);
    this.PassportControl.setValue(beneficiaryinfo.passportNumber);
    this.selectedVisaType = beneficiaryinfo.visaType;

    for (const insurancePlans of beneficiaryinfo.insurancePlans) {
      this.insurancePlans.push(
        {
          isPrimary: insurancePlans.isPrimary,
          selectePayer: insurancePlans.payerNphiesId,
          expiryDateController: new FormControl(insurancePlans.expiryDate),
          memberCardId: new FormControl(insurancePlans.memberCardId),
          policyNumber: new FormControl(insurancePlans.policyNumber),
          selecteSubscriberRelationship: insurancePlans.relationWithSubscriber
            ? insurancePlans.relationWithSubscriber.toUpperCase()
            : insurancePlans.relationWithSubscriber,
          selecteCoverageType: insurancePlans.coverageType,

          maxLimit: insurancePlans.maxLimit ? new FormControl(insurancePlans.maxLimit) : new FormControl(),
          patientShare: insurancePlans.patientShare ? new FormControl(insurancePlans.patientShare) : new FormControl(),
          // tslint:disable-next-line:max-line-length
          payerErorr: null, policyNumberErorr: null, memberCardIdErorr: null, selecteSubscriberRelationshipErorr: null, selecteCoverageTypeErorr: null, maxLimitErorr: null, patientShareErorr: null,
          issueDate: new FormControl(insurancePlans.issueDate),
          networkId: new FormControl(insurancePlans.networkId),
          sponsorNumber: new FormControl(insurancePlans.sponsorNumber),
          policyClassName: new FormControl(insurancePlans.policyClassName),
          policyHolder: new FormControl(insurancePlans.policyHolder),
          insuranceStatus: new FormControl(insurancePlans.insuranceStatus),
          insuranceDuration: new FormControl(insurancePlans.insuranceDuration),
          insuranceType: new FormControl(insurancePlans.insuranceType),
          tpaNphiesId: insurancePlans.tpaNphiesId ? insurancePlans.tpaNphiesId : (this.isCCHID ? null : '-1')
        }
      );
    }

    // console.log(beneficiaryinfo.insurancePlans[0].isPrimary);

  }

  onNameChanged() {
    if ((this.fullNameController.value != null && this.fullNameController.value.trim().length > 0)) {
      this.firstNameController.disable();
      this.secondNameController.disable();
      this.thirdNameController.disable();
      this.familyNameController.disable();
    } else {
      this.firstNameController.enable();
      this.secondNameController.enable();
      this.thirdNameController.enable();
      this.familyNameController.enable();
    }
  }



  isFullNameDisabled() {
    if ((this.firstNameController.value != null && this.firstNameController.value.trim().length > 0) ||
      (this.secondNameController.value != null && this.secondNameController.value.trim().length > 0) ||
      (this.thirdNameController.value != null && this.thirdNameController.value.trim().length > 0) ||
      (this.familyNameController.value != null && this.familyNameController.value.trim().length > 0)) {
      this.fullNameController.setValue(
        (this.firstNameController.value == null ? ' ' : this.firstNameController.value + ' ') +
        (this.secondNameController.value == null ? ' ' : this.secondNameController.value + ' ') +
        (this.thirdNameController.value == null ? ' ' : this.thirdNameController.value + ' ') +
        (this.familyNameController.value == null ? ' ' : this.familyNameController.value + ' ').trim());

      this.fullNameController.disable();

    } else {
      this.fullNameController.enable();
    }
  }




  addInsurancePlan() {

    if (this.payersListErorr != null && this.payersListErorr != null) {
      this.insurancePlans.push({
        isPrimary: false,
        selectePayer: '',
        expiryDateController: new FormControl(),
        memberCardId: new FormControl(),
        policyNumber: new FormControl(),
        selecteSubscriberRelationship: '',
        selecteCoverageType: '',
        patientShare: new FormControl(),
        maxLimit: new FormControl(),
        payerErorr: null,
        memberCardIdErorr: null,
        policyNumberErorr: null,
        patientShareErorr: null,
        maxLimitErorr: null,
        issueDate: new FormControl(),
        networkId: new FormControl(),
        sponsorNumber: new FormControl(),
        policyClassName: new FormControl(),
        policyHolder: new FormControl(),
        insuranceStatus: new FormControl(),
        insuranceDuration: new FormControl(),
        insuranceType: new FormControl(),
        selecteSubscriberRelationshipErorr: null, selecteCoverageTypeErorr: null,
        tpaNphiesId: ''
      });


    } else {

      this.dialogService.openMessageDialog({
        title: '',
        // tslint:disable-next-line:max-line-length
        message: `We could not load required information to create insurance plan. Please add your beneficiary and try adding insurance plans later.`,
        isError: true
      });
    }
  }

  deleteInsurancePlan(i: number) {
    this.insurancePlans.splice(i, 1);
  }

  filterNationality() {

    if (!this.nationalities) {
      return;
    }
    // get the search keyword
    let search = this.nationalityFilterCtrl.value;
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


  updateDate() {
    if (this.insurancePlans != null && this.insurancePlans.length != 0) {
      for (const plan of this.insurancePlans) {
        plan.isPrimary = false;

      }

      this.insurancePlans[Number.parseInt(this.setPrimary, 10)].isPrimary = true;

    }

    if (this.checkError()) { return; }
    this.sharedServices.loadingChanged.next(true);
    this.setDateforSaveBeneficiary();
    this.providersBeneficiariesService.editBeneficiaries(
      this.providerId, this.beneficiaryId, this.beneficiaryModel
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.isCCHID = false;
        this.dialogService.openMessageDialog({
          title: '',
          message: `Beneficiary updated successfully`,
          isError: false
        }).subscribe(event => { this.changeMode(); });
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 500) {
          this.messageError = 'could not reach server Please try again later ';
        } else {
          this.messageError = err.message;
        }
        this.dialogService.openMessageDialog({
          title: '',
          message: this.messageError,
          isError: true
        });
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  setDateforSaveBeneficiary() {
    this.beneficiaryModel.firstName = this.firstNameController.value;
    this.beneficiaryModel.middleName = this.secondNameController.value;
    this.beneficiaryModel.lastName = this.thirdNameController.value;
    this.beneficiaryModel.familyName = this.familyNameController.value;
    this.beneficiaryModel.fullName = this.fullNameController.value;
    this.beneficiaryModel.dob = new Date(moment(this.dobFormControl.value).format('YYYY-MM-DD'));
    this.beneficiaryModel.gender = this.selectedGender;
    this.beneficiaryModel.nationality = this.selectedNationality == '' ? null : this.selectedNationality;
    this.beneficiaryModel.contactNumber = this.contactNumberController.value;
    this.beneficiaryModel.email = this.emailController.value;
    this.beneficiaryModel.emergencyNumber = this.emergencyPhoneNumberController.value;
    this.beneficiaryModel.documentType = this.selectedDocumentType;
    this.beneficiaryModel.documentId = this.documentIdFormControl.value;
    this.beneficiaryModel.beneficiaryFileId = this.beneficiaryFileIdController.value;
    this.beneficiaryModel.eHealthId = this.EHealthIdNameController.value;
    this.beneficiaryModel.residencyType = this.selectedResidencyType == '' ? null : this.selectedResidencyType;
    this.beneficiaryModel.bloodGroup = this.selectedBloodGroup == '' ? null : this.selectedBloodGroup;
    this.beneficiaryModel.martialStatus = this.selectedMaritalStatus == '' ? null : this.selectedMaritalStatus;
    this.beneficiaryModel.preferredLanguage = this.selectedLanguages == '' ? null : this.selectedLanguages;
    this.beneficiaryModel.addressLine = this.houseNumberController.value;
    this.beneficiaryModel.streetLine = this.streetNameController.value;
    this.beneficiaryModel.city = this.cityNameController.value;
    this.beneficiaryModel.state = this.stateController.value;
    this.beneficiaryModel.documentId = this.documentIdFormControl.value;
    this.beneficiaryModel.country = this.selectedCountry == '' ? null : this.selectedCountry;
    this.beneficiaryModel.postalCode = this.postalCodeController.value;
    this.beneficiaryModel.borderNumber = this.BorderNoControl.value;
    this.beneficiaryModel.visaExpiryDate = this.VisaExpiryControl.value ? new Date(moment(this.VisaExpiryControl.value).format('YYYY-MM-DD')) : null;
    this.beneficiaryModel.visitTitle = this.VisaTitleControl.value;
    this.beneficiaryModel.visaNumber = this.VisaNumberControl.value;
    this.beneficiaryModel.passportNumber = this.PassportControl.value;
    this.beneficiaryModel.visaType = this.selectedVisaType;

    this.beneficiaryModel.insurancePlans = this.insurancePlans.map(insurancePlan => ({
      payerNphiesId: (insurancePlan.selectePayer.indexOf(':') > -1) ? insurancePlan.selectePayer.split(':')[1] : insurancePlan.selectePayer,
      expiryDate: new Date(moment(insurancePlan.expiryDateController.value).format('YYYY-MM-DD')),
      // tslint:disable-next-line:max-line-length
      payerId: (insurancePlan.selectePayer == '' || insurancePlan.selectePayer == '-1') ? null : ((insurancePlan.selectePayer.indexOf(':') > -1) ? insurancePlan.selectePayer.split(':')[1] : insurancePlan.selectePayer),
      memberCardId: insurancePlan.memberCardId.value,
      policyNumber: insurancePlan.policyNumber.value,
      relationWithSubscriber: insurancePlan.selecteSubscriberRelationship == '' ? null : insurancePlan.selecteSubscriberRelationship,
      coverageType: insurancePlan.selecteCoverageType == '' ? null : insurancePlan.selecteCoverageType,
      isPrimary: insurancePlan.isPrimary,
      maxLimit: insurancePlan.maxLimit.value,
      patientShare: insurancePlan.patientShare.value,
      issueDate: insurancePlan.issueDate.value,
      networkId: insurancePlan.networkId.value,
      sponsorNumber: insurancePlan.sponsorNumber.value,
      policyClassName: insurancePlan.policyClassName.value,
      policyHolder: insurancePlan.policyHolder.value,
      insuranceStatus: insurancePlan.insuranceStatus.value,
      insuranceDuration: insurancePlan.insuranceDuration.value,
      insuranceType: insurancePlan.insuranceType.value,
      // tslint:disable-next-line:max-line-length
      tpaNphiesId: (insurancePlan.tpaNphiesId === '-1' || insurancePlan.tpaNphiesId === '' || insurancePlan.tpaNphiesId === undefined) ? null : insurancePlan.tpaNphiesId
    }));

    console.log(this.beneficiaryModel);
  }

  save() {

    if (this.insurancePlans != null && this.insurancePlans.length != 0) {
      for (const plan of this.insurancePlans) {
        plan.isPrimary = false;
      }
      this.insurancePlans[Number.parseInt(this.setPrimary, 10)].isPrimary = true;
    }

    if (this.checkError()) { return; }

    this.sharedServices.loadingChanged.next(true);

    this.setDateforSaveBeneficiary();

    this.providersBeneficiariesService.saveBeneficiaries(
      this.beneficiaryModel, this.providerId
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        const beneficiaryId = event.body['beneficiaryId'];
        this.dialogService.openMessageDialog({
          title: '',
          message: `Beneficiary added successfully`,
          isError: false
        }).subscribe(childEvent => {
          const path = `/nphies/beneficiary/${beneficiaryId}`;
          this.location.go(path);
          window.location.reload();
        });
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 400) {
          this.dialogService.showMessage(err.error.message, '', 'alert', true, 'OK', err.error.errors);
        } else if (err.status === 404) {
          // const errors: any[] = [];
          // if (err.error.errors) {
          //     err.error.errors.forEach(x => {
          //         errors.push(x);
          //     });
          // this.dialogService.showMessage(err.error.message, '', 'alert', true, 'OK', errors);
          // } else {
          this.dialogService.showMessage(err.message, '', 'alert', true, 'OK');
          // }
        } else if (err.status === 500) {
          this.dialogService.showMessage('Could not reach server, Please try again later.', '', 'alert', true, 'OK');
        } else {
          this.dialogService.showMessage(err.message, '', 'alert', true, 'OK');
        }
      }
      // if (err instanceof HttpErrorResponse) {
      //     if (err.status == 500) {
      //         this.messageError = "could not reach server Please try again later "
      //     } else {
      //         this.messageError = err.message;
      //     }
      //     this.dialogService.openMessageDialog({
      //         title: '',
      //         message: this.messageError,
      //         isError: true
      //     });
      this.sharedServices.loadingChanged.next(false);
      // }
    });
  }

  isValidDate(date): boolean {
    return date != null && !Number.isNaN(new Date(moment(date).format('YYYY-MM-DD')).getTime());
  }
  checkError() {
    let thereIsError = false;
    this.errors.dob = '';
    this.errors.documentType = '';
    this.errors.documentId = '';
    this.errors.gender = '';
    if (this.selectedDocumentType == null || this.selectedDocumentType == '') {
      this.errors.documentType = 'Document Type must be specified';
      thereIsError = true;
    }
    if (this.documentIdFormControl.value == null || this.documentIdFormControl.value.trim().length <= 0) {
      this.errors.documentId = 'Document ID must be specified';
      thereIsError = true;
    }

    if (this.fullNameController.value == null || this.fullNameController.value.trim().length <= 0) {
      this.errors.fullName = 'Full Name must be specified';
      thereIsError = true;
    }
    if (this.dobFormControl.value == null) {
      this.errors.dob = 'Date of Brith must be specified';
      thereIsError = true;
    }
    if (this.selectedGender == null || this.selectedGender == '') {
      this.errors.gender = 'Gender must be specified';
      thereIsError = true;
    }


    for (const insurancePlan of this.insurancePlans) {
      if (insurancePlan.selectePayer == null || insurancePlan.selectePayer == '' || insurancePlan.selectePayer == '-1') {
        insurancePlan.payerErorr = 'Payer must be specified';
        thereIsError = true;
      } else {
        insurancePlan.payerErorr = '';
      }

      if (insurancePlan.memberCardId.value == null || insurancePlan.memberCardId.value.trim().length <= 0) {
        insurancePlan.memberCardIdErorr = 'Member Card ID must be specified';
        thereIsError = true;
      } else {
        insurancePlan.memberCardIdErorr = '';
      }

      if (insurancePlan.selecteSubscriberRelationship == null || insurancePlan.selecteSubscriberRelationship.trim().length <= 0) {
        insurancePlan.selecteSubscriberRelationshipErorr = 'Subscriber Relationship must be specified';
        thereIsError = true;
      } else {
        insurancePlan.selecteSubscriberRelationshipErorr = '';
      }

      if (insurancePlan.selecteCoverageType == null || insurancePlan.selecteCoverageType.trim().length <= 0) {
        insurancePlan.selecteCoverageTypeErorr = 'Coverage Type must be specified';
        thereIsError = true;
      } else {
        insurancePlan.selecteCoverageTypeErorr = '';
      }

    }

    return thereIsError;

  }

  IsPayerErorr(i) {
    let hasError = false;
    this.insurancePlans.filter((x, index) => index === i).forEach(x => {
      if (x.selectePayer == null || x.selectePayer == '' || x.selectePayer == '-1') {
        x.payerErorr = 'Payer must be specified';
        hasError = true;
      } else {
        x.payerErorr = '';
      }
    });
    return hasError;
  }

  IsMemberCardIdErorr(i) {
    let hasError = false;
    this.insurancePlans.filter((x, index) => index === i).forEach(x => {
      if (x.memberCardId.value == null || x.memberCardId.value.trim().length <= 0) {
        x.memberCardIdErorr = 'Member Card ID must be specified';
        hasError = true;
      } else {
        x.memberCardIdErorr = '';
      }
    });
    return hasError;
  }

  IsSelecteCoverageTypeErorr(i) {
    let hasError = false;
    this.insurancePlans.filter((x, index) => index === i).forEach(x => {
      if (x.selecteCoverageType == null || x.selecteCoverageType.trim().length <= 0) {
        x.selecteCoverageTypeErorr = 'Coverage Type must be specified';
        hasError = true;
      } else {
        x.selecteCoverageTypeErorr = '';
      }
    });
    return hasError;
  }

  IsSelecteSubscriberRelationshipErorr(i) {
    let hasError = false;
    this.insurancePlans.filter((x, index) => index === i).forEach(x => {
      if (x.selecteSubscriberRelationship == null || x.selecteSubscriberRelationship.trim().length <= 0) {
        x.selecteSubscriberRelationshipErorr = 'Subscriber Relationship must be specified';
        hasError = true;
      } else {
        x.selecteSubscriberRelationshipErorr = '';
      }

    });
    return hasError;
  }

  getSelectedPayerName(index) {
    const retval = this.payersList.find((p) => {
      return p.payerId == this.insurancePlans[index].selectePayer;
    });
    if (retval) {
      return `${retval.englistName}(${retval.arabicName})`;
    } else {
      return null;
    }
  }
  upadatePlaceHolder() {
    if (this.systemTypeFormControl.value == '1') {
      this.IdPlaceholder = "Enter national ID or Iqama";
    } else if (this.systemTypeFormControl.value == '2') {
      this.IdPlaceholder = "Enter Visa number, Passport Number or Border Number";
    } else if (this.systemTypeFormControl.value == '3' || this.systemTypeFormControl.value == '4') {
      this.IdPlaceholder = "Enter Visa number or Passport Number";
    } else if (this.systemTypeFormControl.value == '5') {
      this.IdPlaceholder = "Enter Passport Number";
    } else {
      this.IdPlaceholder = "Enter national ID or Iqama";
    }
  }
  getInfoFromCCHI() {
    this.isCCHID = true;
    let thereIsError = false;

    if (this.systemTypeFormControl.value == null || this.systemTypeFormControl.value.trim().length <= 0) {
      this.errors.SystemTypeCchi = 'System Type must be specified';
      thereIsError = true;
      return;
    }
    if (this.documentIdCCHIFormControl.value == null || this.documentIdCCHIFormControl.value.trim().length <= 0) {
      this.errors.documentIdCCHI = 'Document ID must be specified';
      thereIsError = true;
      return;
    }

    this.sharedServices.loadingChanged.next(true);

    this.providersBeneficiariesService.getBeneficiaryFromCCHI(
      this.providerId,
      this.documentIdCCHIFormControl.value,
      this.systemTypeFormControl.value
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.beneficiaryinfo = event.body as BeneficiaryModel;
        if (this.beneficiaryinfo.fullName != null) {
          this.beneficiaryinfo.documentTypeName = this.beneficiaryTypeList.filter(
            x => x.value === this.beneficiaryinfo.documentType)[0]
            ? this.beneficiaryTypeList.filter(x => x.value === this.beneficiaryinfo.documentType)[0].name
            : '-';
          this.setDateforView(this.beneficiaryinfo);

        } else {
          this.setDateforView(this.beneficiaryinfo);
          this.dialogService.openMessageDialog({
            title: '',
            message: `No Data Returned from CCHI`,
            isError: true
          });
        }
        this.sharedServices.loadingChanged.next(false);
      }

    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: `No Data Returned from CCHI`,
          isError: true
        });
      }
    });
  }

  toggleInsuranceRecord(i) {
    if (this.currentOpenInsuranceDetails == i) {
      this.currentOpenInsuranceDetails = -1;
    } else {
      this.currentOpenInsuranceDetails = i;
    }
  }

}
