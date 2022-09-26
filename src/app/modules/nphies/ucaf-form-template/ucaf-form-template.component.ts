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

  UCAFData:any;
  Age:number;
  supportingInfo :any;
  Diagnosis :string;
  @Input() preAuthId: any;
  constructor( private providerNphiesSearchService: ProviderNphiesSearchService,
    private sharedServices: SharedServices,) { }
  ngOnInit() {
    this.providerNphiesSearchService.getJsonFormData(this.sharedServices.providerId,this.preAuthId).subscribe((res:any)=>{
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

  getPrincipalCode(index: number) {
    const { careTeam } = this.UCAFData;
    if (careTeam.length >= index + 1) return careTeam[index].specialityCode;
    else return '';
  }

  getDiagnosis(){
    const {diagnosis} = this.UCAFData;
    if(diagnosis.length > 0) return diagnosis.map(res=>res.diagnosisDescription).join(', ');
    else return '';
  }

  calculateAge(){
      const ageDifMs = Date.now() - new Date(this.UCAFData.beneficiary.dob).getTime();
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

}
