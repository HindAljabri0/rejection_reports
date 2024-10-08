import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { SubmittedInvoicesComponent } from './submitted-invoices/submitted-invoices.component';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { PaymentReferenceReportComponent } from './payment-reference-report/payment-reference-report.component';
import { PaymentClaimSummaryReportComponent } from './payment-claim-summary-report/payment-claim-summary-report.component';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { RejectionReportComponent } from './rejection-report/rejection-report.component';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { EditClaimComponent } from '../edit-claim/edit-claim.component';


@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styles: []
})
export class ReportsComponent implements OnInit, AfterViewInit {

  payers: { id: string[] | string, name: string }[];
  reports: { id: number, name: string }[] = [
    { id: 1, name: 'Payment Report' },
    { id: 2, name: 'Claim Submission Report' },
    { id: 3, name: 'Technical Rejection Report' },
  ];

  criterias: { id: number, name: string }[] = [
    { id: 1, name: 'Upload Date' },
    { id: 2, name: 'Claim Date' },
  ];

  actionIcon = 'ic-download.svg';


  @ViewChild('submittedInvoicesSearchResult', { static: false }) submittedInvoicesSearchResult: SubmittedInvoicesComponent;
  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;

  reportTypeControl: FormControl = new FormControl();
  fromDateControl: FormControl = new FormControl();
  fromDateHasError = false;

  toDateControl: FormControl = new FormControl();
  toDateHasError = false;

  payerIdControl: FormControl = new FormControl();
  payerIdHasError = false;

  rejectionCriteriaControl: FormControl = new FormControl();
  rejectionCriteriaHasError = false;

  page: number;
  pageSize: number;
  tempPage = 0;
  tempPageSize = 10;

  paymentReference: string;
  claimId: string;
  criteria: string;
  payerId: number[];


  constructor(
    private location: Location,
    private router: Router,
    private routeActive: ActivatedRoute,
    private commen: SharedServices,
    private reportsService: ReportsService,
    private dialogService: DialogService,
    public dialog: MatDialog,
    private downloadService: DownloadService) { }

  ngOnInit() {
    this.payers = [];
    const allPayersIds = [];
    this.commen.getPayersList().map(value => {
      this.payers.push({
        id: `${value.id}`,
        name: value.name
      });
      allPayersIds.push(`${value.id}`);
    });
    this.payers.push({
      id: allPayersIds,
      name: 'All'
    });
    this.routeActive.queryParams.subscribe(value => {
      if (value.from != undefined) {
        const fromDate: Date = new Date(value.from);
        this.fromDateControl.setValue(fromDate);
      }
      if (value.to != undefined) {
        const toDate: Date = new Date(value.to);
        this.toDateControl.setValue(toDate);
      }
      if (value.payer != undefined) {
        if (value.payer instanceof Array && value.payer.length > 1) {
          this.payerIdControl.setValue(allPayersIds);
        } else {
          this.payerIdControl.setValue(value.payer);
        }
      }
      if (value.type != undefined) {
        this.reportTypeControl.setValue(Number.parseInt(value.type, 10));
      }
      if (value.pRef != null) {
        this.paymentReference = value.pRef;
      }
      if (value.claimId != null) {
        this.claimId = value.claimId;
      }
      if (value.criteria != null) {
        this.rejectionCriteriaControl.setValue(Number.parseInt(value.criteria, 10));
        this.criteria = value.criteria;
      }
      if (value.page != null) {
        this.page = Number.parseInt(value.page, 10);
      } else {
        this.page = 0;
      }
      if (value.pageSize != null) {
        this.pageSize = Number.parseInt(value.pageSize, 10);
      } else {
        this.pageSize = 10;
      }
    }).unsubscribe();

    if (this.reportTypeControl.value) {
      this.search();
    }
  }

  ngAfterViewInit() {
    if (!this.reportTypeControl.value) {
      this.search();
    }
  }

  search() {
    this.fromDateHasError = false;
    this.toDateHasError = false;
    this.payerIdHasError = false;
    this.rejectionCriteriaHasError = false;

    if (this.reportTypeControl.invalid) {
      return;
    }

    if (this.payerIdControl.invalid) {
      this.payerIdHasError = true;
      return;
    }

    if (this.fromDateControl.invalid) {
      this.fromDateHasError = true;
      return;
    }

    if (this.toDateControl.invalid) {
      this.toDateHasError = true;
      return;
    }

    if (this.reportTypeControl.value == 3 && this.rejectionCriteriaControl.invalid) {
      this.rejectionCriteriaHasError = true;
      return;
    }

    const queryParams: Params = {};
    const fromDate: Date = new Date(this.fromDateControl.value);
    const toDate: Date = new Date(this.toDateControl.value);
    const from = `${(fromDate.getFullYear())}-${(fromDate.getMonth() + 1)}-${fromDate.getDate()}`;
    const to = `${(toDate.getFullYear())}-${(toDate.getMonth() + 1)}-${toDate.getDate()}`;
    queryParams.from = from;
    queryParams.to = to;
    queryParams.payer = this.payerIdControl.value;
    queryParams.type = this.reportTypeControl.value;
    queryParams.criteria = this.rejectionCriteriaControl.value;
    if (this.page > 0) {
      queryParams.page = this.page;
    }
    if (this.pageSize > 10) {
      queryParams.pageSize = this.pageSize;
    }


    if (this.submittedInvoicesSearchResult) {
      this.submittedInvoicesSearchResult.fetchData();
    }

  }

  searchSelect(event) {
    this.search();
  }

  onPaymentClick(data) {
    this.claimId = data.claimId;
    this.viewClaim(data.claimId, data.event);
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.resetURL();
  }

  backButton() {
    this.paymentReference = null;
    this.page = this.tempPage;
    this.pageSize = this.tempPageSize;
    this.resetURL();
  }

  resetURL() {
    const fromDate: Date = new Date(this.fromDateControl.value);
    const toDate: Date = new Date(this.toDateControl.value);
    const from = `${(fromDate.getFullYear())}-${(fromDate.getMonth() + 1)}-${fromDate.getDate()}`;
    const to = `${(toDate.getFullYear())}-${(toDate.getMonth() + 1)}-${toDate.getDate()}`;
    let URL = `${this.providerId}/submission-reports?from=${from}&to=${to}&payer=${this.payerIdControl.value}&type=${this.reportTypeControl.value}`;
    if (this.paymentReference != null) {
      URL += `&pRef=${this.paymentReference}`;
    }
    if (this.claimId != null) {
      URL += `&claimId=${this.claimId}`;
    }
    if (this.page > 0) {
      URL += `&page=${this.page}`;
    }
    if (this.pageSize > 10) {
      URL += `&pageSize=${this.pageSize}`;
    }
    if (this.criteria != null) {
      URL += `&criteria=${this.criteria}`;
    }
    this.location.go(URL);
  }

  get providerId() {
    return this.commen.providerId;
  }

  /* get payerId() {
    return this.commen.payerId;
  }*/

  get showPaymentSearch() {
    return this.reportTypeControl.value == 1;
  }

  get showSubmittedInvoicesSearch() {
    return this.reportTypeControl.value == 2;
  }

  get showRejectionReport() {
    return this.reportTypeControl.value == 3;
  }

  get fromDate() {
    const date: Date = new Date(this.fromDateControl.value);
    return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
  }

  get toDate() {
    const date: Date = new Date(this.toDateControl.value);
    return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
  }

  get pRef() {
    return this.paymentReference;
  }

  get height() {
    return `${this.pageSize * 55 + 275}px`;
  }

  viewClaim(claimId, e) {
    e.preventDefault();
    // this.location.go(`${this.commen.providerId}/claims?claimRefNo=${item.claimRefNo}&hasPrevious=1`);
    this.location.go(this.location.path() + '&hasPrevious=1');
    const dialogRef = this.dialog.open(EditClaimComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false, data: { claimId: claimId }
    });
  }

}
