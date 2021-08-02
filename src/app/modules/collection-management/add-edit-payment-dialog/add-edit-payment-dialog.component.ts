import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';

import { ReportsService } from 'src/app/services/reportsService/reports.service';
import * as moment from 'moment';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { AddPayerStatmentModel } from 'src/app/models/payerStatmentModel';
import { statSync } from 'fs';

@Component({
  selector: 'app-add-edit-payment-dialog',
  templateUrl: './add-edit-payment-dialog.component.html',
  styles: []
})
export class AddEditPaymentDialogComponent implements OnInit {
  payersList: { id: number, name: string, arName: string }[] = [];
  status: boolean = false;
  payerStatmentModel = new AddPayerStatmentModel();
  constructor(private dialogRef: MatDialogRef<AddEditPaymentDialogComponent>, private sharedService: SharedServices, private _reportService: ReportsService, private dialogService: DialogService, @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit() {
    this.payersList = this.sharedService.getPayersList();
    this.payerStatmentModel.statementId = this.data.statementId;
    this.status = false;
  }

  closeDialog(status = false) {
    this.status = status;
    this.dialogRef.close();
  }

  submit() {
    this.sharedService.loadingChanged.next(true);
    let body = this.payerStatmentModel;
    body.paymentDate = moment(this.payerStatmentModel.paymentDate).format('YYYY-MM-DD');
    this._reportService.addPayementSOAData(
      this.sharedService.providerId,
      body
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.dialogService.openMessageDialog(new MessageDialogData('', 'Your data has been saved successfully', false));
          this.status = true;
          this.closeDialog(true);
          this.sharedService.loadingChanged.next(false);
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.sharedService.loadingChanged.next(false);
        this.dialogService.openMessageDialog(new MessageDialogData('', err.error, true));
        this.status = false;
      }
    });
  }

}

