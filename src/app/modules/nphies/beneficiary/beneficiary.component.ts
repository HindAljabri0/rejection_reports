import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { nationalities } from 'src/app/claim-module-components/store/claim.reducer';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styles: []
})
export class BeneficiaryComponent implements OnInit {
  addMode = false;
  editMode = false;
  viewMode = false;
  selectedNationality="";
  selectedMaritalStatus="";
  selectedDocumentType="";
  selectedGender="";
  selectedPayer="";

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
  _onDestroy = new Subject<void>();
  filteredNations: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  allMaritalStatuses: ReplaySubject<{ Code: string, Name: string }[]> = new ReplaySubject<{ Code: string, Name: string }[]>(1);
  errors={
    dob:"",
    documentType:"",
    documentId:"",
    gender:"",
  }

  insurancePlans:{
    iSsetPrimary:string,
    selectePayer:string,
    expiryDate:string,
    memberCardId:FormControl,
    payerErorr:string,
    memberCardIdErorr:string,
  }[]=[];
  constructor() { }
  
  ngOnInit() {
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
 

  checkError(){
    let thereIsError=false;
    this.errors.dob="";
    this.errors.documentType="";
    this.errors.documentId="";
    this.errors.gender="";
    if(this.selectedDocumentType==null || this.selectedDocumentType==""){
      this.errors.documentType="Document Type must be specified"
      thereIsError=true;
    }
    if(this.documentId.value==null || this.documentId.value.trim().length<=0){
      this.errors.documentId="Document ID must be specified"
      thereIsError=true;
    }
    if(this.dob.value==null || this.dob.value.trim().length<=0){
      this.errors.dob="Date of Brith must be specified"
      thereIsError=true;
    }
    if(this.selectedGender==null || this.selectedGender==""){
      this.errors.gender="Gender must be specified"
      thereIsError=true;
    }
    

  for(let insurancePlan of this.insurancePlans){
    if(insurancePlan.selectePayer==null || insurancePlan.selectePayer==""){
      insurancePlan.memberCardIdErorr="Payer must be specified"
      thereIsError=true;
    }
    if(insurancePlan.memberCardId.value==null ||  insurancePlan.memberCardId.value.trim().length<=0){
      insurancePlan.memberCardIdErorr ="Member Card ID must be specified"
      thereIsError=true;
    }
  
  }
  
  
      
  
    

    return thereIsError;

  }

  
 


}
