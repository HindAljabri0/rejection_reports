import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { add } from 'ngx-bootstrap/chronos';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { BeneficiaryModel } from 'src/app/models/nphies/BeneficiaryModel';
import { payer } from 'src/app/models/nphies/payer';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
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
  selectedPayer = ""
  selectedResidencyType = ""
  selectedBloodGroup = "";
  selectedState = "";
  selectedLanguages = "";
  payersListErorr = "";
  messageError="";
  setPrimary="0";
  fullName="";
  providerId = "";
  nationalities = nationalities;
  payersList:payer []= [];

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

 
  addresses: {

    houseNumberController: FormControl;
    streetNameController: FormControl;
    cityNameController: FormControl;
    stateController: FormControl;
    selectedCountry: string;
    postalCodeController: FormControl

  }[] = [];

  insurancePlans: {
    iSPrimary: boolean,
    selectePayer: string,
    expiryDateController: FormControl
    memberCardId: FormControl,
    payerErorr: string,
    memberCardIdErorr: string,
  }[] = [  ];
 
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
 

   
  
  
ngOnInit() {
  this.providersBeneficiariesService.getPayers().subscribe(event => {
    if (event instanceof HttpResponse) {
    if(event.body!=null && event.body instanceof Array)
    this.payersList=event.body as payer[];
    }
  }
    , err => {

      if (err instanceof HttpErrorResponse) {
        this.payersListErorr=err.message

      }
    });

  this.providerId = this.sharedServices.providerId;
  this.filteredNations.next(this.nationalities.slice());
  this.allMaritalStatuses.next(this.maritalStatuses.slice());

  this.nationalityFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterNationality();
    });
    
}

onNameChanged(){
  if((this.fullNameController.value!=null&&this.fullNameController.value.trim().length>0)){
    this.firstNameController.disable();
    this.secondNameController.disable();
    this.thirdNameController.disable();
    this.familyNameController.disable();
  }else{
    this.firstNameController.enable();
    this.secondNameController.enable();
    this.thirdNameController.enable();
    this.familyNameController.enable();
  }
}



 isFullNameDisabled(){
if((this.firstNameController.value!=null&&this.firstNameController.value.trim().length>0)||
(this.secondNameController.value!=null&&this.secondNameController.value.trim().length>0) ||
(this.thirdNameController.value!=null&&this.thirdNameController.value.trim().length>0)||
(this.familyNameController.value!=null&&this.familyNameController.value.trim().length>0)){
this.fullNameController.setValue(
  (this.firstNameController.value ==null?' ' : this.firstNameController.value)+
(this.secondNameController.value  ==null?' ' : this.secondNameController.value)+
(this.thirdNameController.value  ==null?' ' : this.thirdNameController.value)+
(this.familyNameController.value  ==null?'' : this.familyNameController.value).trim());

this.fullNameController.disable();

}else{
this.fullNameController.enable();
}}
 
  
  _onDestroy = new Subject<void>();
  filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allMaritalStatuses: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  errors = {
    dob: "",
    documentType: "",
    documentId: "",
    gender: "",
    fullName:"",

  }

  

  deleteAddress(i:number){
    this.addresses.splice(i,1)
  }
  addAddress(){
    this.addresses.push( {
   houseNumberController:new FormControl(),
  streetNameController: new FormControl(),
  cityNameController: new FormControl(),
  stateController: new FormControl(),
  selectedCountry: "",
  postalCodeController: new FormControl()})
  }
  dialogData: MessageDialogData;


 
  
  addInsurancePlan(){

   if(this.payersListErorr!=null && this.payersListErorr!=null){
    this.insurancePlans.push({ 
      iSPrimary: false,
      selectePayer: "",
      expiryDateController:new FormControl(),
      memberCardId:new FormControl(),
      payerErorr: null,
      memberCardIdErorr: null})
    }else{
      
      this.dialogService.openMessageDialog({
        title: '',
        message: `We could not load required information to create insurance plan. Please add your beneficiary and try adding insurance plans later.`,
        isError: true
      });
    }
  }
  
  deleteInsurancePlan(i:number){
    this.insurancePlans.splice(i,1)
  }

  beneficiaryModel = new BeneficiaryModel();
  constructor(private sharedServices: SharedServices, private providersBeneficiariesService: ProvidersBeneficiariesService, private dialogService: DialogService) { }


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



  setDate() {
    this.beneficiaryModel.firstName = this.firstNameController.value;
    this.beneficiaryModel.secondName = this.secondNameController.value;
    this.beneficiaryModel.thirdName = this.thirdNameController.value;
    this.beneficiaryModel.familyName = this.familyNameController.value;
    this.beneficiaryModel.fullName = this.fullNameController.value;
    this.beneficiaryModel.dateOfBirth = this.dobFormControl.value;
    this.beneficiaryModel.gender = this.selectedGender;
    this.beneficiaryModel.nationality = this.selectedNationality == "" ? null : this.selectedNationality;
    this.beneficiaryModel.contactNumber = this.contactNumberController.value;
    this.beneficiaryModel.email = this.emailController.value;
    this.beneficiaryModel.emergencyPhoneNumber = this.emergencyPhoneNumberController.value;
    this.beneficiaryModel.documentType = this.selectedDocumentType;
    this.beneficiaryModel.documentId = this.documentIdFormControl.value;
    this.beneficiaryModel.fileId = this.beneficiaryFileIdController.value;
    this.beneficiaryModel.eHealthId = this.EHealthIdNameController.value;
    this.beneficiaryModel.residencyType = this.selectedResidencyType == "" ? null : this.selectedResidencyType;
    this.beneficiaryModel.maritalStatus = this.selectedMaritalStatus == "" ? null : this.selectedMaritalStatus;
    this.beneficiaryModel.preferredLanguage = this.selectedLanguages == "" ? null : this.selectedLanguages;
    this.beneficiaryModel.addresses = this.addresses.map(addresse => ({
      addressLine: addresse.houseNumberController.value,
      streetNmae: addresse.streetNameController.value,
      city: addresse.cityNameController.value,
      state: addresse.stateController .value ,
      contry: addresse.selectedCountry == "" ? null : addresse.selectedCountry,
      
     
      postalCode: addresse.postalCodeController.value,
     

    }));
    this.beneficiaryModel.insurancePlans = this.insurancePlans.map(insurancePlan => ({
      expiryDate: insurancePlan.expiryDateController.value,
      payerId: insurancePlan.selectePayer== "" ? null : insurancePlan.selectePayer,
      memberCardId: insurancePlan.memberCardId.value,
      isPrimary: insurancePlan.iSPrimary,

    }));;

  }
  save() {

if(this.insurancePlans!=null || this.insurancePlans.length!=0){
  for(let plan of this.insurancePlans){
    plan.iSPrimary=false;

  }

  this.insurancePlans[Number.parseInt(this.setPrimary)].iSPrimary=true;
  
}

    if (this.checkError()) { return }
    this.sharedServices.loadingChanged.next(true);
    this.setDate()
    this.providersBeneficiariesService.saveBeneficiaries(
      this.beneficiaryModel, this.providerId
    ).subscribe(event => {
      if (event instanceof HttpResponse) {

        this.dialogService.openMessageDialog({
          title: '',
          message: `successfully`,
          isError: false
        });
        this.sharedServices.loadingChanged.next(false);
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
        
          if(err.status==500){
            this.messageError="could not reach server Please try again later "

          }else{
            this.messageError=err.message;
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
      this.errors.fullName = "Full Name ID must be specified"
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





}
