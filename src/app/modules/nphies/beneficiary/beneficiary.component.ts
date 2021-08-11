import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';
import { BeneficiaryModel } from 'src/app/models/nphies/BeneficiaryModel';
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
  
  selectedNationality =null;
  selectedMaritalStatus = null;
  selectedDocumentType =null;
  selectedGender = null
  selectedPayer = null
  selectedResidencyType=null
  selectedBloodGroup =null;
  selectedLanguage = null;
  selectedState=null;
  selectedCountry = null;

  isLoading = "";
  

  dob: FormControl = new FormControl();
  documentId: FormControl = new FormControl();

  nationalities = nationalities;
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
  nationalityFilterCtrl: FormControl = new FormControl();
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


  expiryDateController: FormControl = new FormControl();
  providerId="";
  _onDestroy = new Subject<void>();
  filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allMaritalStatuses: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  errors = {
    dob: "",
    documentType: "",
    documentId: "",
    gender: "",
    
  }

  addresses: {

    houseNumberController: FormControl;
    streetNameController: FormControl;
    cityNameController: FormControl;
    selectedState: string;
    selectedCountry: string;
    postalCodeController: FormControl
   
  }[] = [];

  insurancePlans: {

    
    iSsetPrimary: string,
    selectePayer: string,
    expiryDate: string,
    memberCardId: FormControl,
    payerErorr: string,
    memberCardIdErorr: string,
  }[] = [];
   beneficiaryModel= new BeneficiaryModel();
  constructor( private sharedServices: SharedServices,private providersBeneficiariesService: ProvidersBeneficiariesService) { }

  ngOnInit() {
   this.providerId=this.sharedServices.providerId;
    this.filteredNations.next(this.nationalities.slice());
    this.allMaritalStatuses.next(this.maritalStatuses.slice());

    this.nationalityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterNationality();
      });
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



  setDate(){

      this.beneficiaryModel.firstName=this.firstNameController.value;
    this.beneficiaryModel.secondName=this.secondNameController.value;
    this.beneficiaryModel.thirdName=this.thirdNameController.value;
    this.beneficiaryModel.familyName=this.familyNameController.value;
    this.beneficiaryModel.fullName=this.fullNameController.value;
    this.beneficiaryModel.dateOfBirth=this.dob.value;
    this.beneficiaryModel.gender=this.selectedGender;
    this.beneficiaryModel.nationality=this.selectedNationality;
    this.beneficiaryModel.contactNumber=this.contactNumberController.value;
    this.beneficiaryModel.email=this.emailController.value;
    this.beneficiaryModel.emergencyPhoneNumber=this.emergencyPhoneNumberController.value;
    this.beneficiaryModel.documentType=this.selectedDocumentType;
    this.beneficiaryModel.documentId=this.documentId.value;
    this.beneficiaryModel.fileId=this.beneficiaryFileIdController.value;
    this.beneficiaryModel.eHealthId=this.EHealthIdNameController.value;
   this.beneficiaryModel. residencyType=this.selectedResidencyType;
    this.beneficiaryModel.maritalStatus=this.selectedMaritalStatus;
    this.beneficiaryModel.preferredLanguage=this.selectedLanguage;
    this.beneficiaryModel.addresses= this.addresses.map(addresse=>({
      addressLine:addresse.houseNumberController.value,
      city:addresse.cityNameController.value,
      contry:addresse.selectedCountry,
      postalCode:addresse.postalCodeController.value,
      state:addresse.selectedState,
      streetNmae:addresse.streetNameController.value

    }));
    this.beneficiaryModel.insurancePlans= this.insurancePlans.map(insurancePlan => ({
    expiryDate:this.expiryDateController.value,
    payerId:insurancePlan.selectePayer,
    memberCardId:insurancePlan.memberCardId.value,
    isPrimary:true,
  
    }));;

  }
  save(){
    if( this.checkError() ){return }
    this.setDate()
    this.providersBeneficiariesService.saveBeneficiaries(
      this.beneficiaryModel,this.providerId
     ).subscribe(event => {
          if (event instanceof HttpResponse) {
            
                 return event.body;}
              }
      , err => {
          
          if (err instanceof HttpErrorResponse) {
        
              console.log("omm");
             
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
    if (this.documentId.value == null || this.documentId.value.trim().length <= 0) {
      this.errors.documentId = "Document ID must be specified"
      thereIsError = true;
    }
    if (this.dob.value == null ) {
      this.errors.dob = "Date of Brith must be specified"
      thereIsError = true;
    }
    if (this.selectedGender == null || this.selectedGender == "") {
      this.errors.gender = "Gender must be specified"
      thereIsError = true;
    }


    for (let insurancePlan of this.insurancePlans) {
      if (insurancePlan.selectePayer == null || insurancePlan.selectePayer == "") {
        insurancePlan.memberCardIdErorr = "Payer must be specified"
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
