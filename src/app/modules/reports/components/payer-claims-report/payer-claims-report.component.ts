import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { SearchService } from 'src/app/services/serchService/search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { Subscription } from 'rxjs';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { MatPaginator } from '@angular/material';
import { PaginatedResult } from 'src/app/models/paginatedResult';

@Component({
  selector: 'app-payer-claims-report',
  templateUrl: './payer-claims-report.component.html',
  styles: []
})
export class PayerClaimsReportComponent implements OnInit {
  payers: { id: string[] | string, name: string }[];
  claimStatusSummaryData: any;

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
  paginatorPagesNumbers: number[];
  page: number = 0;
  pageSize: number = 10;
  minDate: any;
  paginatorLength1 = 0;


  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  PayerClaimsReportForm: FormGroup;
  searchedClaim: SearchedClaim[] = []


  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' };
  manualPage = 0;
  constructor(
    public commen: SharedServices, 
    private formBuilder: FormBuilder, 
    private searchService: SearchService,
    // private location: Location,
    private downloadService: DownloadService
    ) {
        this.page = 0;
      this.pageSize = 10;
    }
  submitted = false;
  errorMessage=null;
  detailTopActionIcon = 'ic-download.svg';
  lastDownloadSubscriptions: Subscription;

  ngOnInit() {
    this.payers = [];

    this.PayerClaimsReportForm = this.formBuilder.group({
      providerId: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      payerId: ['', Validators.required],
      summaryCriteria: ['', Validators.required],
    });
    // this.commen.getPayersList().map(value => {
    //   this.payers.push({
    //     id: `${value.id}`,
    //     name: value.name
    //   });
    // });

  }

  get formCn() { return this.PayerClaimsReportForm.controls; }

  

  
  
  get paginatorLength() {
    if (this.searchedClaim.length != null) {
      return this.paginatorLength1
    } else {
      return 0;
    }
  }

  paginatorAction(event) {
    this.manualPage = event['pageIndex'];
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.search();
  }
  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction({
      previousPageIndex: this.paginator.pageIndex,
      pageIndex: index,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }
  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.PayerClaimsReportForm.value.toDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.PayerClaimsReportForm.controls['toDate'].patchValue('');
      }
    }
    this.minDate = new Date(event);

  }
  search() {
    this.submitted = true;
    this.filtterStatuses = [];
    this.detailTopActionIcon = 'ic-download.svg';
    this.errorMessage = null;
    if (this.PayerClaimsReportForm.valid) {
      this.commen.loadingChanged.next(true);
      let Provider = this.PayerClaimsReportForm.controls['providerId'].value
      let fromDate = moment(this.PayerClaimsReportForm.controls['fromDate'].value).format('YYYY-MM-DD');
      let toDate = moment(this.PayerClaimsReportForm.controls['toDate'].value).format('YYYY-MM-DD');
      let payerId = this.PayerClaimsReportForm.controls['payerId'].value

    this.PayerClaimsReportForm.controls['summaryCriteria'].value.forEach(element => {
      this.filtterStatuses = this.filtterStatuses.concat(element.split(",", 3));

    });


    this.searchService.getPayerClaimReportResults(Provider, payerId, this.filtterStatuses, fromDate, toDate,this.page, this.pageSize).subscribe((event) => {
      if (event instanceof HttpResponse) {

        this.searchedClaim = event.body["content"] as SearchedClaim[];
        this.paginatorLength1 = event.body["totalElements"];
        this.manualPage = event.body["number"];
        const pages = Math.ceil((this.paginatorLength1 / this.paginator.pageSize));
        this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          if (this.searchedClaim.length == 0) {
        this.errorMessage = 'No Results Found';
      }
        this.commen.loadingChanged.next(false);

      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if ((error.status / 100).toFixed() == '4') {
          this.errorMessage = 'Access Denied.';
        } else if ((error.status / 100).toFixed() == '5') {
          this.errorMessage = 'Server could not handle the request. Please try again later.';
        } else {
          this.errorMessage = 'Somthing went wrong.';
        }
      }
      this.commen.loadingChanged.next(false);
    });

  }}

  // download() {
  //   if (this.detailTopActionIcon == 'ic-check-circle.svg') {
  //     return;
  //   }
  //   const fromDate = moment(this.PayerClaimsReportForm.value.fromDate).format('YYYY-MM-DD');
  //   const toDate = moment(this.PayerClaimsReportForm.value.toDate).format('YYYY-MM-DD');
  //   const criteriaType = this.PayerClaimsReportForm.value.summaryCriteria.toString() === 'uploaddate' ? 'extraction' : 'claim';
  //   this.lastDownloadSubscriptions = this.downloadService
  //     .startGeneratingDownloadFile(this.reportService
  //       .downloadMedicalRejectionReport(
  //         this.commen.providerId,
  //         fromDate,
  //         toDate,
  //         this.medicalRejectionReportForm.value.payerId,
  //         criteriaType
  //       ))
  //     .subscribe(status => {
  //       if (status != DownloadStatus.ERROR) {
  //         this.detailTopActionIcon = 'ic-check-circle.svg';
  //       } else {
  //         this.detailTopActionIcon = 'ic-download.svg';
  //       }
  //     });
  // }


}


