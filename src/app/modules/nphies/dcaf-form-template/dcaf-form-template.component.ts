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
      this.DCAF = res.body;
      console.log(res)
    });
    console.log('DCAFData',this.DCAF);
  }

  /* getSupptingInfo(key: string) {
    return this.providerNphiesSearchService.getSupptingInfoPrintingFom(key, this.DCAF)
  }

  getPrincipalCode(index: number) {
    return this.providerNphiesSearchService.getPrincipalCodePrintingFom(index, this.DCAF);
  }

  getDiagnosis(){
    return this.providerNphiesSearchService.getDiagnosisPrintingFom(this.DCAF);
  } */

}
