import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { EventEmitter } from '@angular/core';
import { SubmittedInvoiceSummary } from 'src/app/models/submittedInvoiceSummary';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import * as moment from 'moment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-submitted-invoices',
  templateUrl: './submitted-invoices.component.html',
  styles: []
})
export class SubmittedInvoicesComponent implements OnInit {

  detailCardTitle = 'Submitted Invoices';
  detailTopActionIcon = 'ic-download.svg';
  @Input() from: string;
  @Input() to: string;
  @Input() payerId: string[];
  @Input() queryPage: number;
  @Input() pageSize: number;
  @Input() providerId: string;

  @Output() onPaymentClick = new EventEmitter();
  @Output() onPaginationChange = new EventEmitter();

  paginatorPagesNumbers: number[];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;

  errorMessage: string;

  paymentDetails: PaginatedResult<SubmittedInvoiceSummary>;
  claims = Array();


  constructor(
    public reportService: ReportsService,
    public commen: SharedServices,
    public routeActive: ActivatedRoute,
    public router: Router,
    private dialogService: DialogService,
    private downloadService: DownloadService,
    private location: Location) { }

  ngOnInit() {
    // this.fetchData();
  }

  async fetchData() {
    if (this.providerId == null || this.from == null || this.to == null || this.payerId == null) {
      return;
    }
    this.commen.loadingChanged.next(true);
    this.errorMessage = null;
    let event;
    const fromDate = moment(this.from).format('YYYY-MM-DD');
    const toDate = moment(this.to).format('YYYY-MM-DD');
    this.editURL(fromDate, toDate);
    event = await this.reportService.getSubmittedInvoicesSummary(this.providerId,
      fromDate,
      toDate,
      this.payerId,
      this.queryPage,
      this.pageSize).subscribe((event) => {
        if (event instanceof HttpResponse) {
          this.paymentDetails = new PaginatedResult(event.body, SubmittedInvoiceSummary);
          this.claims = this.paymentDetails.content;
          const pages = Math.ceil((this.paymentDetails.totalElements / this.paginator.pageSize));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          this.manualPage = this.paymentDetails.number;
          this.paginator.pageIndex = this.paymentDetails.number;
          this.paginator.pageSize = this.paymentDetails.numberOfElements;
          if (this.claims.length == 0) {
            this.errorMessage = 'No Results Found';
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

  download() {
    if (this.detailTopActionIcon == 'ic-check-circle.svg') {
      return;
    }

    this.downloadService.startDownload(this.reportService.downloadSubmittedInvoiceSummaryAsCSV(this.providerId, this.from, this.to,
      this.payerId)).subscribe(status => {
        if (status == DownloadStatus.ERROR) {
          this.detailTopActionIcon = 'ic-download.svg';
        } else {
          this.detailTopActionIcon = 'ic-check-circle.svg';
        }
      });
  }

  paginatorAction(event) {
    this.manualPage = event['pageIndex'];
    this.onPaginationChange.emit(event);
    this.queryPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchData();
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
    let path = `/${this.commen.providerId}/reports/submission-report?`;

    if (this.payerId != null) {
      path += `payer=${this.payerId}&`;
    }
    if (fromDate != null) {
      path += `from=${fromDate}&`;
    }
    if (toDate != null) {
      path += `to=${toDate}`;
    }
    if (this.queryPage > 0) {
      path += `&page=${this.queryPage}`;
    }
    if (this.pageSize > 10) {
      path += `&pageSize=${this.pageSize}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }

}
