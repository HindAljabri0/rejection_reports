import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { EligibilityResponseModel } from 'src/app/models/nphies/eligibilityResponseModel';
import { Payer } from 'src/app/models/nphies/payer';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-eligibility-details',
  templateUrl: './eligibility-details.component.html',
  styles: []
})
export class EligibilityDetailsComponent implements OnInit {

  currentOpenCoverage: number = null;
  @Input() eligibilityResponse: EligibilityResponseModel;
  payers:Payer[]=[];
  constructor(private sharedDataService: SharedDataService,private nphiesSearchService: ProviderNphiesSearchService) { }

  eligibiltyTypeList = this.sharedDataService.beneficiaryTypeList;

  ngOnInit() {
    this.getPayers();
    // tslint:disable-next-line:max-line-length
    this.eligibilityResponse.siteEligibilityName = this.sharedDataService.siteEligibility.filter(x => x.value === this.eligibilityResponse.siteEligibility)[0] ? this.sharedDataService.siteEligibility.filter(x => x.value === this.eligibilityResponse.siteEligibility)[0].value + ' ( ' + this.sharedDataService.siteEligibility.filter(x => x.value === this.eligibilityResponse.siteEligibility)[0].name + ' )' : '-';
    this.eligibilityResponse.documentTypeName = this.eligibiltyTypeList.filter(x => x.value === this.eligibilityResponse.documentType)[0] ? this.eligibiltyTypeList.filter(x => x.value === this.eligibilityResponse.documentType)[0].name : '-';

  }

  toggleRow(index) {
    this.currentOpenCoverage = (index == this.currentOpenCoverage) ? -1 : index;
  }

  getNamePayer( payerNphiesId:String){
    console.log(payerNphiesId)
    var payer=  this.payers.find(val => val.nphiesId == payerNphiesId);
    console.log(payer.englistName)
    return payer.englistName;
  }
  getPayers() {
    this.nphiesSearchService.getPayersNotTBA().subscribe(event => {
      if (event instanceof HttpResponse) {
       
      
          this.payers = event.body as Payer[] ;
          
       
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
       
      }
    });
  }

}
