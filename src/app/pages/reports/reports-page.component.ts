
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { filter } from 'rxjs/operators';
import { SubmittedInvoicesComponent } from './submitted-invoices/submitted-invoices.component';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { PaymentReferenceReportComponent } from './payment-reference-report/payment-reference-report.component';
import { PaymentClaimSummaryReportComponent } from './payment-claim-summary-report/payment-claim-summary-report.component';


@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit {

  payers: { id: number, name: string }[] = [
    { id: 102, name: "Tawuniya" },
    { id: 300, name: "MDG" },
    { id: 306, name: "SE" },
    { id: 204, name: "AXA" },
  ];
  reports: { id: number, name: string }[] = [
    { id: 1, name: "Payment" },
    { id: 2, name: "Submitted Invoices" },
  ];

  downloadIcon = "vertical_align_bottom";


  reportTypeControl: FormControl = new FormControl();
  fromDateControl: FormControl = new FormControl();
  toDateControl: FormControl = new FormControl();
  payerIdControl: FormControl = new FormControl();

  page: number;
  pageSize: number;
  tempPage: number = 0;
  tempPageSize: number = 10;

  paymentReference: string;
  claimId:string;

  @ViewChild('paymentSearchResult', { static: false }) paymentSearchResult: PaymentReferenceReportComponent;
  @ViewChild('paymentClaimSummaryReport', { static: false }) paymentClaimSummaryReport: PaymentClaimSummaryReportComponent;
  @ViewChild('submittedInvoicesSearchResult', { static: false }) submittedInvoicesSearchResult: SubmittedInvoicesComponent;


  constructor(private location: Location, private router: Router, private routeActive: ActivatedRoute, private commen: CommenServicesService, private reportsService: ReportsService) { }

  ngOnInit() {
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
        this.payerIdControl.setValue(Number.parseInt(value.payer));
      }
      if (value.type != undefined) {
        this.reportTypeControl.setValue(Number.parseInt(value.type));
      }
      if (value.pRef != null) {
        this.paymentReference = value.pRef;
      }
      if (value.claimId != null) {
        this.claimId = value.claimId;
      }
      if (value.page != null) {
        this.page = Number.parseInt(value.page);
      } else {
        this.page = 0;
      }
      if (value.pageSize != null) {
        this.pageSize = Number.parseInt(value.pageSize);
      } else {
        this.pageSize = 10;
      }
    });
  }

  ngAfterViewInit() {
    if (this.paymentReference == null) {
      this.search();
    } else {
      this.paymentClaimSummaryReport.fetchData(this.paymentReference);
    }
  }

  search() {
    if (this.paymentReference != null || this.reportTypeControl.invalid || this.payerIdControl.invalid || this.fromDateControl.invalid || this.toDateControl.invalid || this.fromDateControl.value == null || this.toDateControl.value == null) {
      return;
    }
    let queryParams: Params = {};
    const fromDate: Date = new Date(this.fromDateControl.value);
    const toDate: Date = new Date(this.toDateControl.value);
    const from = `${(fromDate.getFullYear())}-${(fromDate.getMonth() + 1)}-${fromDate.getDate()}`;
    const to = `${(toDate.getFullYear())}-${(toDate.getMonth() + 1)}-${toDate.getDate()}`;
    queryParams.from = from;
    queryParams.to = to;
    queryParams.payer = this.payerIdControl.value;
    queryParams.type = this.reportTypeControl.value;
    if (this.page > 0) {
      queryParams.page = this.page;
    }
    if (this.pageSize > 10) {
      queryParams.pageSize = this.pageSize;
    }
    this.router.navigate([this.providerId, 'reports'], { queryParams: queryParams });
    if (this.reportTypeControl.value == 1) {
      this.paymentSearchResult.fetchData();
    }
    if (this.reportTypeControl.value == 2) {
      this.submittedInvoicesSearchResult.fetchData();
    }
  }

  onPaymentClick(ref) {
    if (this.reportTypeControl.value == 1) {
      this.tempPage = this.page;
      this.tempPageSize = this.pageSize;
      this.page = 0;
      this.pageSize = 10;
      this.paymentClaimSummaryReport.page = 0;
      this.paymentClaimSummaryReport.pageSize = 10;
      this.resetURL();
      this.paymentReference = ref;
      this.paymentClaimSummaryReport.fetchData(this.paymentReference);
      this.location.go(`${this.location.path()}&pRef=${ref}`);
    }
    else
    if (this.reportTypeControl.value == 2) {
      this.claimId = ref;
      
    }
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
    this.paymentSearchResult.queryPage = this.page;
    this.paymentSearchResult.pageSize = this.pageSize;
    if (this.paymentSearchResult.payments.length == 0) this.paymentSearchResult.fetchData();
    this.resetURL();
  }

  download() {
    if (this.downloadIcon == "check_circle") return;

    this.reportsService.downloadPaymentClaimSummaryAsCSV(this.providerId, this.paymentReference).subscribe(event => {
      if (event instanceof HttpResponse) {
        var exportedFilenmae = `Report_Payment_Reference_${this.paymentReference}.csv`;
        if (navigator.msSaveBlob) { // IE 10+
          var blob = new Blob([event.body as BlobPart], { type: 'text/csv;charset=utf-8;' });
          navigator.msSaveBlob(blob, exportedFilenmae);
        } else {
          var a = document.createElement("a");
          a.href = 'data:attachment/csv;charset=ISO-8859-1,' + encodeURI(event.body + "");
          a.target = '_blank';
          a.download = exportedFilenmae

          a.click();
          this.downloadIcon = "check_circle";
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        console.log(errorEvent);
        this.commen.openDialog(new MessageDialogData("", "Could not reach the server at the moment. Please try again later.", true));
      }
    });
  }

  resetURL() {
    const fromDate: Date = new Date(this.fromDateControl.value);
    const toDate: Date = new Date(this.toDateControl.value);
    const from = `${(fromDate.getFullYear())}-${(fromDate.getMonth() + 1)}-${fromDate.getDate()}`;
    const to = `${(toDate.getFullYear())}-${(toDate.getMonth() + 1)}-${toDate.getDate()}`;
    let URL = `${this.providerId}/reports?from=${from}&to=${to}&payer=${this.payerIdControl.value}&type=${this.reportTypeControl.value}`;
    if(this.paymentReference != null){
      URL += `&pRef=${this.paymentReference}`;
    }
    if (this.claimId != null) {
      URL += `&claimId=${this.claimId}`
    }
    if (this.page > 0) {
      URL += `&page=${this.page}`;
    }
    if (this.pageSize > 10) {
      URL += `&pageSize=${this.pageSize}`;
    }
    this.location.go(URL);
  }

  get providerId() {
    return this.commen.providerId;
  }

  get showPaymentSearch() {
    return this.reportTypeControl.value == 1;
  }

  get showSubmittedInvoicesSearch() {
    return this.reportTypeControl.value == 2;
  }

  get fromDate() {
    let date: Date = new Date(this.fromDateControl.value);
    return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
  }

  get toDate() {
    let date: Date = new Date(this.toDateControl.value);
    return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
  }

  get pRef() {
    return this.paymentReference;
  }

  get height() {
    return `${this.pageSize * 55 + 275}px`;
  }


}