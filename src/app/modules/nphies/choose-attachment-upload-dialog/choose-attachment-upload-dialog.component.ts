import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AttachmentLinkService } from 'src/app/services/attachment-link/attachment-link.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
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
  filteredFolder: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<ChooseAttachmentUploadDialogComponent>,
    private sharedService: SharedServices,
    private attachmentLinkService: AttachmentLinkService,
    private dialogService: DialogService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService
  ) { }

  ngOnInit() {
    this.loadFolders();
    console.log("payer = " + JSON.stringify(this.data.uploadData.payer));
  }

  loadFolders() {
    this.attachmentLinkService.getFoldersName(this.sharedService.providerId).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        this.folders = event.body;
        this.filteredFolder = this.folders;
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
      this.data.uploadData.nationalId, this.data.uploadData.statuses, this.data.uploadData.organizationId, this.data.uploadData.requestBundleId, this.data.uploadData.isRelatedClaim
    ).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          const resModel: any = {};
          resModel.Success = true;
          resModel.queuedStatus = body.queuedStatus;
          resModel.Message = body.message;
          resModel.Errors = body.errors;
          this.dialogRef.close(resModel);
        }
        this.sharedService.loadingChanged.next(false);
      }
    }, error => {
      this.sharedService.loadingChanged.next(false);
      const resModel: any = {};
      resModel.Success = false;
      resModel.Error = error;
      this.dialogRef.close(resModel);
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }

  updateFilter() {
    this.filteredFolder = this.filteredFolder.filter(folder =>
      `${folder != null ? folder.toLowerCase() : folder}`
        .includes(this.folderNameControl.value.toLowerCase()))
    if (this.folderNameControl.value == null || this.folderNameControl.value == "") {

      this.filteredFolder = this.folders;
    }

  }

  selectFolder(folder: string = null) {
    if (folder !== null)
      this.folderName = folder;
    else {
      //const folderName = this.providerController.value.split('|')[0].trim();
      this.filteredFolder = this.folders;
    }
  }
}
