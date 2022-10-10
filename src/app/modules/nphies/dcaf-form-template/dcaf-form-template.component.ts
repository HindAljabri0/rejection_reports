import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-dcaf-form-template',
  templateUrl: './dcaf-form-template.component.html',
  styles: []
})
export class DcafFormTemplateComponent implements OnInit {

  DCAF : any;
  @Input() preAuthId: any;
  constructor(private providerNphiesSearchService: ProviderNphiesSearchService,private sharedServices: SharedServices,) { }

  ngOnInit() {
    this.providerNphiesSearchService.getJsonFormData(this.sharedServices.providerId,this.preAuthId).subscribe((res:any)=>{
      this.sharedServices.loadingChanged.next(true);
      if (res instanceof HttpResponse) {
        const body = res.body;
        if (body) {
          this.DCAF = body;
        this.sharedServices.loadingChanged.next(false);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
      this.sharedServices.loadingChanged.next(false);
      }
    });  
  }

  getDiagnosis(){
    const {diagnosis} = this.DCAF;
    if(diagnosis.length > 0) return diagnosis.map(res=> `(${res.diagnosisCode}) - (${res.diagnosisDescription})`).join(', ');
    else return '';
  }

  getSupportingInfoForChiefComplaints() {
    const { supportingInfo } = this.DCAF;
    const index = this.DCAF.supportingInfo.findIndex(res => res.category === "chief-complaint");
    if(index !== -1){
      return `${supportingInfo[index].code ? `(${supportingInfo[index].code}) ` : ''} ${supportingInfo[index].code && supportingInfo[index].value ? '-' : ''} ${supportingInfo[index].value ? `(${supportingInfo[index].value})`: ''}`;
    }
    else return '';
  }

  calculateAge(){
    const ageDifMs = Date.now() - new Date(this.DCAF.beneficiary.dob).getTime();
    const ageDate = new Date(ageDifMs);
    if(Math.abs(ageDate.getUTCFullYear() - 1970) == 0){
      return `0. ${new Date().getMonth() -  new Date(this.DCAF.beneficiary.dob).getMonth() + 1}` 
    } else return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  countTotal(){
    let total = 0;
     this.DCAF.items.forEach(i => {
       total += i.netAmount;
    });
    return total;
  }

  getMedicationCode() {
    return this.DCAF.items.filter(res=>!!res.prescribedDrugCode) || [];
  }

  getVisitReason(code: string) {
    const index = this.DCAF.supportingInfo.findIndex(res => res.category === "reason-for-visit");
    if (index !== -1) {
      return this.DCAF.supportingInfo[index].code === code;
    } else return false
  }

  getBodySites(toothNo){
    return this.DCAF.items.some(res=>res.bodySite == toothNo);
  }

}
