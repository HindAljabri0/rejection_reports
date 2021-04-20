import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ClaimFilesValidationService } from 'src/app/services/claimFilesValidation/claim-files-validation.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';

@Component({
  selector: 'app-bupa-rejection-upload-modal',
  templateUrl: './credit-report-upload-modal.component.html',
  styles: []
})
export class CreditReportUploadModalComponent implements OnInit {
  uploadContainerClass = '';
  currentFileUpload: File;
  error = '';
  priceListDoesNotExistMessages: string[] = [];
  sizeInMB: string;
  constructor(private dialogRef: MatDialogRef<CreditReportUploadModalComponent>, private dialogService: DialogService, private router: Router, public common: SharedServices, private fileValidationService: ClaimFilesValidationService, private creditReportService: CreditReportService, @Inject(MAT_DIALOG_DATA) public data: File) { }
  selectedFiles: FileList;
  ngOnInit() {
    this.currentFileUpload = this.data;
    this.sizeInMB = this.common.formatBytes(this.currentFileUpload.size);
    if (!this.checkfile()) {
      this.currentFileUpload = undefined;
      return;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
  selectFile(event) {
    this.currentFileUpload = event.target.files[0];
    this.sizeInMB = this.common.formatBytes(this.currentFileUpload.size);
    if (!this.checkfile()) {
      event.target.files = [];
      this.currentFileUpload = undefined;
      return;
    }
  }

  checkfile() {
    const validExts = new Array('.pdf');
    let fileExt = this.currentFileUpload.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.showError('Invalid file selected, valid files are of ' +
        validExts.toString() + ' types.');
      return false;
    } else {
      this.uploadContainerClass = '';
      this.error = '';
      return true;
    }
  }
  showError(error: string) {
    this.currentFileUpload = null;
    this.uploadContainerClass = 'has-error';
    this.error = error;
    this.common.loadingChanged.next(false);
  }


  upload() {
    if (this.currentFileUpload === undefined) {
      this.error = "Please upload the one pdf file."
      return;
    }
    this.error = "";
    this.startUpload();
  }

  startUpload() {
    const providerId = this.common.providerId;
    const payerId = 319;
    this.common.loadingChanged.next(true);
    //payerid static
    this.creditReportService.pushFileToStorage(providerId, payerId, this.currentFileUpload).subscribe((res: any) => {
      this.common.loadingChanged.next(true);
      if (res.body !== undefined) {
        this.router.navigate([`/reports/creditReportSummary`], { queryParams: { batchId: res.body.batchId, payerId: res.body.payerId } });
        this.closeDialog();
      }
    }, err => {
      this.common.loadingChanged.next(false);
      this.error = err.error;
      console.log(err);
    });
  }
}