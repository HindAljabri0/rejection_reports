import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SharedServices } from 'src/app/services/shared.services';
import { DomSanitizer } from '@angular/platform-browser';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';

@Component({
  selector: 'app-tawuniya-credit-report-details-dialog',
  templateUrl: './tawuniya-credit-report-details-dialog.component.html',
  styles: []
})
export class TawuniyaCreditReportDetailsDialogComponent implements OnInit {

  dialogData;
  title;
  creditReportDetails;
  isLoading: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TawuniyaCreditReportDetailsDialogComponent>,
    private creditReportService: CreditReportService,
    private sharedServices: SharedServices,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data
  ) { this.dialogData = data }

  ngOnInit() {
    this.isLoading = true;
    this.title = this.dialogData.serviceType == 'deducted' ? 'Deducted' : 'Rejected';
    this.creditReportService.getTawuniyaCreditReportDetail(this.sharedServices.providerId, this.dialogData.batchReferenceNumber,
      this.dialogData.serialNo, this.dialogData.serviceType).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.body !== undefined) {
            this.creditReportDetails = event.body;
            this.fixDataDates();
          }
          this.isLoading = false;
        }
      }, errorEvent => {
        this.creditReportDetails = null;
        if (errorEvent instanceof HttpErrorResponse) {
          console.log(errorEvent.error);
        }
        this.isLoading = false;
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

  isPdf() {
    const fileExt = this.creditReportDetails.attachmentName.split('.').pop();
    return fileExt.toLowerCase() == 'pdf';
  }

  getImageOfBlob() {
    const fileExt = this.creditReportDetails.attachmentName.split('.').pop();
    if (fileExt.toLowerCase() == 'pdf') {
      const objectURL = `data:application/pdf;base64,` + this.creditReportDetails.attachment;
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    } else {
      const objectURL = `data:image/${fileExt};base64,` + this.creditReportDetails.attachment;
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }

  }

  viewAttachment() {
    this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
      data: { filename: this.creditReportDetails.attachmentName, attachment: this.creditReportDetails.attachment }, panelClass: ['primary-dialog', 'dialog-xl']
    })
  }
}
