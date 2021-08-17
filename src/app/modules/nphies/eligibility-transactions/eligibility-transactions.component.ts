import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ViewEligibilityDetailsComponent } from '../view-eligibility-details/view-eligibility-details.component';
@Component({
  selector: 'app-eligibility-transactions',
  templateUrl: './eligibility-transactions.component.html',
  styles: []
})
export class EligibilityTransactionsComponent implements OnInit {
  payers: { id: string[] | string, name: string }[];
  claimStatusSummaryForm: FormGroup;
  submitted = false;
  errorMessage: string;
  detailTopActionIcon = 'ic-download.svg';
  claimStatusSummaryData: any;
  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false };
  minDate: any;
  constructor(
    public commen: SharedServices,
    private formBuilder: FormBuilder,
    private reportService: ReportsService,
    private location: Location,
    private routeActive: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  criterias: { id: string, name: string }[] = [
    { id: 'uploaddate', name: 'Upload Date' },
    { id: 'claimdate', name: 'Claim Date' },
  ];
  ngOnInit() {
    this.payers = [];
    const allPayersIds = [];
    this.datePickerConfig = { dateInputFormat: 'DD/MM/YYYY' };
    this.payers.push({
      id: '0',
      name: 'All'
    });
    this.commen.getPayersList().map(value => {
      this.payers.push({
        id: `${value.id}`,
        name: value.name
      });
      allPayersIds.push(`${value.id}`);
    });

    this.formLoad();

    this.routeActive.queryParams.subscribe(params => {
      if (params.payerId != null) {
        this.claimStatusSummaryForm.controls['payerId'].patchValue(params.payerId);
      }
      if (params.summaryCriteria != null) {
        this.claimStatusSummaryForm.controls['summaryCriteria'].patchValue(params.summaryCriteria);
      }
      if (params.fromDate != null) {
        const fromDate = moment(params.fromDate, 'YYYY-MM-DD').toDate();
        this.claimStatusSummaryForm.controls['fromDate'].patchValue(fromDate);
      }
      if (params.toDate != null) {
        const toDate = moment(params.toDate, 'YYYY-MM-DD').toDate();
        this.claimStatusSummaryForm.controls['toDate'].patchValue(toDate);
      }
      if (this.claimStatusSummaryForm.valid) {
        this.search();
      }
    });

  }

  formLoad() {
    this.claimStatusSummaryForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      payerId: ['', Validators.required],
      summaryCriteria: ['', Validators.required],
      elegibilityId: ['', Validators.required],
      beneficiary: ['', Validators.required],
      status: [Validators.required]
    });
  }
  search() {
    this.submitted = true;
    if (this.claimStatusSummaryForm.invalid) {
      return;
    }

    this.commen.loadingChanged.next(true);
    this.claimStatusSummaryForm.value.fromDate = moment(this.claimStatusSummaryForm.value.fromDate).format('YYYY-MM-DD');
    this.claimStatusSummaryForm.value.toDate = moment(this.claimStatusSummaryForm.value.toDate).format('YYYY-MM-DD');
    // this.editURL(this.claimStatusSummaryForm.value.fromDate, this.claimStatusSummaryForm.value.toDate);
    this.reportService.getClaimStatusSummary(this.commen.providerId, this.claimStatusSummaryForm.value).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const body = event['body'];
        this.commen.loadingChanged.next(false);
        this.claimStatusSummaryData = JSON.parse(body);
      }
    }, err => {
      this.claimStatusSummaryData = null;
      this.commen.loadingChanged.next(false);
      console.log(err);
    });


  }
  get formCn() { return this.claimStatusSummaryForm.controls; }

  editURL(fromDate?: string, toDate?: string) {
    let path = '/reports/claim-status-summary-report?';
    if (this.claimStatusSummaryForm.value.payerId != null) {
      path += `payerId=${this.claimStatusSummaryForm.value.payerId}&`;
    }
    if (this.claimStatusSummaryForm.value.summaryCriteria != null) {
      path += `summaryCriteria=${this.claimStatusSummaryForm.value.summaryCriteria}&`;
    }
    if (fromDate != null) {
      path += `fromDate=${fromDate}&`;
    }
    if (toDate != null) {
      path += `toDate=${toDate}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }
  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.claimStatusSummaryForm.value.toDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.claimStatusSummaryForm.controls['toDate'].patchValue('');
      }
    }
    this.minDate = new Date(event);

  }
  openDetailsDialog() {
    const dialogRef = this.dialog.open(ViewEligibilityDetailsComponent,
      {
        panelClass: ['primary-dialog', 'full-screen-dialog']
      });
  }




}
