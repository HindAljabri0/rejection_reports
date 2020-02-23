import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { PaymentRefernceDetail } from 'src/app/models/paymentRefernceDetail';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-payment-reference-report',
  templateUrl: './payment-reference-report.component.html',
  styleUrls: ['./payment-reference-report.component.css']
})
export class PaymentReferenceReportComponent implements OnInit {

  detailCardTitle = "Payment References";
  detailTopActionText = "vertical_align_bottom";
  detailAccentColor = "#3060AA";
  detailActionText: string = null;
  detailSubActionText: string = null;
  detailCheckBoxIndeterminate: boolean;
  detailCheckBoxChecked: boolean;
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

  paymentDetails: PaginatedResult<PaymentRefernceDetail>;
  payments = Array();


  constructor(public reportService: ReportsService, public commen: CommenServicesService, public routeActive: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    // this.fetchData();
  }
  async fetchData() {
    if (this.providerId == null || this.from == null || this.to == null || this.payerId == null) return;
    this.commen.loadingChanged.next(true);
    this.errorMessage = null;
    let event;
    event = await this.reportService.getPaymentSummary(this.providerId, this.from, this.to, this.payerId, this.queryPage, this.pageSize).subscribe((event) => {
      if (event instanceof HttpResponse) {
        this.paymentDetails = new PaginatedResult(event.body, PaymentRefernceDetail);
        this.payments = this.paymentDetails.content;
        const pages = Math.ceil((this.paymentDetails.totalElements / this.paginator.pageSize));
        this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
        this.manualPage = this.paymentDetails.number;
        this.paginator.pageIndex = this.paymentDetails.number;
        this.paginator.pageSize = this.paymentDetails.size;
      }
      this.commen.loadingChanged.next(false);
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if ((error.status / 100).toFixed() == "4") {
          this.errorMessage = 'Access Denied.';
        } else if ((error.status / 100).toFixed() == "5") {
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
    this.onPaginationChange.emit(event);
    this.queryPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchData();
  }
  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction({ previousPageIndex: this.paginator.pageIndex, pageIndex: index, pageSize: this.paginator.pageSize, length: this.paginator.length })
  }

  get paginatorLength() {
    if (this.paymentDetails != null) {
      return this.paymentDetails.totalElements;
    }
    else return 0;
  }

  mapPayer(payerId: string[]) {
    if(payerId.length > 1)
      return 'All';
    return this.commen.getPayersList().find(value => `${value.id}` == payerId[0]).name;
  }

}
