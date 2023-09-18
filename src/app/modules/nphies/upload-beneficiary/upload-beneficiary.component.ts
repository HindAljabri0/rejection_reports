import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { ClaimFilesValidationService } from 'src/app/services/claimFilesValidation/claim-files-validation.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { SharedServices } from 'src/app/services/shared.services';

import { HttpErrorResponse, HttpHeaderResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload-beneficiary',
  templateUrl: './upload-beneficiary.component.html',
  styles: []
})
export class UploadBeneficiaryComponent implements OnInit {
  title = 'testing';
  uploading = false;
  currentFileUpload: File;
  selectedFiles: FileList;

  payerIdsFromCurrentFile: string[] = [];
  serviceCodeValidationDisabledMessages: string[] = [];
  priceListDoesNotExistMessages: string[] = [];
  showFile = false;
  fileUploads: Observable<string[]>;
  uploadContainerClass = '';
  error = '';
  data: any;
  isVertical = true;
  detailTopActionIcon = 'ic-download.svg';
  constructor(public beneficiaryService: ProvidersBeneficiariesService, public common: SharedServices,
    private dialogService: DialogService, private adminService: AdminService, private sharedServices: SharedServices) { }

  ngOnInit() {

  }
  clear(){

    this.currentFileUpload=null;
    this.uploadContainerClass = '';
    this.error = '';
    this.data=null;

  }
  upload(typeUpload:string) {
    if (this.common.loading || this.uploading) {
      return;
    }
    this.startUpload(typeUpload);
  }
  get loading() {
    return this.common.loading;
  }
  selectFile(event) {
    this.currentFileUpload = event.item(0);
    if (!this.checkfile()) {
      this.currentFileUpload = undefined;
    }
    // this.readFile();
  }
  checkfile() {
    const validExts = new Array('.xlsx');
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
  startUpload(typeUpload:string) {
    const providerId = this.common.providerId;
    this.uploading = true;
    this.beneficiaryService.pushBeneFileToStorage(providerId, this.currentFileUpload,typeUpload);
    const progressObservable = this.beneficiaryService.progressChange.subscribe(progress => {
      if (progress.percentage == 100) {
        progressObservable.unsubscribe();
      }
    });
    const summaryObservable = this.beneficiaryService.summaryChange.subscribe(async value => {
      summaryObservable.unsubscribe();
      this.uploading = false;
      this.data = value;
      console.log(JSON.stringify(this.data));

      this.dialogService.openMessageDialog({
        title: '',
        message: `File Upload Successful`,
        isError: false
      })

      //this.dialogService.showMessage('Success',"Saved Count : "+value.savedBeneficiaryCount + " Falid Count : "+value.failToSaveBeneficiaryCount, 'success', true, 'OK', null, true);
      this.cancel();
    });
    const errorobservable = this.beneficiaryService.errorChange.subscribe(error => {
      this.dialogService.openMessageDialog(new MessageDialogData('', error, true));
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

  downloadBeneSample(fileNo:string) {

    this.beneficiaryService.download(this.sharedServices.providerId,fileNo).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null) {
          var data = new Blob([event.body as BlobPart], { type: 'application/octet-stream' });
          const FileSaver = require('file-saver');
               if(fileNo=='1'){
        FileSaver.saveAs(data, "SampleBeneficiaryDownload.xlsx");
      }else{
        FileSaver.saveAs(data, "SampleBeneficiaryByUseCCHIDownload.xlsx");
      }
               if(fileNo=='1'){
        FileSaver.saveAs(data, "SampleBeneficiaryDownload.xlsx");
      }else{
        FileSaver.saveAs(data, "SampleBeneficiaryByUseCCHIDownload.xlsx");
      }
        }
      }
    }
      , err => {
        if (err instanceof HttpErrorResponse) {
          this.dialogService.openMessageDialog({
            title: '',
            message: `Unable to download File at this moment`,
            isError: true
          });
        }
      });
  }


}
