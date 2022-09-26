import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
      this.sharedServices.loadingChanged.next(true);
      if (res instanceof HttpResponse) {
        const body = res.body;
        if (body) {
          this.OCAF = body;
        this.sharedServices.loadingChanged.next(false);
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
      this.sharedServices.loadingChanged.next(false);
      }
    });  
  }

  calculateAge(){
    const ageDifMs = Date.now() - new Date(this.OCAF.beneficiary.dob).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}
