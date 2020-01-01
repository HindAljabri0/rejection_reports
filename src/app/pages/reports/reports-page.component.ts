
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';

import { CommenServicesService } from 'src/app/services/commen-services.service';
import { filter } from 'rxjs/operators';
import { PaymentReferenceReportComponent } from 'src/app/components/payment-reference-report/payment-reference-report.component';


@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit{

  payers: { id: number, name: string }[] = [
    { id: 102, name: "Tawuniya" },
    { id: 300, name: "MDG" },
    { id: 306, name: "SE" },
    { id: 204, name: "AXA" },
  ];
  reports: { id: number, name: string }[] = [
    { id: 1, name: "Payment" },
  ];


  reportTypeControl: FormControl = new FormControl();
  fromDateControl: FormControl = new FormControl();
  toDateControl: FormControl = new FormControl();
  payerIdControl: FormControl = new FormControl();

  @ViewChild('paymentSearchResult', { static: false }) paymentSearchResult: PaymentReferenceReportComponent;

  constructor(private router: Router, private routeActive: ActivatedRoute, private commen: CommenServicesService) { }

  ngOnInit() {
    this.routeActive.queryParams.subscribe(value => {
      if (value.from != undefined) {
        const fromDate:Date = new Date(value.from);
        this.fromDateControl.setValue(fromDate);
      }
      if (value.to != undefined) {
        const toDate:Date = new Date(value.to);
        this.toDateControl.setValue(toDate);
      }
      if (value.payer != undefined) {
        this.payerIdControl.setValue(Number.parseInt(value.payer));
      }
      if (value.type != undefined) {
        this.reportTypeControl.setValue(Number.parseInt(value.type));
      }
    });
  }

  ngAfterViewInit(){
    this.search();
  }

  search() {
    if (this.reportTypeControl.invalid || this.payerIdControl.invalid || this.fromDateControl.invalid || this.toDateControl.invalid || this.fromDateControl.value == null || this.toDateControl.value == null) {
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


}