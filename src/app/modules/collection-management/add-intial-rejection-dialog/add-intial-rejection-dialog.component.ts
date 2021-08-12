import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CollectionManagementService } from 'src/app/services/collection-management/collection-management.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AddInitialRejectionModel } from 'src/app/models/addIntitalRejectionModel';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-intial-rejection-dialog',
  templateUrl: './add-intial-rejection-dialog.component.html',
  styles: []
})
export class AddIntialRejectionDialogComponent implements OnInit {
  intitalRejectionModel = new AddInitialRejectionModel();
  status: boolean = false;
  dialogTitle: any;
  constructor(private dialogRef: MatDialogRef<AddIntialRejectionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private collectionManagementService: CollectionManagementService, private sharedService: SharedServices, private dialogService: DialogService) { }

  ngOnInit() {
    this.status = false;
    const rejectionData = this.data.selectedPayerDataAndDate.item;
    if (rejectionData.initRejectionAmount !== null && rejectionData.initRejectionAmount === 0 && rejectionData.
      initRejectionPerc !== null && rejectionData.
        initRejectionPerc === '0%')
      this.dialogTitle = 'Add';
    else {
      if (rejectionData.initRejectionPerc !== '0%' && rejectionData.initRejectionAmount !== 0 && rejectionData.initRejectionPerc !== null && rejectionData.initRejectionAmount !== null) {
        this.intitalRejectionModel.amount = rejectionData.initRejectionAmount;
        this.intitalRejectionModel.unitOfAmount = 'SAR';
      }
      else {
        if (rejectionData.initRejectionAmount !== 0 && rejectionData.initRejectionAmount !== null) {
          this.intitalRejectionModel.amount = rejectionData.initRejectionAmount;
          this.intitalRejectionModel.unitOfAmount = 'SAR';
        }
        if (rejectionData.initRejectionPerc !== '0%' && rejectionData.initRejectionPerc !== null) {
          this.intitalRejectionModel.unitOfAmount = 'PERCENT';
          this.intitalRejectionModel.amount = rejectionData.initRejectionPerc.replace('%', '');
        }
      }
      this.dialogTitle = 'Edit';
    }

  }

  closeDialog(status = false) {
    this.status = status;
    this.dialogRef.close();
  }

  submit() {
    const body: AddInitialRejectionModel = {
      payerId: this.data.payerId,
      rejectionDate: moment(this.data.
        rejectionDate).format('YYYY-MM-DD'),
      amount: this.intitalRejectionModel.amount,
      unitOfAmount: this.intitalRejectionModel.unitOfAmount
    }
    this.sharedService.loadingChanged.next(true);
    this.collectionManagementService.addIntitalRejection(
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
