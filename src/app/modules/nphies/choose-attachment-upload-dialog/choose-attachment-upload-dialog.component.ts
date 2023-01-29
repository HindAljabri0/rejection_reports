import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AttachmentLinkService } from 'src/app/services/attachment-link/attachment-link.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-choose-attachment-upload-dialog',
  templateUrl: './choose-attachment-upload-dialog.component.html',
  styles: []
})
export class ChooseAttachmentUploadDialogComponent implements OnInit {
  folders = [];
  folderNameControl: FormControl = new FormControl();
  folderNamerror = '';
  folderName: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ChooseAttachmentUploadDialogComponent>,
    private sharedService: SharedServices,
    private attachmentLinkService: AttachmentLinkService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private providerNphiesApprovalService: ProviderNphiesApprovalService
  ) { }

  ngOnInit() {
    this.loadFolders();
  }
  loadFolders() {
    this.attachmentLinkService.getFoldersName(this.sharedService.providerId).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        this.folders = event.body;
        this.sharedService.loadingChanged.next(false);
      }
    }, err => {
      this.sharedService.loadingChanged.next(false);
      console.log(err);
    });
  }

  StartJob(isReplace: boolean) {

    console.log("this.folderName = " + this.folderName);

    if (this.folderName == null || this.folderName == '') {
      this.folderNamerror = "Select at least one purpose for this request."
      return false;
    }

    this.sharedService.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesApprovalService.LinkAttachments(
      this.sharedService.providerId, this.folderName, isReplace,
      this.data.uploadData.selectedClaims, this.data.uploadData.uploadId, this.data.uploadData.claimRefNo, this.data.uploadData.to,
      this.data.uploadData.payerIds, this.data.uploadData.batchId, this.data.uploadData.memberId, this.data.uploadData.invoiceNo,
      this.data.uploadData.patientFileNo, this.data.uploadData.from, this.data.uploadData.claimTypes, this.data.uploadData.netAmount, 
      this.data.uploadData.nationalId, this.data.uploadData.statuses,this.data.uploadData.organizationId, this.data.uploadData.requestBundleId
    ).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          this.dialogService.showMessage('Success:', body.message, 'success', true, 'OK');
        }
        this.sharedService.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
          } else {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
          }
        } else if (error.status === 404) {
          this.dialogService.showMessage('Error', error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.dialogService.showMessage('Error',  error.error, 'alert', true, 'OK');
        }
        this.sharedService.loadingChanged.next(false);
      }
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }

}
