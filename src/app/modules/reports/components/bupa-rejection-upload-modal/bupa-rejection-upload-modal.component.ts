import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { Router } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { ClaimFilesValidationService } from 'src/app/services/claimFilesValidation/claim-files-validation.service';
import * as XLSX from 'xlsx';
import { UploadRejectionFileService } from 'src/app/services/uploadRejectionFileService/uploadRejectionFile.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
type AOA = any[][];
@Component({
  selector: 'app-bupa-rejection-upload-modal',
  templateUrl: './bupa-rejection-upload-modal.component.html',
  styleUrls: ['./bupa-rejection-upload-modal.component.css']
})
export class BupaRejectionUploadModalComponent implements OnInit {
  uploadContainerClass = '';
  currentFileUpload: File;
  error = '';
  uploading = false;
  priceListDoesNotExistMessages: string[] = [];
  constructor(private dialogRef: MatDialogRef<BupaRejectionUploadModalComponent>, private dialogService: DialogService, private router: Router, public common: SharedServices, private fileValidationService: ClaimFilesValidationService, private _uploadRejectionFileService: UploadRejectionFileService) { }
  selectedFiles: FileList;
  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  selectFile(event) {
    this.currentFileUpload = event.target.files[0];
    if (!this.checkfile()) {
      event.target.files = [];
      this.currentFileUpload = undefined;
      return;
    }
    // this.readFile();
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
  readFile() {
    if (this.common.loading || this.uploading || this.currentFileUpload == undefined) {
      return;
    }
    this.common.loadingChanged.next(true);
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      // let validationResult: string;
      // try {
      //   validationResult = this.fileValidationService.validateHeaders(wb);
      // } catch (error) {
      //   this.showError(error);
      // }
      // if (validationResult.length == 0) {
      /* grab first sheet */
      // let ws: XLSX.WorkSheet;
      // if (wb.Sheets.hasOwnProperty('GenInfo')) {
      //   ws = wb.Sheets['GenInfo'];
      // } else {
      //   ws = wb.Sheets[wb.SheetNames[0]];
      // }

      /* save data */
      //     const data = <AOA>(XLSX.utils.sheet_to_json(ws));
      //     if (data.length > 0 && data[0].hasOwnProperty('PAYERID')) {
      //       data.map(row => this.payerIdsFromCurrentFile.push(row['PAYERID']));
      //       this.payerIdsFromCurrentFile = this.payerIdsFromCurrentFile.filter(this.onlyUnique);
      //       this.checkServiceCodeRestriction();
      //     } else {
      //       this.showError(`Invalid file selected! It doesn't have 'PAYERID' column\n`);
      //     }
      //   // } else {
      //   //   this.showError(`Invalid file selected!\n${validationResult}\n\n`);
      //   // }
      // };
      reader.readAsBinaryString(this.currentFileUpload);
    }

  }

  upload() {
    this.startUpload();
  }

  startUpload() {
    this.router.navigateByUrl(`/reports/upload-rejection-report-summary/${0}`);
    this.closeDialog();
    const providerId = this.common.providerId;
    this.uploading = true;
    this._uploadRejectionFileService.pushFileToStorage(providerId, this.currentFileUpload);
    const progressObservable = this._uploadRejectionFileService.progressChange.subscribe(progress => {
      if (progress.percentage == 100) {
        progressObservable.unsubscribe();
      }
    });
    const summaryObservable = this._uploadRejectionFileService.summaryChange.subscribe(async value => {
      summaryObservable.unsubscribe();
      this.uploading = false;
      this.cancel();
      // this.closeDialog();
      // this.router.navigateByUrl(`/reports/upload-rejection-report-summary/${value}`);
    });
    const errorobservable = this._uploadRejectionFileService.errorChange.subscribe(error => {
      this.dialogService.openMessageDialog(new MessageDialogData("", error, true));
      errorobservable.unsubscribe();
      this.uploading = false;
      this.cancel();
    });
  }

  cancel() {
    if (this.common.loading || this.uploading) {
      return;
    }
    this.currentFileUpload = null;
    this.selectedFiles = null;
    this.priceListDoesNotExistMessages = [];
  }
}