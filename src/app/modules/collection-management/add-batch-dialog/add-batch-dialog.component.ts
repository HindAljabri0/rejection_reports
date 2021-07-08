import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { HttpResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';

@Component({
  selector: 'app-add-batch-dialog',
  templateUrl: './add-batch-dialog.component.html',
  styles: []
})
export class AddBatchDialogComponent implements OnInit {
  batchRefNumber: string = '';

  constructor(private dialogRef: MatDialogRef<AddBatchDialogComponent>, private claimService: ClaimService, private dialogService: DialogService, private sharedService: SharedServices, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.getBatchStatus();
  }

  getBatchStatus() {
    let data = {};
    if (this.data.batchSelected)
      data = {
        claimid: this.data.selectedBatchData
      };
    else
      data = {
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        payerId: this.data.payerId,
      };

    this.sharedService.loadingChanged.next(true);
    this.claimService.batchClaimNumber(this.sharedService.providerId, data).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        this.batchRefNumber = event.body;
      }
      this.sharedService.loadingChanged.next(false);
    }, err => {
      this.sharedService.loadingChanged.next(false);
      this.dialogService.openMessageDialog(new MessageDialogData('', err.message, true));
      console.log(err);
    });

  }


  closeDialog() {
    this.dialogRef.close();
  }

}
