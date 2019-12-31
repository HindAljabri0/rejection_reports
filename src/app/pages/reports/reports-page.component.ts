import { QuerytoReport } from './../../models/searchData/querytoReports';
import { QueryReport } from './../../models/searchData/queryReport';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Query } from 'src/app/models/searchData/query';
import { MatMenuTrigger } from '@angular/material';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';

import { CommenServicesService } from 'src/app/services/commen-services.service';
import { QueryType } from 'src/app/models/searchData/queryType';


@Component({
    selector: 'app-reports-page',
    templateUrl: './reports-page.component.html',
    styleUrls: ['./reports-page.component.css']
  })
  export class ReportsComponent implements OnInit {

    payers: { id: number, name: string }[];
    queries: QuerytoReport[] = [];

    @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;

    searchControl: FormControl = new FormControl();

    fromDateControl: FormControl = new FormControl();
    fromDateHasError: boolean = false;
    toDateControl: FormControl = new FormControl();
    toDateHasError: boolean = false;
    payerIdControl: FormControl = new FormControl();
    payerIdHasError: boolean = false;

    fromDate:QueryReport = QueryReport.DATEFROM;
    toDate:QueryReport = QueryReport.DATETO;
    payerId:QueryReport = QueryReport.PAYERID;
    batchId:QueryReport = QueryReport.BATCHID;
    report:QueryReport = QueryReport.REPORT;
    addOnBlur = true;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    constructor(private router: Router, private commen: CommenServicesService) { }

    queryToText(querytoreport: QuerytoReport) {
        switch (querytoreport.typeReport) {
          case QueryReport.PAYERID:
            return this.payers.find(value => `${value.id}` == querytoreport.content).name
          case QueryReport.DATEFROM:
          case QueryReport.DATETO:
            return querytoreport.content.replace('-', '/').replace('-', '/');
          default:
            return querytoreport.content;
        }
      }
    

    search() {
        this.fromDateHasError = false;
        this.toDateHasError = false;
        this.payerIdHasError = false;
        if (this.queries.map(value => value.typeReport == QueryReport.DATEFROM || value.typeReport == QueryReport.DATETO || value.typeReport == QueryReport.PAYERID).includes(true)) {
          if (this.fromDateControl.invalid || this.fromDateControl.value == null) {
            this.trigger.openMenu();
            this.fromDateHasError = true;
          } else if (this.toDateControl.invalid || this.toDateControl.value == null) {
            this.trigger.openMenu();
            this.toDateHasError = true;
          } else if (this.payerIdControl.invalid || this.payerIdControl.value == null) {
            this.trigger.openMenu();
            this.payerIdHasError = true;
          } else {
            let fromDate = new Date(this.fromDateControl.value);
            let toDate = new Date(this.toDateControl.value);
            const from = fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-' + fromDate.getDate();
            const to = toDate.getFullYear() + '-' + (toDate.getMonth() + 1) + '-' + toDate.getDate();
            const payer = this.payerIdControl.value;
            this.router.navigate([this.commen.providerId, 'claims'], { queryParams: { from: from, to: to, payer: payer} });
          }
        } else if (this.queries.length == 1 && this.queries.map(value => value.typeReport == QueryReport.BATCHID).includes(true)) {
          let batchId = this.queries.find(querytoreport => querytoreport.typeReport == QueryReport.BATCHID).content;
          this.router.navigate([this.commen.providerId, 'claims'], { queryParams: { batchId:batchId } });
        } else {
          this.trigger.openMenu();
        }
      }

    
    updateChips(queryReport: QueryReport, content: string) {
        content = `${content}`;
        if (content != null && content.trim().length != 0) {
          let querytoReport: QuerytoReport = this.queries.find(querytoReport => querytoReport.typeReport == queryReport);
          if (querytoReport != null){
              querytoReport.content = content.trim();
          } 
        }
    }
     


    ngOnInit() {
        this.payers = [
            { id: 102, name: "Tawuniya" },
            { id: 300, name: "MDG" },
            { id: 306, name: "SE" },
            { id: 204, name: "AXA" },
          ];
    }
  }