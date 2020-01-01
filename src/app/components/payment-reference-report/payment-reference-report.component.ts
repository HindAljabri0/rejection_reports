import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-payment-reference-report',
  templateUrl: './payment-reference-report.component.html',
  styleUrls: ['./payment-reference-report.component.css']
})
export class PaymentReferenceReportComponent implements OnInit {

  detailCardTitle: string;
  detailTopActionText = "vertical_align_bottom";
  detailAccentColor: string;
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


  constructor(public reportService:ReportsService,public commen:CommenServicesService, public routeActive: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.fetchData()
  }
  async fetchData()
  {
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
    event = await this.reportService.getPaymentSummary(this.providerId, this.from, this.to, this.payerId,this.queryPage,this.queryPage).subscribe((event) => {
      if (event instanceof HttpResponse) {
        if ((event.status / 100).toFixed() == "2") {
         console.log(event);
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

}
