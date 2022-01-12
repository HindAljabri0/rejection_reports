import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-payer-claims-report',
  templateUrl: './payer-claims-report.component.html',
  styles: []
})
export class PayerClaimsReportComponent implements OnInit {
  payers: { id: string[] | string, name: string }[];
  filtterStatuses:string[]=[]
  statuses: { code: string, name: string }[]=[
    {code:'Accepted,failed',name:'Ready for Submission'},
    {code:'Batched',name:'Under Submission'},
    {code:'REJECTED',name:'Rejected By Payer'},
    {code:'paid',name:'Paid'},
    {code:'NotAccepted',name:'Rejected By Waseel'},
    {code:'invalid',name:'Invalid'},
    {code:'OUTSTANDING',name:'Under Processing'},
    {code:'partially_paid',name:'Partially Paid'},
    {code:'Downloadable',name:'Downloadable'},
    {code:'SUBMITTED_OUTSIDE_WASEEL',name:'Submitted Outside Waseel'}

 ];

  PayerClaimsReportForm: FormGroup;

  constructor( public commen: SharedServices,  private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.payers = [];

    this.PayerClaimsReportForm = this.formBuilder.group({
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

  }
  search(){
   
     this.PayerClaimsReportForm.controls['summaryCriteria'].value.forEach(element => {
      this.filtterStatuses=this.filtterStatuses.concat(element.split(",", 3));
    });
   
    console.log(  this.filtterStatuses);
console.log( this.PayerClaimsReportForm.controls['summaryCriteria'].value);
console.log( this.PayerClaimsReportForm.controls['payerId'].value);

  }
}
