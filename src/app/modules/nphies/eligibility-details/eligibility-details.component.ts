import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { EligibilityResponseModel } from 'src/app/models/nphies/eligibilityResponseModel';
import { Payer } from 'src/app/models/nphies/payer';
import { DbMappingService } from 'src/app/services/administration/dbMappingService/db-mapping.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-eligibility-details',
  templateUrl: './eligibility-details.component.html',
  styles: []
})
export class EligibilityDetailsComponent implements OnInit {
  @Input() isPrint: any;
  currentOpenCoverage: number = null;
  @Input() eligibilityResponse: any;
  payers: Payer[] = [];
  AllTPA: any[] = [];
  providerType=null;
  constructor(private sharedDataService: SharedDataService, private sharedServices: SharedServices, private dbMapping:DbMappingService, private nphiesSearchService: ProviderNphiesSearchService) { }

  eligibiltyTypeList = this.sharedDataService.beneficiaryTypeList;

  ngOnInit() {
    this.getPayers();
    this.getTPA();
    // tslint:disable-next-line:max-line-length
    this.eligibilityResponse.siteEligibilityName = this.sharedDataService.siteEligibility.filter(x => x.value === this.eligibilityResponse.siteEligibility)[0] ? this.sharedDataService.siteEligibility.filter(x => x.value === this.eligibilityResponse.siteEligibility)[0].value + ' ( ' + this.sharedDataService.siteEligibility.filter(x => x.value === this.eligibilityResponse.siteEligibility)[0].name + ' )' : '-';
    // tslint:disable-next-line:max-line-length
    this.eligibilityResponse.documentTypeName = this.eligibiltyTypeList.filter(x => x.value === this.eligibilityResponse.documentType)[0] ? this.eligibiltyTypeList.filter(x => x.value === this.eligibilityResponse.documentType)[0].name : '-';
    this.getProviderTypeConfiguration();
  }
  getProviderTypeConfiguration() {

    this.dbMapping.getProviderTypeConfiguration(this.sharedServices.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        const data:any = event.body;
        if (data.details != null) {
          this.providerType = data.details.claimType ? data.details.claimType : null;
        } else {
          this.providerType = null
        }
      }
     
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status == 404) {
          this.providerType = null;
        } 
      }
    });
  }
  toggleRow(index) {
    this.currentOpenCoverage = (index == this.currentOpenCoverage) ? -1 : index;
  }
  getContainsItems(items){
    //console.log(Object.keys(items).length);
    return Object.keys(items).length > 0;
  }
  getNamePayer(payerNphiesId: string) {
    const payer = this.payers.find(val => val.nphiesId === payerNphiesId);
    if (payer && payer.englistName) {
      return payer.englistName;
    } else {
      return '';
    }
  }
  getTPAName(TPAId: string) {
    const nameTPA = this.AllTPA.find(val => val.code === TPAId);
    if (nameTPA != null) {
      return nameTPA.display;
    }
    else {
      return '-';
    }
  }

  getPayers() {
    this.nphiesSearchService.getPayersNotTBA().subscribe(event => {
      if (event instanceof HttpResponse) {
        this.payers = event.body as Payer[];
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  getTPA() {
    this.nphiesSearchService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        this.AllTPA = event.body as any[];
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

}
