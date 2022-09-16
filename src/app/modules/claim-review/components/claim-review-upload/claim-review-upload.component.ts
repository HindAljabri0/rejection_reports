import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { ClaimFilesValidationService } from 'src/app/services/claimFilesValidation/claim-files-validation.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';
import * as XLSX from 'xlsx';
import { ClaimReviewService } from '../../services/claim-review-service/claim-review.service';

type AOA = any[][];

@Component({
  selector: 'app-claim-review-upload',
  templateUrl: './claim-review-upload.component.html',
  styles: []
})
export class ClaimReviewUploadComponent implements OnInit {

  uploading = false;
  currentFileUpload: File;
  selectedFiles: FileList;
  payerIdsFromCurrentFile: string[] = [];
  serviceCodeValidationDisabledMessages: string[] = [];
  priceListDoesNotExistMessages: string[] = [];
  uploadContainerClass = '';
  error = '';
  today: Date = new Date();

  constructor(
    public common: SharedServices,
    private dialogService: DialogService,
    public claimReviewService: ClaimReviewService,
    private fileValidationService: ClaimFilesValidationService,
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  get loading() {
    return this.common.loading;
  }

  upload() {
    if (this.common.loading || this.uploading) {
      return;
    }
    this.startUpload();
  }

  startUpload() {
    const providerId = this.common.providerId;
    this.uploading = true;
    this.claimReviewService.pushFileToStorage(providerId, this.currentFileUpload);
    const progressObservable = this.claimReviewService.progressChange.subscribe(progress => {
      console.log("progressChange: ", progress);
      if (progress.percentage == 100) {
        progressObservable.unsubscribe();
      }
    });
    const summaryObservable = this.claimReviewService.summaryChange.subscribe(async value => {
      console.log("summaryChange: " + value);
      this.dialogService.openMessageDialog(new MessageDialogData("Success", value, false)).subscribe(value => {
        this.router.navigateByUrl('/review/scrubbing/admin');
      });
      summaryObservable.unsubscribe();
      this.uploading = false;
      this.cancel();
    });
    const errorobservable = this.claimReviewService.errorChange.subscribe(error => {
      console.log("errorChange: " + error);
      if(error){
        this.dialogService.openMessageDialog(new MessageDialogData("Error", error, true));
      }
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

  selectFile(event) {
    this.currentFileUpload = event.item(0);
    if (!this.checkfile()) {
      this.currentFileUpload = undefined;
    }
    this.readFile();
  }

  checkfile() {
    const validExts = new Array('.xlsx');
    let fileExt = this.currentFileUpload && this.currentFileUpload.name ? this.currentFileUpload.name : "";
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
      let validationResult: string;
      try {
        validationResult = this.fileValidationService.validateHeadersForScrubbing(wb);
      } catch (error) {
        this.showError(error);
      }
      if (validationResult.length == 0) {
        /* grab first sheet */
        let ws: XLSX.WorkSheet;
        if (wb.Sheets.hasOwnProperty('GenInfo')) {
          ws = wb.Sheets['GenInfo'];
        } else {
          ws = wb.Sheets[wb.SheetNames[0]];
        }

        /* save data */
        const data = <AOA>(XLSX.utils.sheet_to_json(ws));
      } else {
        this.common.loadingChanged.next(false);
        this.showError(`Invalid file selected!\n${validationResult}\n\n`);
      }
      this.common.loadingChanged.next(false);
    };
    reader.readAsBinaryString(this.currentFileUpload);
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  showError(error: string) {
    this.currentFileUpload = null;
    this.uploadContainerClass = 'has-error';
    this.error = error;
    this.common.loadingChanged.next(false);
  }
}