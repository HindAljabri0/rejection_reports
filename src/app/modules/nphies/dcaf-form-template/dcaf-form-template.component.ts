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
  @Input() printFor:any;
  constructor(private providerNphiesSearchService: ProviderNphiesSearchService,private sharedServices: SharedServices,) { }

  totalAmount=0;
   totalApprovedAmount=0;
   totalQuantity=0;
   approvedQuantity=0;

  ngOnInit() {
    
    this.sharedServices.loadingChanged.next(true);
   
    this.providerNphiesSearchService.getJsonFormData(this.sharedServices.providerId,this.preAuthId,this.printFor).subscribe((res:any)=>{
      if (res instanceof HttpResponse) {
        const body = res.body;
        if (body) {
          this.DCAF = body;
        this.sharedServices.loadingChanged.next(false);
        this.countTotal();
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
        this.totalAmount += i.netAmount;
        this.totalApprovedAmount+=i.benfit!=null?Number(i.benfit):0;
        this.totalQuantity+=i.quantity;
        this.approvedQuantity+=i.approvedQuantity!=null?Number(i.approvedQuantity):0;
        
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
  getPeriodDays(){
    if(this.DCAF.preAuthStartDate!=null && this.DCAF.preAuthEndDate!=null){
    var StartDate = new Date(this.DCAF.preAuthStartDate);
    var EndDate = new Date(this.DCAF.preAuthEndDate);
    return StartDate.getTime() - EndDate.getTime()}else{
  
      return '';
    }
  }

}
