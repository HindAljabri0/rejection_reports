import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { PaymentRefernceDetail } from 'src/app/models/paymentRefernceDetail';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';

@Component({
  selector: 'app-payment-reference-report',
  templateUrl: './payment-reference-report.component.html',
  styleUrls: ['./payment-reference-report.component.css']
})
export class PaymentReferenceReportComponent implements OnInit {

  summaries: SearchStatusSummary[];
  detailCardTitle = "Payment References";
  detailTopActionText = "vertical_align_bottom";
  detailAccentColor = "#3060AA";
  detailActionText: string = null;
  detailSubActionText: string = null;
  detailCheckBoxIndeterminate: boolean;
  detailCheckBoxChecked: boolean;
  from: string;
  to: string;
  payerId: string;
  queryPage: number;
  providerId: string;

  paginatorPagesNumbers: number[];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;

  errorMessage: string;

  paymentDetails: PaginatedResult<PaymentRefernceDetail>;
  payments = Array();


  constructor(public reportService: ReportsService, public commen: CommenServicesService, public routeActive: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.fetchData();
  }
  async fetchData() {

    this.summaries = new Array();
    this.commen.loadingChanged.next(true);
    this.errorMessage = null;

    this.routeActive.params.subscribe(value => {
      this.providerId = value.providerId;
    });
    this.routeActive.queryParams.subscribe(value => {
      this.from = value.from;
      this.to = value.to;
      this.payerId = value.payer;
      this.queryPage = value.page == null ? 0 : Number.parseInt(value.page) - 1;
      if (Number.isNaN(this.queryPage) || this.queryPage < 0) this.queryPage = 0;
    });
    let event;
    event = await this.reportService.getPaymentSummary(this.providerId, this.from, this.to, this.payerId, this.queryPage, this.queryPage).subscribe((event) => {
      if (event instanceof HttpResponse) {
        if ((event.status / 100).toFixed() == "2") {
          this.paymentDetails = new PaginatedResult(event.body, PaymentRefernceDetail);
          this.payments = this.paymentDetails.content;
          console.log(event.body);
          console.log(this.paymentDetails);
          const pages = Math.ceil((this.paymentDetails.totalElements / this.paginator.pageSize));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          this.manualPage = this.paginator.pageIndex;
        } else if ((event.status / 100).toFixed() == "4") {
          console.log("400");
        } else if ((event.status / 100).toFixed() == "5") {
          console.log("500");
        } else {
          console.log("000");
        }
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

  mapPayer(payerId:string)
  {

    switch(payerId) { 
      case "300": { 
        return "MedGulf"; 
      } 
      default: { 
         return "";
      } 
   } 
  }

}
