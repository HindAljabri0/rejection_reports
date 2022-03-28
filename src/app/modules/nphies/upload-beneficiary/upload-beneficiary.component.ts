import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { ClaimFilesValidationService } from 'src/app/services/claimFilesValidation/claim-files-validation.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { NphiesClaimUploaderService } from 'src/app/services/nphiesClaimUploaderService/nphies-claim-uploader.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { SharedServices } from 'src/app/services/shared.services';

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
  // data: AOA ;
  payerIdsFromCurrentFile: string[] = [];
  serviceCodeValidationDisabledMessages: string[] = [];
  priceListDoesNotExistMessages: string[] = [];
  showFile = false;
  fileUploads: Observable<string[]>;
  uploadContainerClass = '';
  error = '';

  isVertical = true;
  constructor(public beneficiaryService: ProvidersBeneficiariesService, public common: SharedServices,
    private dialogService: DialogService, private adminService: AdminService,
    private fileValidationService: ClaimFilesValidationService) { }

  ngOnInit() {
  }

  upload() {
    if (this.common.loading || this.uploading) {
      return;
    }
    this.startUpload();
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
    const validExts = new Array('.xlsx', '.csv');
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
  startUpload() {
    const providerId = this.common.providerId;
    this.uploading = true;
    this.beneficiaryService.pushBeneFileToStorage(providerId, this.currentFileUpload);
    const progressObservable = this.beneficiaryService.progressChange.subscribe(progress => {
      if (progress.percentage == 100) {
        progressObservable.unsubscribe();
      }
    });
    /*const summaryObservable = this.beneficiaryService.summaryChange.subscribe(async value => {
      summaryObservable.unsubscribe();
      this.uploading = false;
      this.cancel();
    });*/
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

}
