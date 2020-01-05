
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommenServicesService } from 'src/app/services/commen-services.service';
import { filter } from 'rxjs/operators';
import { PaymentReferenceReportComponent } from 'src/app/components/payment-reference-report/payment-reference-report.component';
import { PaymentClaimSummaryReportComponent } from 'src/app/components/payment-claim-summary-report/payment-claim-summary-report.component';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';


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

  paymentReference:string;

  @ViewChild('paymentSearchResult', { static: false }) paymentSearchResult: PaymentReferenceReportComponent;
  @ViewChild('paymentClaimSummaryReport', {static: false}) paymentClaimSummaryReport: PaymentClaimSummaryReportComponent;

  constructor(private location: Location, private router: Router, private routeActive: ActivatedRoute, private commen: CommenServicesService, private reportsService:ReportsService) { }

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
      if(value.pRef != null){
        this.paymentReference = value.pRef;
      }
    });
  }

  ngAfterViewInit() {
    if(this.paymentReference == null){
      this.search();
    } else {
      this.paymentClaimSummaryReport.fetchData(this.paymentReference);
    }
  }

  search() {
    if (this.paymentReference != null || this.reportTypeControl.invalid || this.payerIdControl.invalid || this.fromDateControl.invalid || this.toDateControl.invalid || this.fromDateControl.value == null || this.toDateControl.value == null) {
      return;
    }
    const fromDate: Date = new Date(this.fromDateControl.value);
    const toDate: Date = new Date(this.toDateControl.value);
    const from = `${(fromDate.getFullYear())}-${(fromDate.getMonth() + 1)}-${fromDate.getDate()}`;
    const to = `${(toDate.getFullYear())}-${(toDate.getMonth() + 1)}-${toDate.getDate()}`;
    this.router.navigate([this.providerId, 'reports'], { queryParams: { from: from, to: to, payer: this.payerIdControl.value, type: this.reportTypeControl.value } });
    if (this.reportTypeControl.value == 1) {
      this.paymentSearchResult.fetchData();
    }
  }

  onPaymentClick(paymentRef) {
    this.paymentReference = paymentRef;
    this.resetURL();
    this.paymentClaimSummaryReport.fetchData(this.paymentReference);
    this.location.go(`${this.location.path()}&pRef=${paymentRef}`);
  }

  backButton(){
    this.paymentReference = null;
    if(this.paymentSearchResult.payments.length == 0) this.paymentSearchResult.fetchData();
    this.resetURL();
  }

  download(){
    if(this.downloadIcon == "check_circle") return;
    
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

  resetURL(){
    const fromDate: Date = new Date(this.fromDateControl.value);
    const toDate: Date = new Date(this.toDateControl.value);
    const from = `${(fromDate.getFullYear())}-${(fromDate.getMonth() + 1)}-${fromDate.getDate()}`;
    const to = `${(toDate.getFullYear())}-${(toDate.getMonth() + 1)}-${toDate.getDate()}`;
    this.location.go(`${this.providerId}/reports?from=${from}&to=${to}&payer=${this.payerIdControl.value}&type=${this.reportTypeControl.value}`);
  }

  get providerId() {
    return this.commen.providerId;
  }

  get showPaymentSearch() {
    return this.reportTypeControl.value == 1;
  }

  get fromDate() {
    let date: Date = new Date(this.fromDateControl.value);
    return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
  }

  get toDate() {
    let date: Date = new Date(this.toDateControl.value);
    return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
  }

  get pRef(){
    return this.paymentReference;
  }


}