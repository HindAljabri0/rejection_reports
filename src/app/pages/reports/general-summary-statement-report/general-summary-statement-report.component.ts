import { I } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {  Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { GssReportResponseModel } from 'src/app/models/gssReportResponseModel';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { SearchService } from 'src/app/services/serchService/search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-general-summary-statement-report',
  templateUrl: './general-summary-statement-report.component.html',
  styles:[]
})
export class GeneralSummaryStatementReportComponent implements OnInit {
  detailTopActionIcon = 'ic-download.svg';
  payers: { id: string, name: string }[]=[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  paginatorPagesNumbers: number[]=[];
  page: number=0;
  pageSize: number=10;
  submitted=false;
  paginatorLength1=0;
  payerId='';
  fromDate = new FormControl();
  toDate=new FormControl();
  errorMessage: string;
  lastDownloadSubscriptions: Subscription;
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  gssReportResponseModel:GssReportResponseModel[];
  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' };
  manualPage = 0;
  minDate: any;
  constructor(  private downloadService: DownloadService,public datepipe: DatePipe,public commen: SharedServices,public searchService:SearchService) { }

  ngOnInit() {

    //this.payers = [];
  
    this.commen.getPayersList().map(value => {
      this.payers.push({
        id: `${value.id}`,
        name: value.name
      });
     
    });
   
  }

  search() {
    this.submitted=true;
    if((this.fromDate.value==null || this.fromDate.value=='')||(this.toDate.value==null || this.toDate.value=='')||
    (this.payerId==null || this.payerId=='')){
     return 
    }
    this.errorMessage =null;
    this.commen.loadingChanged.next(true);
    this.gssReportResponseModel=[];
    let fromDate =this.datepipe.transform(this.fromDate.value, 'dd-MM-yyyy');
    let toDate = this.datepipe.transform(this.toDate.value, 'dd-MM-yyyy');;
    this.searchService.getGssData(this.commen.providerId,this.payerId,fromDate,toDate, this.page, this.pageSize).subscribe((data:any)=>{
      if (data instanceof HttpResponse) {
        this.gssReportResponseModel=data.body["content"] as GssReportResponseModel[];
        this.paginatorLength1=data.body["totalElements"];
        this.manualPage =data.body["number"];
        const pages = Math.ceil((this.paginatorLength1 / this.paginator.pageSize));
          this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
          if (this.gssReportResponseModel.length == 0) {
            this.errorMessage = 'No Results Found';
          }
          this.commen.loadingChanged.next(false);
        
    }}, error => {
      if (error instanceof HttpErrorResponse) {
        if ((error.status / 100).toFixed() == '4') {
          this.errorMessage = 'Access Denied.';
        } else if ((error.status / 100).toFixed() == '5') {
          this.errorMessage = 'Server could not handle the request. Please try again later.';
        } else {
          this.errorMessage = 'Somthing went wrong.';
        }
     
          this.commen.loadingChanged.next(false);
     }});
    
    }

    dateValidation(event: any) {
      if (event !== null) {
        const startDate = moment(event).format('YYYY-MM-DD');
        const endDate = moment(this.toDate.value).format('YYYY-MM-DD');
        if (startDate > endDate) {
          this.toDate.value.patchValue('');
        }
      }
      this.minDate = new Date(event);
  
    }
    paginationChange(event) {
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
      // this.resetURL();
      this.search();
    }
    get paginatorLength() {
      if (this.gssReportResponseModel != null) {
        return this.paginatorLength1;
      } else {
        return 0;
      }
    }
    paginatorAction(event) {
      this.manualPage = event['pageIndex'];
      this.paginationChange(event);
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
      this.search();
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

    download() {
      if (this.detailTopActionIcon == 'ic-check-circle.svg') {
        return;
      }
      let fromDate =this.datepipe.transform(this.fromDate.value, 'dd-MM-yyyy');
    let toDate = this.datepipe.transform(this.toDate.value, 'dd-MM-yyyy');;
    
      this.lastDownloadSubscriptions = this.downloadService
        .startDownload(this.searchService.downloadGssReport(
            this.commen.providerId,
            this.payerId,
            fromDate,
            toDate
          ))
        .subscribe(status => {
          if (status != DownloadStatus.ERROR) {
            this.detailTopActionIcon = 'ic-check-circle.svg';
          } else {
            this.detailTopActionIcon = 'ic-download.svg';
          }
        });
    }
}
