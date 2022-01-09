import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-payer-claims-report',
  templateUrl: './payer-claims-report.component.html',
  styles: []
})
export class PayerClaimsReportComponent implements OnInit {
  payers: { id: string[] | string, name: string }[];

  statuses:string[]=['Accepted','NotAccepted','REJECTED','PAID','PARTIALLY_PAID','OUTSTANDING','Submitted','SUBMITTED_OUTSIDE_WASEEL','Batched','Downloadable','INVALID','DUPLICATE','CANCELLED']
 
  PayerClaimsReport: FormGroup;

  constructor( public commen: SharedServices,  private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.payers = [];

    this.PayerClaimsReport = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      payerId: ['', Validators.required],
      summaryCriteria: ['', Validators.required],
    });
    this.commen.getPayersList().map(value => {
      this.payers.push({
        id: `${value.id}`,
        name: value.name
      });
    });

    console.log(this.PayerClaimsReport.controls['summaryCriteria'].value);
    

   
    
  }

}
