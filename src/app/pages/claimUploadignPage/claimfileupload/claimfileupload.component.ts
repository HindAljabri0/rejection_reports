import { UploadService } from '../../../services/claimfileuploadservice/upload.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SharedServices } from '../../../services/shared.services';

import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import * as XLSX from 'xlsx';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ClaimFilesValidationService } from 'src/app/services/claimFilesValidation/claim-files-validation.service';

type AOA = any[][];

@Component({
  selector: 'app-claimfileupload',
  templateUrl: './claimfileupload.component.html',
  styleUrls: ['./claimfileupload.component.css']
})
export class ClaimfileuploadComponent implements OnInit {
  // constructor(private http: HttpClient) {}
  constructor(public uploadService: UploadService, public common: SharedServices,
    private dialogService: DialogService, private adminService: AdminService,
    private fileValidationService: ClaimFilesValidationService) { }

  ngOnInit(): void {
  }


  title = 'testing';
  uploading = false;
  currentFileUpload: File;
  selectedFiles: FileList;
  // data: AOA ;
  payerIdsFromCurrentFIle: string[] = [];
  serviceCodeVaildationDisabledMessages: string[] = [];
  priceListDoesNotExistMessages: string[] = [];
  showFile = false;
  fileUploads: Observable<string[]>;



  uploadContainerClass = 'uploadfilecontainer';
  error = '';

  isVertical = true;


  selectFile(event) {
    this.currentFileUpload = event.item(0);
    if (!this.checkfile()) {
      this.currentFileUpload = undefined;
    }
    this.readFile();
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
        validationResult = this.fileValidationService.validateHeaders(wb);
      } catch (error) {
        this.showError(error);
      }
      if (validationResult.length == 0) {
        /* grab first sheet */
        let ws: XLSX.WorkSheet;
        if (wb.Sheets.hasOwnProperty('GenInfo'))
          ws = wb.Sheets['GenInfo'];
        else {
          ws = wb.Sheets[wb.SheetNames[0]];
        }

        /* save data */
        let data = <AOA>(XLSX.utils.sheet_to_json(ws));
        if (data.length > 0 && data[0].hasOwnProperty('PAYERID')) {
          data.map(row => this.payerIdsFromCurrentFIle.push(row['PAYERID']));
          this.payerIdsFromCurrentFIle = this.payerIdsFromCurrentFIle.filter(this.onlyUnique);
          this.checkServiceCode();
        } else {
          this.showError(`Invalid file selected! It doesn't have 'PAYERID' column\n`);
        }
      } else {
        this.showError(`Invalid file selected!\n${validationResult}\n\n`);
      }
    };
    reader.readAsBinaryString(this.currentFileUpload);
  }

  checkfile() {
    const validExts = new Array('.xlsx', '.csv');
    let fileExt = this.currentFileUpload.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.showError('Invalid file selected, valid files are of ' +
        validExts.toString() + ' types.');
      return false;
    } else {
      this.uploadContainerClass = 'uploadfilecontainer';
      this.error = '';
      return true;
    }
  }

  checkServiceCode() {
    this.serviceCodeVaildationDisabledMessages = [];
    this.payerIdsFromCurrentFIle = this.payerIdsFromCurrentFIle.filter(id => id != undefined);
    let count = this.payerIdsFromCurrentFIle.length;
    this.payerIdsFromCurrentFIle.forEach(payerId => {
      if (payerId != undefined) {
        this.adminService.checkIfServiceCodeVaildationIsEnabled(this.common.providerId, payerId).subscribe(event => {
          if (event instanceof HttpResponse) {
            let setting = JSON.parse(JSON.stringify(event.body));
            if (setting.hasOwnProperty('value') && setting['value'] == 0) {
              this.serviceCodeVaildationDisabledMessages.push(payerId);
            }
            count--;
            if (count <= 0) {
              this.common.loadingChanged.next(false);
              this.checkPriceList();
            }
          }
        }, errorEvent => {
          if (errorEvent instanceof HttpErrorResponse) {
            if (errorEvent.status == 404) {
              this.serviceCodeVaildationDisabledMessages.push(payerId);
            }
            count--;
            if (count <= 0) {
              this.common.loadingChanged.next(false);
              this.checkPriceList();
            }
          }
        });
      }
    });
  }

  checkPriceList() {
    this.priceListDoesNotExistMessages = [];
    this.payerIdsFromCurrentFIle = this.payerIdsFromCurrentFIle.filter(id => id != undefined && !this.serviceCodeVaildationDisabledMessages.includes(id));
    let count = this.payerIdsFromCurrentFIle.length;
    this.payerIdsFromCurrentFIle.forEach(payerId => {
      this.common.loadingChanged.next(true);
      this.adminService.checkIfPriceListExist(this.common.providerId, payerId).subscribe(event => {
        if (event instanceof HttpResponse) {
          count--;
          if (count <= 0) {
            this.common.loadingChanged.next(false);
          }
        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {
          count--;
          this.priceListDoesNotExistMessages.push(payerId);
          if (count <= 0) {
            this.common.loadingChanged.next(false);
          }
        }
      });
    });
  }

  upload() {
    if (this.common.loading || this.uploading) {
      return;
    }
    let isPriseListDoesntExist = this.priceListDoesNotExistMessages.length > 0;
    let isServiceCodeVaildationDisabled = this.serviceCodeVaildationDisabledMessages.length > 0;

    if (isPriseListDoesntExist || isServiceCodeVaildationDisabled) {
      this.dialogService.openMessageDialog({
        title: 'Caution!',
        message: (isServiceCodeVaildationDisabled ? `Service code vaildation is disabled in our system between you and the payer(s): ${this.serviceCodeVaildationDisabledMessages.toString()}. ` : '')
          + (isPriseListDoesntExist ? `There is no price list in our system between you and the payer(s): ${this.priceListDoesNotExistMessages.toString()}. ` : '')
          + 'Do you wish to continue?',
        isError: false,
        withButtons: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }).subscribe(value => {
        if (value) {
          this.startUpload();
        }
      })
    } else {
      this.startUpload();
    }

  }

  startUpload() {
    let providerId = this.common.providerId;
    this.uploading = true;
    this.uploadService.pushFileToStorage(providerId, this.currentFileUpload);
    let progressObservable = this.uploadService.progressChange.subscribe(progress => {
      if (progress.percentage == 100) {
        progressObservable.unsubscribe();
      }
    });
    let summaryObservable = this.uploadService.summaryChange.subscribe(async value => {
      summaryObservable.unsubscribe();
      this.uploading = false;
      this.cancel();
    });
    let errorobservable = this.uploadService.errorChange.subscribe(error => {
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

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  showError(error: string) {
    this.currentFileUpload = null;
    this.uploadContainerClass = 'uploadContainerErrorClass';
    this.error = error;
    this.common.loadingChanged.next(false);
  }

  get loading() {
    return this.common.loading;
  }

}

