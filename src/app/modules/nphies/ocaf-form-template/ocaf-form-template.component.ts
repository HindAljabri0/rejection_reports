import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-ocaf-form-template',
  templateUrl: './ocaf-form-template.component.html',
  styles: []
})
export class OcafFormTemplateComponent implements OnInit {
  OCAF : any;
  @Input() preAuthId: any;
  constructor(private providerNphiesSearchService: ProviderNphiesSearchService,private sharedServices: SharedServices,public datepipe: DatePipe) { }

  ngOnInit() {
    this.providerNphiesSearchService.getJsonFormData(this.sharedServices.providerId,this.preAuthId).subscribe((res:any)=>{
      this.OCAF = res.body;
      console.log(res.body)
    });
  }

  /* getSupptingInfo(key: string) {
    return this.providerNphiesSearchService.getSupptingInfoPrintingFom(key, this.OCAF)
  }

  getPrincipalCode(index: number) {
    return this.providerNphiesSearchService.getPrincipalCodePrintingFom(index, this.OCAF);
  }

  getDiagnosis(){
    return this.providerNphiesSearchService.getDiagnosisPrintingFom(this.OCAF);
  } */
  calculateAge(){
    
  /* let latest_date =this.datepipe.transform(this.OCAF.beneficiary.dob, 'yyyy-MM-dd'); */
  let timeDiff = Math.abs( this.OCAF.beneficiary.dob - this.OCAF.beneficiary.dob.getTime());
  let age = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
  console.log(age)
  return age;
  }

}
