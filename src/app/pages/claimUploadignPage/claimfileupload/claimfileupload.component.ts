import { UploadService } from '../../../services/claimfileuploadservice/upload.service';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SharedServices } from '../../../services/shared.services';

import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import * as XLSX from 'xlsx';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

type AOA = any[][];

@Component({
  selector: 'app-claimfileupload',
  templateUrl: './claimfileupload.component.html',
  styleUrls: ['./claimfileupload.component.css']
})
export class ClaimfileuploadComponent implements OnInit {
  // constructor(private http: HttpClient) {}
  constructor(public uploadService: UploadService, public common: SharedServices,
    private dialogService: DialogService, private adminService: AdminService) { }

  ngOnInit(): void {
  }


  title = 'testing';
  uploading = false;
  currentFileUpload: File;
  selectedFiles: FileList;
  // data: AOA ;
  payerIdsFromCurrentFIle: string[] = [];
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

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      data.splice(0, 1)
      data.map(row => this.payerIdsFromCurrentFIle.push(row[1]));
      this.payerIdsFromCurrentFIle = this.payerIdsFromCurrentFIle.filter(this.onlyUnique);
      this.checkPriceList();
    };
    reader.readAsBinaryString(this.currentFileUpload);
  }

  checkfile() {
    const validExts = new Array('.xlsx', '.xls');
    let fileExt = this.currentFileUpload.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.uploadContainerClass = 'uploadContainerErrorClass';
      this.error = 'Invalid file selected, valid files are of ' +
        validExts.toString() + ' types.';
      return false;
    } else {
      this.uploadContainerClass = 'uploadfilecontainer';
      this.error = '';
      return true;
    }
  }

  checkPriceList() {
    this.priceListDoesNotExistMessages = [];
    let count = this.payerIdsFromCurrentFIle.length;
    this.payerIdsFromCurrentFIle.forEach(payerId => {
      this.adminService.checkIfPriceListExist(this.common.providerId, payerId).subscribe(event => {
        if (event instanceof HttpResponse) {
          count--;
          if (count <= 0) this.common.loadingChanged.next(false);
        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {
          count--;
          this.priceListDoesNotExistMessages.push(payerId);
          if (count <= 0) this.common.loadingChanged.next(false);
        }
      })
    });
  }

  upload() {
    if (this.common.loading || this.uploading) {
      return;
    }
    console.log(this.priceListDoesNotExistMessages.length);
    if (this.priceListDoesNotExistMessages.length > 0) {
      this.dialogService.openMessageDialog({
        title: 'Caution!',
        message: `There is no price list in our system between you and the payer(s): ${this.priceListDoesNotExistMessages.toString()}. Do you wish to continue?`,
        isError: false,
        withButtons: true
      }).subscribe(value => {
        if (value) {
          this.startUpload(false);
        }
      })
    } else {
      this.startUpload(true);
    }
    
  }

  startUpload(verifyServiceCode:boolean) {
    let providerId = this.common.providerId;
    this.uploading = true;
    this.uploadService.pushFileToStorage(providerId, this.currentFileUpload, verifyServiceCode);
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


}

