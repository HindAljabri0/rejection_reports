
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { from, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { BeneficiaryModel } from 'src/app/models/nphies/BeneficiaryModel';
import { BeneficiarySearch } from 'src/app/models/nphies/beneficiarySearch';
import { Payer } from 'src/app/models/nphies/payer';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styles: []
})
export class BeneficiaryComponent implements OnInit {
  addMode = false;
  editMode = false;
  viewMode = false;


  selectedNationality = "";
  selectedMaritalStatus = "";
  selectedDocumentType = "";
  selectedGender = ""
  selectedResidencyType = ""
  selectedBloodGroup = "";
  selectedState = "";
  selectedLanguages = "";
  payersListErorr = "";
  messageError = "";
  setPrimary = "0";
  fullName = "";
  providerId = "";
  beneficiaryId: string;
  nationalities = nationalities;
  Beneficiaries: BeneficiarySearch[];
  payersList: Payer[] = [];
  beneficiaryinfo: BeneficiaryModel;


  dobFormControl: FormControl = new FormControl();
  documentIdFormControl: FormControl = new FormControl();
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

  houseNumberController = new FormControl();
  streetNameController = new FormControl();
  cityNameController = new FormControl();
  stateController = new FormControl();
  selectedCountry = "";
  postalCodeController = new FormControl();

  insurancePlans: {
    iSPrimary: boolean,
    selectePayer: string,
    expiryDateController: FormControl
    memberCardId: FormControl,
    selecteSubscriberRelationship: string
    selecteCoverageType: string,
    payerErorr: string,
    memberCardIdErorr: string,
  }[] = [];

  maritalStatuses: { Code: string, Name: string }[] = [
    { Code: 'A', Name: 'Annulled' },
    { Code: 'D', Name: 'Divorced' },
    { Code: 'I', Name: 'Interlocutory' },
    { Code: 'L', Name: 'Legally Separated' },
    { Code: 'M', Name: 'Married' },
    { Code: 'P', Name: 'Polygamous' },
    { Code: 'S', Name: 'Never Married' },
    { Code: 'T', Name: 'Domestic partner' },
    { Code: 'U', Name: 'unmarried' },
    { Code: 'W', Name: 'Widowed' },];

  bloodGroup: { Code: string, Name: string }[] = [
    { Code: 'O_PLUS', Name: 'O+' },
    { Code: 'O_MINUS', Name: 'O-' },
    { Code: 'A_PLUS', Name: 'A+' },
    { Code: 'A_MINUS', Name: 'A-' },
    { Code: 'B_PLUS', Name: 'B+' },
    { Code: 'B_MINUS', Name: 'B-' },
    { Code: 'AB_PLUS', Name: 'AB+' },
    { Code: 'AB_MINUS', Name: 'AB-' },
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

changeMode(){ 
  this.viewMode= !this.viewMode;
  this.editMode=!this.editMode;   
  this.getBeneficiary(this.beneficiaryId);
}


  getCoverageTypeName(CoverageTypeCode: string) {

    switch (CoverageTypeCode) {
      case "EHCPOL":
        return "Extended healthcare"

      case "PUBLICPOL":
        return "Public healthcare"

      default:
        return null
    }
  }

  getSubscriberRelationshipName(SubscriberRelationshipCode: string) {
    for (let SubscriberRelationship of this.SubscriberRelationship) {
      if (SubscriberRelationship.Code == SubscriberRelationshipCode) {
        return SubscriberRelationship.Name
      }
    }
  }


  getBloodTypeName(BloodCode: string) {
    for (let blodType of this.bloodGroup) {
      if (blodType.Code == BloodCode) {
        return blodType.Name
      }
    }

  }

  getPayerName(PayerId: string) {
    for (let payer of this.payersList) {
      if (payer.payerId == PayerId) {
        return payer.englistName
      }
    }

  }

  getMaritalStatusName(maritalStatusCode: string) {
    for (let maritalStatus of this.maritalStatuses) {
      if (maritalStatus.Code == maritalStatusCode) {
        return maritalStatus.Name
      }
    }

  }
  getNationalitiesName(NationalitiesName: string) {


    for (let nationality of this.nationalities) {
      if (nationality.Code == NationalitiesName) {
        return nationality.Name
      }
    }



  }



  getBeneficiary(beneficiaryId: string) {

    this.providersBeneficiariesService.getBeneficiaryById(this.sharedServices.providerId, beneficiaryId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.beneficiaryinfo = event.body as BeneficiaryModel;
        this.setDateforView(this.beneficiaryinfo);

      }

    }, err => {

      if (err instanceof HttpErrorResponse) {
        console.log(err.message)


      }
    });


    return true
  }

  get showbeneficiaryForm() {

    return this.viewMode || this.editMode;

  }


  isPrimary(index: string) {

    if (index == "true") {
      return true;
    } else {
      return false;
    }
  }
  selectedPayer(payerId: string) {
    for(let payer of this.payersList){
      if(payer.payerId==payerId){
        return payer.englistName + "(" + payer.arabicName + ")";
      }
    }
   
    

  }
isNull(value:string){
return value==null?"_":value;
}

  setDateforView(beneficiaryinfo: BeneficiaryModel) {


    this.insurancePlans = [];
    this.fullName = beneficiaryinfo.firstName;
    this.secondNameController.setValue(beneficiaryinfo.middleName);
    this.thirdNameController.setValue(beneficiaryinfo.lastName);
    this.familyNameController.setValue(beneficiaryinfo.familyName);
    this.fullNameController.setValue(beneficiaryinfo.fullName);
    this.dobFormControl.setValue(beneficiaryinfo.dob);
    this.selectedGender = beneficiaryinfo.gender;
    this.selectedNationality = beneficiaryinfo.nationality;
    this.contactNumberController.setValue(beneficiaryinfo.contactNumber);
    this.emailController.setValue(beneficiaryinfo.email);
    this.emergencyPhoneNumberController.setValue(beneficiaryinfo.emergencyNumber);
    this.selectedDocumentType = beneficiaryinfo.documentType;
    this.documentIdFormControl.setValue(beneficiaryinfo.documentId);
    this.beneficiaryFileIdController.setValue(beneficiaryinfo.beneficiaryFileld);
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
    this.postalCodeController.setValue(beneficiaryinfo.postalCode)

    for (let insurancePlans of beneficiaryinfo.insurancePlans) {
      this.insurancePlans.push(
        {
          iSPrimary: insurancePlans.isPrimary,
          selectePayer: insurancePlans.payerId.trim(),
          expiryDateController: new FormControl(insurancePlans.expiryDate),
          memberCardId: new FormControl(insurancePlans.memberCardId),
          selecteSubscriberRelationship: insurancePlans.relationWithSubscriber,
          selecteCoverageType: insurancePlans.coverageType,
          payerErorr: null, memberCardIdErorr: null
        }
      )
    }

    console.log(beneficiaryinfo.insurancePlans[0].isPrimary)


  }

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private sharedServices: SharedServices, private providersBeneficiariesService: ProvidersBeneficiariesService, private providerNphiesSearchService: ProviderNphiesSearchService, private dialogService: DialogService) { }
  ngOnInit() {

    this.providersBeneficiariesService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array)
          this.payersList = event.body as Payer[];



      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          this.payersListErorr = err.message

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



    this.beneficiaryId = this.activatedRoute.snapshot.paramMap.get("beneficiaryId")
    var url = this.router.url;
    if (url.endsWith('add')) {
      this.addMode = true;
    }
    // else if (this.beneficiaryId != null && url.endsWith('edit')) {
    //   this.editMode = true;
    //   this.getBeneficiary(this.beneficiaryId);


    // }
     else {
      this.getBeneficiary(this.beneficiaryId)
      this.viewMode = true;
    }

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
        (this.firstNameController.value == null ? ' ' : this.firstNameController.value) +
        (this.secondNameController.value == null ? ' ' : this.secondNameController.value) +
        (this.thirdNameController.value == null ? ' ' : this.thirdNameController.value) +
        (this.familyNameController.value == null ? '' : this.familyNameController.value).trim());

      this.fullNameController.disable();

    } else {
      this.fullNameController.enable();
    }
  }


  _onDestroy = new Subject<void>();
  filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allMaritalStatuses: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allBloodType: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allSubscriberRelationship: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);


  dialogData: MessageDialogData;
  errors = {
    dob: "",
    documentType: "",
    documentId: "",
    gender: "",
    fullName: "",

  }


  addInsurancePlan() {

    if (this.payersListErorr != null && this.payersListErorr != null) {
      this.insurancePlans.push({
        iSPrimary: false,
        selectePayer: "",
        expiryDateController: new FormControl(),
        memberCardId: new FormControl(),
        selecteSubscriberRelationship: "",
        selecteCoverageType: "",
        payerErorr: null,
        memberCardIdErorr: null
      })
    } else {

      this.dialogService.openMessageDialog({
        title: '',
        message: `We could not load required information to create insurance plan. Please add your beneficiary and try adding insurance plans later.`,
        isError: true
      });
    }
  }

  deleteInsurancePlan(i: number) {
    this.insurancePlans.splice(i, 1)
  }

  beneficiaryModel = new BeneficiaryModel();



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
      for (let plan of this.insurancePlans) {
        plan.iSPrimary = false;

      }

      this.insurancePlans[Number.parseInt(this.setPrimary)].iSPrimary = true;

    }

    if (this.checkError()) { return }
    this.sharedServices.loadingChanged.next(true);
    this.setDateforSaveBeneficiary()
    this.providersBeneficiariesService.editBeneficiaries(
      this.providerId, this.beneficiaryId, this.beneficiaryModel
    ).subscribe(event => {
      if (event instanceof HttpResponse) {

        this.dialogService.openMessageDialog({
          title: '',
          message: `Beneficiary updated successfully`,
          isError: false
        }).subscribe( event=>{this.changeMode()});;
        this.sharedServices.loadingChanged.next(false);
      

      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {

          if (err.status == 500) {
            this.messageError = "could not reach server Please try again later "

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
    this.beneficiaryModel.dob = new Date(moment( this.dobFormControl.value).format('YYYY-MM-DD'));
    this.beneficiaryModel.gender = this.selectedGender;
    this.beneficiaryModel.nationality = this.selectedNationality == "" ? null : this.selectedNationality;
    this.beneficiaryModel.contactNumber = this.contactNumberController.value;
    this.beneficiaryModel.email = this.emailController.value;
    this.beneficiaryModel.emergencyNumber = this.emergencyPhoneNumberController.value;
    this.beneficiaryModel.documentType = this.selectedDocumentType;
    this.beneficiaryModel.documentId = this.documentIdFormControl.value;
    this.beneficiaryModel.beneficiaryFileld = this.beneficiaryFileIdController.value;
    this.beneficiaryModel.eHealthId = this.EHealthIdNameController.value;
    this.beneficiaryModel.residencyType = this.selectedResidencyType == "" ? null : this.selectedResidencyType;
    this.beneficiaryModel.bloodGroup = this.selectedBloodGroup == "" ? null : this.selectedBloodGroup;
    this.beneficiaryModel.martialStatus = this.selectedMaritalStatus == "" ? null : this.selectedMaritalStatus;
    this.beneficiaryModel.preferredLanguage = this.selectedLanguages == "" ? null : this.selectedLanguages;
    this.beneficiaryModel.addressLine = this.houseNumberController.value;
    this.beneficiaryModel.streetLine = this.streetNameController.value;
    this.beneficiaryModel.city = this.cityNameController.value;
    this.beneficiaryModel.state = this.stateController.value;
    this.beneficiaryModel.documentId = this.documentIdFormControl.value;
    this.beneficiaryModel.country = this.selectedCountry == "" ? null : this.selectedCountry;
    this.beneficiaryModel.postalCode = this.postalCodeController.value;
    this.beneficiaryModel.insurancePlans = this.insurancePlans.map(insurancePlan => ({
      expiryDate:new Date(moment(insurancePlan.expiryDateController.value).format('YYYY-MM-DD')),
      payerId: insurancePlan.selectePayer == "" ? null : insurancePlan.selectePayer,
      memberCardId: insurancePlan.memberCardId.value,
      relationWithSubscriber: insurancePlan.selecteSubscriberRelationship == "" ? null : insurancePlan.selecteSubscriberRelationship,
      coverageType: insurancePlan.selecteCoverageType == "" ? null : insurancePlan.selecteCoverageType,
      isPrimary: insurancePlan.iSPrimary,

    }));;

  }
  save() {

    if (this.insurancePlans != null && this.insurancePlans.length != 0) {
      for (let plan of this.insurancePlans) {
        plan.iSPrimary = false;

      }

      this.insurancePlans[Number.parseInt(this.setPrimary)].iSPrimary = true;

    }

    if (this.checkError()) { return }
    this.sharedServices.loadingChanged.next(true);
    this.setDateforSaveBeneficiary()
    this.providersBeneficiariesService.saveBeneficiaries(
      this.beneficiaryModel, this.providerId
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
      
        this.dialogService.openMessageDialog({
          title: '',
          message: `Beneficiary added successfully`,
          isError: false
        }).subscribe( event=>{ window.location.reload();});
        this.sharedServices.loadingChanged.next(false);
        
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {

          if (err.status == 500) {
            this.messageError = "could not reach server Please try again later "

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

  isValidDate(date): boolean {
    return date != null && !Number.isNaN(new Date(moment(date).format('YYYY-MM-DD')).getTime());
  }
  checkError() {
    let thereIsError = false;
    this.errors.dob = "";
    this.errors.documentType = "";
    this.errors.documentId = "";
    this.errors.gender = "";
    if (this.selectedDocumentType == null || this.selectedDocumentType == "") {
      this.errors.documentType = "Document Type must be specified"
      thereIsError = true;
    }
    if (this.documentIdFormControl.value == null || this.documentIdFormControl.value.trim().length <= 0) {
      this.errors.documentId = "Document ID must be specified"
      thereIsError = true;
    }

    if (this.fullNameController.value == null || this.fullNameController.value.trim().length <= 0) {
      this.errors.fullName = "Full Name must be specified"
      thereIsError = true;
    }
    if (this.dobFormControl.value == null) {
      this.errors.dob = "Date of Brith must be specified"
      thereIsError = true;
    }
    if (this.selectedGender == null || this.selectedGender == "") {
      this.errors.gender = "Gender must be specified"
      thereIsError = true;
    }


    for (let insurancePlan of this.insurancePlans) {
      if (insurancePlan.selectePayer == null || insurancePlan.selectePayer == "") {
        insurancePlan.payerErorr = "Payer must be specified"
        thereIsError = true;
      }
      if (insurancePlan.memberCardId.value == null || insurancePlan.memberCardId.value.trim().length <= 0) {
        insurancePlan.memberCardIdErorr = "Member Card ID must be specified"
        thereIsError = true;
      }

    }

    return thereIsError;

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



}
