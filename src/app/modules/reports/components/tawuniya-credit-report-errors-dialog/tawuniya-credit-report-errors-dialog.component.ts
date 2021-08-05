import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreditReportUploadModel } from 'src/app/models/creditReportUpload';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { SharedServices } from 'src/app/services/shared.services';
import { TwaniyaErrorDescription } from 'src/app/claim-module-components/models/twaniyaErrorDescription.model';



@Component({
  selector: 'app-tawuniya-credit-report-errors-dialog',
  templateUrl: './tawuniya-credit-report-errors-dialog.component.html',
  styles: []
})
export class TawuniyaCreditReportErrorsDialogComponent implements OnInit {
  errorDetails: TwaniyaErrorDescription = new TwaniyaErrorDescription();

  constructor(
    private dialogRef: MatDialogRef<TawuniyaCreditReportErrorsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreditReportUploadModel,
    private _creditReportService: CreditReportService,
    private _common: SharedServices) {
    this.errorDetails.pageNo = 0;
    this.errorDetails.pageSize = 10;
    this.errorDetails.totalPages = 0;
  }

  ngOnInit() {
    this.getErrorDescriptionData();
  }
  getErrorDescriptionData() {
    this._common.loadingChanged.next(true);
    this._creditReportService.showsTwaniyaReportsError(
      this._common.providerId,
      this.data.batchId,
      this.errorDetails.pageNo,
      this.errorDetails.pageSize
    ).subscribe((res: any) => {
      if (res.body !== undefined) {
        this.errorDetails.data = res.body.content;
        if (res.body.content.length == 0) {
          this.errorDetails.totalPages = 0;
        } else {
          this.errorDetails.totalPages = res.body.totalPages;
        }
      }
      this._common.loadingChanged.next(false);
    }, err => {
      this._common.loadingChanged.next(false);
      console.log(err);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  goToFirstPage() {
    if (this.errorDetails.pageNo != 0) {
      this.errorDetails.pageNo = 0;
      this.getErrorDescriptionData();
    }
  }
  goToPrePage() {
    if (this.errorDetails.pageNo != 0) {
      this.errorDetails.pageNo = this.errorDetails.pageNo - 1;
      this.getErrorDescriptionData();
    }
  }
  goToNextPage() {
    if ((this.errorDetails.pageNo + 1) < this.errorDetails.totalPages) {
      this.errorDetails.pageNo = this.errorDetails.pageNo + 1;
      this.getErrorDescriptionData();
    }
  }
  goToLastPage() {
    if (this.errorDetails.pageNo != (this.errorDetails.totalPages - 1)) {
      this.errorDetails.pageNo = this.errorDetails.totalPages - 1;
      this.getErrorDescriptionData();

    }
  }

}
