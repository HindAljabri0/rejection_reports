import { Component, Input, OnInit } from '@angular/core';
import { EligibilityResponseModel } from 'src/app/models/nphies/eligibilityResponseModel';

@Component({
  selector: 'app-eligibility-details',
  templateUrl: './eligibility-details.component.html',
  styles: []
})
export class EligibilityDetailsComponent implements OnInit {

  currentOpenCoverage: number = null;
  @Input() eligibilityResponse: EligibilityResponseModel;

  constructor() { }

  ngOnInit() {


  }

  toggleRow(index) {
    this.currentOpenCoverage = (index == this.currentOpenCoverage) ? -1 : index;
  }

}
