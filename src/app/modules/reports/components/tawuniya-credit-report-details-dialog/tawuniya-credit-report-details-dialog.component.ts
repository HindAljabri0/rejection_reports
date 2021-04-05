import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-tawuniya-credit-report-details-dialog',
  templateUrl: './tawuniya-credit-report-details-dialog.component.html',
  styles: []
})
export class TawuniyaCreditReportDetailsDialogComponent implements OnInit {

  dialogData;
  title;
  creditReportDetails;

  constructor(
    public dialogRef: MatDialogRef<TawuniyaCreditReportDetailsDialogComponent>,
    private creditReportService: CreditReportService,
    private sharedServices: SharedServices,
    @Inject(MAT_DIALOG_DATA) data
  ) { this.dialogData = data }

  ngOnInit() {
    this.title = this.dialogData.serviceType == 'deducted' ? 'Deducted' : 'Rejected';
    this.creditReportService.getTawuniyaCreditReportDetail(this.sharedServices.providerId, this.dialogData.batchReferenceNumber,
      this.dialogData.serialNo, this.dialogData.serviceType).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.body !== undefined) {
            this.creditReportDetails = event.body;
            this.fixDataDates();
          }
        }
      }, errorEvent => {
        this.creditReportDetails = null;
        if (errorEvent instanceof HttpErrorResponse) {
          console.log(errorEvent.error);
        }
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  fixDataDates() {
    this.creditReportDetails.visitDate = this.stringToDate(this.creditReportDetails.visitDate);
    this.creditReportDetails.invoiceDate = this.stringToDate(this.creditReportDetails.invoiceDate);
  }

  stringToDate(date: any) {
    if (date != null) {
      try {
        return new Date(date).toLocaleDateString();
      } catch (e) {

      }
    }
    return date;
  }
}
