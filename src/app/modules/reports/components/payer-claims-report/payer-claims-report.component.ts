import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { SearchService } from 'src/app/services/serchService/search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-payer-claims-report',
  templateUrl: './payer-claims-report.component.html',
  styles: []
})
export class PayerClaimsReportComponent implements OnInit {
  payers: { id: string[] | string, name: string }[];

  filtterStatuses: string[] = []
  statuses: { code: string, name: string }[] = [
    { code: 'Accepted,failed', name: 'Ready for Submission' },
    { code: 'Batched', name: 'Under Submission' },
    { code: 'REJECTED', name: 'Rejected By Payer' },
    { code: 'paid', name: 'Paid' },
    { code: 'NotAccepted', name: 'Rejected By Waseel' },
    { code: 'invalid', name: 'Invalid' },
    { code: 'OUTSTANDING', name: 'Under Processing' },
    { code: 'partially_paid', name: 'Partially Paid' },
    { code: 'Downloadable', name: 'Downloadable' },
    { code: 'SUBMITTED_OUTSIDE_WASEEL', name: 'Submitted Outside Waseel' }

  ];

  PayerClaimsReportForm: FormGroup;
  searchedClaim: SearchedClaim []=[]
  constructor(public commen: SharedServices, private formBuilder: FormBuilder, private searchService: SearchService) { }

  ngOnInit() {
    this.payers = [];

    this.PayerClaimsReportForm = this.formBuilder.group({
      Provider: ['', Validators.required],
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

  search() {
 
    this.filtterStatuses = [];
    if (this.PayerClaimsReportForm.valid) {
      this.commen.loadingChanged.next(true);
      let Provider = this.PayerClaimsReportForm.controls['Provider'].value
      let fromDate = moment(this.PayerClaimsReportForm.controls['fromDate'].value).format('YYYY-MM-DD');
      let toDate = moment(this.PayerClaimsReportForm.controls['toDate'].value).format('YYYY-MM-DD');
      let payerId = this.PayerClaimsReportForm.controls['payerId'].value

      this.PayerClaimsReportForm.controls['summaryCriteria'].value.forEach(element => {
        this.filtterStatuses = this.filtterStatuses.concat(element.split(",", 3));

      });

      this.searchService.getClaimSearchResults(Provider, payerId, this.filtterStatuses, fromDate, toDate).subscribe((event) => {
        if (event instanceof HttpResponse) {

          this.searchedClaim=event.body["content"] as SearchedClaim[];
          this.commen.loadingChanged.next(false);
           
        }

      });

    }




  }
}
