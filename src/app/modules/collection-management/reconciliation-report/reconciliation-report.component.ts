import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { AddFinalRejectionDialogComponent } from '../add-final-rejection-dialog/add-final-rejection-dialog.component';
import { AddReconciliationDialogComponent } from '../add-reconciliation-dialog/add-reconciliation-dialog.component';
import { ReconciliationReport } from 'src/app/models/reconciliationReport'
import { ReconciliationReportResponse } from 'src/app/models/reconciliationReportResponse'
import{ ReconciliationService } from 'src/app/services/reconciliationService/reconciliation.service'
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-reconciliation-report',
  templateUrl: './reconciliation-report.component.html',
  styles: []
})
export class ReconciliationReportComponent implements OnInit {
  reconciliationReport : ReconciliationReport =new ReconciliationReport();
  selectedPayerId = 'All';
  payersList: { id: number, name: string, arName: string }[] = [];
  selectedPayerName = 'All';
  strPayerYear: string;
  selectedDate: Date;
  ReconciliationReportResponse :any[];

  constructor(
    private reconciliationService:ReconciliationService,
    private dialog: MatDialog,
    private sharedService: SharedServices ,
    private routeActive: ActivatedRoute,
    private location: Location
    
    ) { }

  ngOnInit() {
    this.payersList = this.sharedService.getPayersList();
    this.routeActive.queryParams.subscribe(params => {
      if (params.payerId != null) {
        this.reconciliationReport.payerId = params.payerId;
      }
      if (params.startDate != null) {
        this.reconciliationReport.startDate = params.startDate;
      }
      if (params.endDate != null) {
        this.reconciliationReport.endDate = params.endDate;
      }
      if (params.page != null) {
        this.reconciliationReport.page = params.page;
      }
      if (params.size != null) {
        this.reconciliationReport.size = params.size;
      }
        this.search();
      
    });
  }


search(){
if(this.reconciliationReport.startDate==null || this.reconciliationReport.startDate==undefined )
return
const body: ReconciliationReport = {
  startDate: moment(this.reconciliationReport.startDate).format('dd-MM-yyyy'),
  endDate : moment(this.reconciliationReport.endDate).format('dd-MM-yyyy'),
  page: this.reconciliationReport.page,
  size: this.reconciliationReport.size,
  totalPages: this.reconciliationReport.totalPages,
  payerId: this.reconciliationReport.payerId,
};
this.sharedService.loadingChanged.next(true);
this.reconciliationService.getReconciliationBtsearch(
  this.sharedService.providerId,body
).subscribe(event =>{
if(event instanceof HttpResponse){
  if(event.status===200){
    const body = event['body'];
    const data = JSON.parse(body);
  this.ReconciliationReportResponse=data.content;
  this.reconciliationReport.totalPages=data.totalPages;

  }

  else{
    this.ReconciliationReportResponse=[];
  }
  this.sharedService.loadingChanged.next(false);
}
}, err => {
this.sharedService.loadingChanged.next(false);
this.ReconciliationReportResponse = [];
console.log(err);

});
}
  openAddReconciliationDialog() {
    const dialogRef = this.dialog.open(AddReconciliationDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg'],
      autoFocus: false
    })
  }

  openFinalRejectionDialog() {
    const dialogRef = this.dialog.open(AddFinalRejectionDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-sm'],
      autoFocus: false
    })
  }

}
