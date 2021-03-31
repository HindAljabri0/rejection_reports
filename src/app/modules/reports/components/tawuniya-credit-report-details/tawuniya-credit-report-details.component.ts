import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CreditReportSummaryResponse } from 'src/app/models/tawuniyaCreditReportModels/creditReportSummaryResponse';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { SharedServices } from 'src/app/services/shared.services';
import { TawuniyaCreditReportDetailsDialogComponent } from '../tawuniya-credit-report-details-dialog/tawuniya-credit-report-details-dialog.component';

@Component({
  selector: 'app-tawuniya-credit-report-details',
  templateUrl: './tawuniya-credit-report-details.component.html',
  styles: []
})
export class TawuniyaCreditReportDetailsComponent implements OnInit {

  batchId: string;

  data: CreditReportSummaryResponse;

  constructor(
    private dialog: MatDialog,
    private routeActive: ActivatedRoute,
    private creditReportService: CreditReportService,
    private sharedServices: SharedServices,
  ) { }

  ngOnInit() {
    this.routeActive.params.subscribe(value => {
      this.batchId = value.batchId;
      this.fetchData();
    }).unsubscribe();
  }


  fetchData() {
    if (this.sharedServices.loading) return;

    this.sharedServices.loadingChanged.next(true);
    this.creditReportService.getTawuniyaCreditReport(this.sharedServices.providerId, this.batchId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.data = event.body as CreditReportSummaryResponse;
        this.fixDataDates();
        this.sharedServices.loadingChanged.next(false);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        console.log(errorEvent.error);
      }

      this.sharedServices.loadingChanged.next(false);
    })
  }

  openDetailsDialog(event, serialNo, serviceType: 'rejected' | 'deducted') {
    event.preventDefault();
    const dialogRef = this.dialog.open(TawuniyaCreditReportDetailsDialogComponent, { panelClass: ['primary-dialog', 'dialog-md'] });
  }

  fixDataDates(){
    this.data.providercreditReportInformation.receiveddate = this.stringToDate(this.data.providercreditReportInformation.receiveddate);
    this.data.providercreditReportInformation.batchreceiveddate = this.stringToDate(this.data.providercreditReportInformation.batchreceiveddate);
    this.data.providercreditReportInformation.lossmonth = this.stringToDate(this.data.providercreditReportInformation.lossmonth);
  }

  stringToDate(date:any){
    if(date != null){
      try{
        return new Date(date);
      } catch (e){
        
      }
    }
    return date;
  }

  isDate(object:any){
    return object != null && object instanceof Date;
  }

}
