import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CreditReportQueryModel } from 'src/app/models/creditReportQuery';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bupa-rejection-confirm-dialog',
  templateUrl: './credit-report-create-confirm-dialog.component.html',
  styles: []
})
export class CreditReportCreateConfirmDialogComponent implements OnInit {
  dialogData: CreditReportQueryModel;
  get providerId(): string {
    return this.sharedService.providerId;
  }

  constructor(private dialogRef: MatDialogRef<CreditReportCreateConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: CreditReportQueryModel, private reportService: ReportsService, private sharedService: SharedServices, private dialogService: DialogService, private router: Router) {
    this.dialogData = this.data;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  save() {
    this.reportService.saveBupaRejectionReport(this.providerId, this.dialogData).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.dialogRef.close(true);
          setTimeout(() => {
            this.dialogService.openMessageDialog(new MessageDialogData('', event.body.toString(), false)).subscribe(res => {
              // this.router.navigateByUrl('');
            });
          }, 1000)
        } else {
          this.dialogService.openMessageDialog(new MessageDialogData('', event.body.toString(), false));
        }
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog(new MessageDialogData('', errorEvent.error, true));
      }
    });
  }
}
