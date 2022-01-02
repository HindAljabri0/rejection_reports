import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { PaymentRefernceDetail } from 'src/app/models/paymentRefernceDetail';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { PaymentClaimSummaryReportComponent } from '../payment-claim-summary-report/payment-claim-summary-report.component';
import * as moment from 'moment';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';
@Component({
  selector: 'app-payment-reference-report',
  templateUrl: './payment-reference-report.component.html',
  styles: []
})
export class PaymentReferenceReportComponent implements OnInit {

  // @Input() from: string;
  // @Input() to: string;
  // @Input() payerId: string[];
  // @Input() queryPage: number;
  // @Input() pageSize: number;
  // @Input() providerId: string;

  // @Output() onPaymentClick = new EventEmitter();
  // @Output() onPaginationChange = new EventEmitter();



  fromDateControl: FormControl = new FormControl();
  fromDateHasError = false;

  toDateControl: FormControl = new FormControl();
  toDateHasError = false;

  payerIdControl: FormControl = new FormControl();
  payerIdHasError = false;

  rejectionCriteriaHasError = false;

  paginatorPagesNumbers: number[];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;

  errorMessage: string;

  paymentDetails: PaginatedResult<PaymentRefernceDetail>;
  payments = Array();

  page: number;
  pageSize: number;
  tempPage = 0;
  tempPageSize = 10;
  payers: { id: string[] | string, name: string }[];
  paymentReference: string;
  claimId: string;
  actionIcon = 'ic-download.svg';
  @ViewChild('paymentClaimSummaryReport', { static: false }) paymentClaimSummaryReport: PaymentClaimSummaryReportComponent;
  constructor(
    public reportService: ReportsService,
    public commen: SharedServices,
    public routeActive: ActivatedRoute,
    public router: Router,
    private location: Location, private downloadService: DownloadService) { }

  ngOnInit() {
    // this.fetchData();
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
      if (value.pRef != null) {
        this.paymentReference = value.pRef;
      }
      if (value.claimId != null) {
        this.claimId = value.claimId;
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
    this.fetchData();
  }
  async fetchData() {
    this.fromDateHasError = false;
    this.toDateHasError = false;
    this.payerIdHasError = false;
    this.rejectionCriteriaHasError = false;

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

    if (this.commen.providerId == null || this.fromDateControl.value == null || this.toDateControl.value == null || this.payerIdControl.value == null) {
      return;
    }


    if (this.commen.providerId == null || this.fromDateControl.value == null || this.toDateControl.value == null || this.payerIdControl.value == null) {
      return;
    }
    this.commen.loadingChanged.next(true);
    this.errorMessage = null;
    const fromDate = moment(this.fromDateControl.value).format('YYYY-MM-DD');
    const toDate = moment(this.toDateControl.value).format('YYYY-MM-DD');
    this.editURL(fromDate, toDate);
    let event;
    event = await this.reportService.getPaymentSummary(this.commen.providerId,
      fromDate,
      toDate,
      this.payerIdControl.value,
      this.page,
      this.pageSize).subscribe((event) => {
        if (event instanceof HttpResponse) {
          this.paymentDetails = new PaginatedResult(event.body, PaymentRefernceDetail);
          this.payments = this.paymentDetails.content;
          if (this.payments.length > 0) {
            const pages = Math.ceil((this.paymentDetails.totalElements / this.paginator.pageSize));
            this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
            this.manualPage = this.paymentDetails.number;
            this.paginator.pageIndex = this.paymentDetails.number;
            this.paginator.pageSize = this.paymentDetails.size;
          }
          if (this.payments.length == 0) {
            this.errorMessage = 'No Results Found';
            this.pageSize = 10;
            this.page = 0;
          }
        }
        this.commen.loadingChanged.next(false);
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
  }

  paginatorAction(event) {
    this.manualPage = event['pageIndex'];
    this.paginationChange(event);
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchData();
  }
  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
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

  get paginatorLength() {
    if (this.paymentDetails != null) {
      return this.paymentDetails.totalElements;
    } else {
      return 0;
    }
  }

  mapPayer(payerId) {
    return this.commen.getPayersList().find(value => `${value.id}` == payerId).name;
  }
  editURL(fromDate?: string, toDate?: string) {
    let path = `/${this.commen.providerId}/reports/payment-report?`;
    if (this.paymentReference != null) {
      path += `&pRef=${this.paymentReference}`;
    }
    if (this.claimId != null) {
      path += `&claimId=${this.claimId}`;
    }
    if (this.payerIdControl.value != null) {
      path += `payer=${this.payerIdControl.value}&`;
    }
    if (fromDate != null) {
      path += `from=${fromDate}&`;
    }
    if (toDate != null) {
      path += `to=${toDate}`;
    }
    if (this.page > 0) {
      path += `&page=${this.page}`;
    }
    if (this.pageSize > 10) {
      path += `&pageSize=${this.pageSize}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }
  onPaymentClick(ref) {
    // if (this.reportTypeControl.value == 1) {
    this.tempPage = this.page;
    this.tempPageSize = this.pageSize;
    this.page = 0;
    this.pageSize = 10;
    // this.resetURL();
    this.paymentReference = ref;
    this.paymentClaimSummaryReport.fetchData(this.paymentReference);
    this.location.go(`${this.location.path()}&pRef=${ref}`);
    // }
    // else if (this.reportTypeControl.value == 2) {
    this.claimId = ref;
    // }
    // else if (this.reportTypeControl.value == 3) {
    //   this.criteria = ref;
    // }

  }
  backButton() {
    this.paymentReference = null;
    this.page = this.tempPage;
    this.pageSize = this.tempPageSize;
    // this.paymentSearchResult.queryPage = this.page;
    // this.paymentSearchResult.pageSize = this.pageSize;
    // if (this.paymentSearchResult.payments.length == 0) {
    //   this.paymentSearchResult.fetchData();
    // }
    // this.resetURL();
  }
  download() {
    if (this.actionIcon === 'ic-check-circle.svg') {
      return;
    }
    this.downloadService.startDownload(this.reportService.downloadPaymentClaimSummaryAsCSV(
      this.commen.providerId, this.paymentReference)).subscribe(status => {
        if (status === DownloadStatus.ERROR) {
          this.actionIcon = 'ic-download.svg';
        } else {
          this.actionIcon = 'ic-check-circle.svg';
        }
      });
  }

}
