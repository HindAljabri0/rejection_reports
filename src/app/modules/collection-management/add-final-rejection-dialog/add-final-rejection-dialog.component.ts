
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AddFinalRejectionModel } from 'src/app/models/addFinalRejectionModel';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ReconciliationService } from 'src/app/services/reconciliationService/reconciliation.service';
import { SharedServices } from 'src/app/services/shared.services';
@Component({
  selector: 'app-add-final-rejection-dialog',
  templateUrl: './add-final-rejection-dialog.component.html',
  styles: []
})
export class AddFinalRejectionDialogComponent implements OnInit {
  addFinalRejectionModel = new AddFinalRejectionModel();
  status: boolean = false;
  dialogTitle: any;
  value = '';
  selectedReconciliationIdAndTotalDubmitted: any;
  selectedUnitPrecent: FormControl = new FormControl();
  selectedUnitSAR: FormControl = new FormControl();



  constructor(
    private dialogRef: MatDialogRef<AddFinalRejectionDialogComponent>,
    private reconciliationService: ReconciliationService,
    private dialog: MatDialog,
    private sharedService: SharedServices,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data

  ) { }





  ngOnInit() {
    this.addFinalRejectionModel.reconciliationId = this.data.id
  }


  closeDialog(status = false) {
    this.status = status;
    this.dialogRef.close();
  }
  submit() {
    const body: AddFinalRejectionModel = {
      reconciliationId: this.data.id,
      finalRejectionAmount: this.value
    }

    this.sharedService.loadingChanged.next(true);
    this.reconciliationService.addFinalRejection(
      this.sharedService.providerId, body
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.dialogService.openMessageDialog(new MessageDialogData('', 'Your data has been saved successfully', false));
          this.status = true;
          let finalRejectionAmountPerc = '0%';

          if (this.addFinalRejectionModel.finalRejectionAmount != '0%' && finalRejectionAmountPerc == '0%') {
            this.selectedUnitSAR.value == "SAR"
            // finalRejectionAmountPerc = (this.addFinalRejectionModel.finalRejectionAmount * this.selectedReconciliationIdAndTotalDubmitted.totalSubmitted) / 100;

            this.addFinalRejectionModel = event.body as AddFinalRejectionModel;
          }
          else
            if (this.selectedUnitSAR.value !== 0) {
              this.selectedUnitSAR.value =='SAR'
              this.addFinalRejectionModel = event.body as AddFinalRejectionModel;
            }

            else
            if (this.selectedUnitPrecent.value !== '0%') {
              this.selectedUnitPrecent.value =='PERCENT'
              finalRejectionAmountPerc.replace('%', '');
              this.addFinalRejectionModel = event.body as AddFinalRejectionModel;
            }

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
