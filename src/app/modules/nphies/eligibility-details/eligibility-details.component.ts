import { Component, Input, OnInit } from '@angular/core';
import { EligibilityResponseModel } from 'src/app/models/nphies/eligibilityResponseModel';
import { ProvidersNphiesEligibilityService } from 'src/app/services/providersNphiesEligibilitiyService/providers-nphies-eligibility.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-eligibility-details',
  templateUrl: './eligibility-details.component.html',
  styles: []
})
export class EligibilityDetailsComponent implements OnInit {

  @Input() eligibilityResponseModel: EligibilityResponseModel;  

  constructor(private sharedServices: SharedServices, private providersNphiesEligibilityService: ProvidersNphiesEligibilityService) { }

  ngOnInit() {

    
  }

}
