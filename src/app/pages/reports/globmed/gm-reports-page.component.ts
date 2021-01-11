
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { SharedServices } from 'src/app/services/shared.services';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MatMenuTrigger } from '@angular/material';
import { SummaryComponent } from './summary/summary.component';

@Component({
  selector: 'app-gm-reports-page',
  templateUrl: './gm-reports-page.component.html',
  styleUrls: ['./gm-reports-page.component.css']
})
export class GmReportsPageComponent implements OnInit, AfterViewInit {

  
  reports: { id: number, name: string }[] = [
    { id: 1, name: "Summary Report" },
    { id: 2, name: "E-billing Report" },
  ];
  payers: {
    id: number;
    name: string;
    arName: string;
  }[] = [];

  downloadIcon = "vertical_align_bottom";


  reportTypeControl: FormControl = new FormControl();
  selectedPayerControl: FormControl = new FormControl();
  fromDateControl: FormControl = new FormControl();
  fromDateHasError: boolean = false;

  toDateControl: FormControl = new FormControl();
  toDateHasError: boolean = false;

  page: number;
  pageSize: number;
  tempPage: number = 0;
  tempPageSize: number = 10;

  claimId: string;
  criteria: string;

  @ViewChild('summarySearchResult', { static: false }) summarySearchResult: SummaryComponent;
  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;


  constructor(private location: Location, private router: Router, private routeActive: ActivatedRoute, private commen: SharedServices, private reportsService: ReportsService, private dialogService: DialogService) { }

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
      if (value.type != undefined) {
        this.reportTypeControl.setValue(Number.parseInt(value.type));
      }
      if(value.payer != undefined){
        this.selectedPayerControl.setValue(Number.parseInt(value.payer));
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
    this.payers = this.commen.getPayersList();
  }

  ngAfterViewInit() {

  }

  search() {
    this.fromDateHasError = false;
    this.toDateHasError = false;
    
    if (this.reportTypeControl.invalid || this.fromDateControl.invalid || Number.isNaN(this.fromDateControl.value) || this.toDateControl.invalid || Number.isNaN(this.toDateControl.value) || this.fromDateControl.value == null || this.toDateControl.value == null) {
      this.toDateHasError = true;
      this.fromDateHasError = true;
      return;
    }
    let queryParams: Params = {};
    const fromDate: Date = new Date(this.fromDateControl.value);
    const toDate: Date = new Date(this.toDateControl.value);
    const from = `${(fromDate.getFullYear())}-${(fromDate.getMonth() + 1)}-${fromDate.getDate()}`;
    const to = `${(toDate.getFullYear())}-${(toDate.getMonth() + 1)}-${toDate.getDate()}`;
    queryParams.from = from;
    queryParams.to = to;
    queryParams.type = this.reportTypeControl.value;
    if(queryParams.type == 2){
      queryParams.payer = this.selectedPayerControl.value;
    }
    if (this.page > 0) {
      queryParams.page = this.page;
    }
    if (this.pageSize > 10) {
      queryParams.pageSize = this.pageSize;
    }
    this.router.navigate([this.providerId, 'globmed', 'reports'], { queryParams: queryParams });
    this.summarySearchResult.fetchData();
    
  }
  searchSelect(event) {
    this.summarySearchResult.claims = [];
    this.summarySearchResult.searchResult = null;
    if(this.reportTypeControl.value == 2){
      this.selectedPayerControl.setValue(null);
    }
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.resetURL();
  }

  backButton() {
    this.page = this.tempPage;
    this.pageSize = this.tempPageSize;
    this.summarySearchResult.queryPage = this.page;
    this.summarySearchResult.pageSize = this.pageSize;
    // if (this.summarySearchResult.payments.length == 0) this.summarySearchResult.fetchData();
    this.resetURL();
  }

  download() {
    if (this.downloadIcon == "check_circle") return;


  }

  resetURL() {
    const fromDate: Date = new Date(this.fromDateControl.value);
    const toDate: Date = new Date(this.toDateControl.value);
    const from = `${(fromDate.getFullYear())}-${(fromDate.getMonth() + 1)}-${fromDate.getDate()}`;
    const to = `${(toDate.getFullYear())}-${(toDate.getMonth() + 1)}-${toDate.getDate()}`;
    let URL = `${this.providerId}/globmed/reports?from=${from}&to=${to}&type=${this.reportTypeControl.value}`;

    if (this.claimId != null) {
      URL += `&claimId=${this.claimId}`
    }
    if (this.page > 0) {
      URL += `&page=${this.page}`;
    }
    if (this.pageSize > 10) {
      URL += `&pageSize=${this.pageSize}`;
    }
    if (this.criteria != null) {
      URL += `&criteria=${this.criteria}`
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

  get showRejectionReport() {
    return this.reportTypeControl.value == 3;
  }

  get fromDate() {
    let date: Date = new Date(this.fromDateControl.value);
    return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
  }

  get toDate() {
    let date: Date = new Date(this.toDateControl.value);
    return `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
  }

  get height() {
    return `${this.pageSize * 55 + 275}px`;
  }


}