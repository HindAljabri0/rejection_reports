import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddFinalRejectionDialogComponent } from '../add-final-rejection-dialog/add-final-rejection-dialog.component';
import { AddReconciliationDialogComponent } from '../add-reconciliation-dialog/add-reconciliation-dialog.component';
import { ReconciliationReport } from 'src/app/models/reconciliationReport'
import{ ReconciliationService } from 'src/app/services/reconciliationService/reconciliation.service'
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute } from '@angular/router';
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
  selectedDate: Date;
  constructor(
    private dialog: MatDialog,
    private sharedService: SharedServices ,
    private routeActive: ActivatedRoute
    
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
      if (params.startDate != null ) {
        this.search();
      }
    });
  }


search(){

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
