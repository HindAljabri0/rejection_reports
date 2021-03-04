import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BupaRejectionReportModel } from 'src/app/models/bupaRejectionReport';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bupa-rejection-confirm-dialog',
  templateUrl: './bupa-rejection-confirm-dialog.component.html',
  styles: []
})
export class BupaRejectionConfirmDialogComponent implements OnInit {
  dialogData: BupaRejectionReportModel;
  get providerId(): string {
    return this.sharedService.providerId;
  }

  constructor(private dialogRef: MatDialogRef<BupaRejectionConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: BupaRejectionReportModel, private reportService: ReportsService, private sharedService: SharedServices, private dialogService: DialogService, private router: Router) {
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
