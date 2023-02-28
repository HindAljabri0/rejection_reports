import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-ucaf-form-template',
  templateUrl: './ucaf-form-template.component.html',
  styles: []
})
export class UcafFormTemplateComponent implements OnInit {

  UCAFData: any;
  Age: number;
  supportingInfo: any;
  Diagnosis: string;
  @Input() preAuthId: any;
  @Input() printFor: any;
  MedicationCode: any;
  specialityList : any = [];
  specialityName : string;
  constructor(private providerNphiesSearchService: ProviderNphiesSearchService,
    private sharedServices: SharedServices,) { }
  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.providerNphiesSearchService.getJsonFormData(this.sharedServices.providerId, this.preAuthId,this.printFor).subscribe((res: any) => {
      if (res instanceof HttpResponse) {
        const body = res.body;
        if (body) {
          this.UCAFData = body;
          this.getSpeciality();
        } else{
          this.sharedServices.loadingChanged.next(false);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.sharedServices.loadingChanged.next(false);

      }
    });

  }

  getSupportingInfo(key: string) {
    const { supportingInfo } = this.UCAFData;
    if (supportingInfo.length > 0) {
      const index = supportingInfo.findIndex(rec => rec.category === key);
      if (index >= 0) return supportingInfo[index].value;
      else return '';
    }
    else return '';
  }

  getPrincipalCode() {
    const { diagnosis } = this.UCAFData;
    if (diagnosis.length >= 0) {
      const index = diagnosis.findIndex(res=>res.diagnosisType === "principal");
      if(index !== -1)return diagnosis[index].diagnosisCode
      else return '';
    } else return '';
  }

  getCode(index:number) {
    const { diagnosis } = this.UCAFData;
    const filterData = diagnosis.filter(res=>res.diagnosisType !== "principal");
    if (filterData.length >= index + 1){
      return filterData[index].diagnosisCode
    } else '';
  }


  getDiagnosis() {
    const { diagnosis } = this.UCAFData;
    if (diagnosis.length > 0) return diagnosis.map(res => `(${res.diagnosisCode}) - (${res.diagnosisDescription})`).join(', ');
    else return '';
  }

   getSupportingInfoForChiefComplaints() {
    const { supportingInfo } = this.UCAFData;
    const index = this.UCAFData.supportingInfo.findIndex(res => res.category === "chief-complaint");
    if(index !== -1){
      return `${supportingInfo[index].code ? `(${supportingInfo[index].code}) ` : ''} ${supportingInfo[index].code && supportingInfo[index].value ? '-' : ''} ${supportingInfo[index].value ? `(${supportingInfo[index].value})`: ''}`;
    }
    else return '';
  }

  calculateAge(){
    const ageDifMs = Date.now() - new Date(this.UCAFData.beneficiary.dob).getTime();
    const ageDate = new Date(ageDifMs);
    if(Math.abs(ageDate.getUTCFullYear() - 1970) == 0){
      return `0. ${new Date().getMonth() -  new Date(this.UCAFData.beneficiary.dob).getMonth() + 1}` 
    } else return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  getBp() {
    return `${this.getSupportingInfo("vital-sign-systolic")} / ${this.getSupportingInfo("vital-sign-diastolic")}`;
  }
  getMedicationCode() {
    return this.UCAFData.items.filter(res=>!!res.prescribedDrugCode) || [];
  }
  
  getVisitReason(code: string) {
    const index = this.UCAFData.supportingInfo.findIndex(res => res.category === "reason-for-visit");
    if (index !== -1) {
      return this.UCAFData.supportingInfo[index].code === code;
    } else return false
  }

  getSpeciality(){
    const request = this.providerNphiesSearchService.getSpecialityList(this.sharedServices.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.specialityList = event.body;
        const index = this.UCAFData.careTeam.length > 0 ? this.specialityList.findIndex(res=>res.speciallityCode ===  this.UCAFData.careTeam[0].specialityCode): -1; 
        if(index !== -1) this.specialityName = this.specialityList[index].speciallityName;
        else this.specialityName = '';
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  getDeptName(){
    if(this.UCAFData.careTeam.length > 0) return `${this.UCAFData.type} - ${this.UCAFData.careTeam[0].specialityCode} - ${this.specialityName}`;
    else return `${this.UCAFData.type}`;
    
  }
getPeriodDays(){
  if(this.UCAFData.preAuthStartDate!=null && this.UCAFData.preAuthEndDate!=null){
  var StartDate = new Date(this.UCAFData.preAuthStartDate);
  var EndDate = new Date(this.UCAFData.preAuthEndDate);
  return StartDate.getTime() - EndDate.getTime()}else{

    return '';
  }
}
  

}
