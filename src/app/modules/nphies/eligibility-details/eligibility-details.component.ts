import { Component, Input, OnInit } from '@angular/core';
import { EligibilityResponseModel } from 'src/app/models/nphies/eligibilityResponseModel';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-eligibility-details',
  templateUrl: './eligibility-details.component.html',
  styles: []
})
export class EligibilityDetailsComponent implements OnInit {

  currentOpenCoverage: number = null;
  @Input() eligibilityResponse: EligibilityResponseModel;

  constructor(private sharedDataService: SharedDataService) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.eligibilityResponse.siteEligibilityName = this.sharedDataService.siteEligibility.filter(x => x.value === this.eligibilityResponse.siteEligibility)[0] ? this.sharedDataService.siteEligibility.filter(x => x.value === this.eligibilityResponse.siteEligibility)[0].value + ' ( ' + this.sharedDataService.siteEligibility.filter(x => x.value === this.eligibilityResponse.siteEligibility)[0].name + ' )' : '-';

  }

  toggleRow(index) {
    this.currentOpenCoverage = (index == this.currentOpenCoverage) ? -1 : index;
  }

}
