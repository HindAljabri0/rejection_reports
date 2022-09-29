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
  MedicationCode: any;
  constructor(private providerNphiesSearchService: ProviderNphiesSearchService,
    private sharedServices: SharedServices,) { }
  ngOnInit() {
    this.providerNphiesSearchService.getJsonFormData(this.sharedServices.providerId, this.preAuthId).subscribe((res: any) => {
      this.sharedServices.loadingChanged.next(true);
      if (res instanceof HttpResponse) {
        const body = res.body;
        if (body) {
          this.UCAFData = body;
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
    if (supportingInfo.length > 0) return supportingInfo.map(res => `(${res.code}) - (${res.value})`).join(', ');
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
  
  getVisitReason(code :string){
      const index = this.UCAFData.supportingInfo.findIndex(res=>res.category === "reasonForVisit");
      if(index != -1) return this.UCAFData.supportingInfo[index].code == code;
      else false;
  }

}
