import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CertificateConfigurationProvider } from 'src/app/models/certificateConfigurationProvider';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-certificate-configuration-model',
  templateUrl: './certificate-configuration-model.component.html',
  styles: []

})
export class CertificateConfigurationModelComponent implements OnInit {

  uploadContainerClass = '';
  currentFileUpload: File;
  error = '';
  sizeInMB: string;
  closeStatus = false;
  certificateConfigurationProvider = new CertificateConfigurationProvider();
  constructor(
    private dialogRef: MatDialogRef<CertificateConfigurationModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public common: SharedServices) { }

  ngOnInit() {
    this.currentFileUpload = this.data.file;
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
  showError(error: string) {
    this.currentFileUpload = null;
    this.uploadContainerClass = 'has-error';
    this.error = error;
    this.common.loadingChanged.next(false);
  }

  checkfile() {
    const validExts = new Array('.p12');
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
  upload() {

    if (this.currentFileUpload === undefined) {
      this.error = 'Please upload the one p12 file.';
      return;
    }
    this.error = '';
    this.dialogRef.close(true);


    // this.startUploading();
  }
  // startUploading() {
  //   // let item:  CertificateConfigurationProvider ={
  //   //   password: this.data.password

  //   // };
  //   this.settingsService.getSaveCertificateFileToProvider(
  //     this.data.selectedProviderId,
  //     this.currentFileUpload,
  //     this.data.password
  //     // item

  //   ).subscribe(event => {
  //     if (event instanceof HttpResponse) {
  //       if (event.status === 200) {
  //         this.dialogService.openMessageDialog(new MessageDialogData('', 'Your data has been saved successfully', false));
  //         this.closeStatus = true;
  //         this.closeDialog();
  //       }

  //       this.common.loadingChanged.next(false);
  //     }
  //   }, err => {
  //     if (err instanceof HttpErrorResponse) {
  //       this.common.loadingChanged.next(false);
  //       this.closeStatus = false;
  //       this.dialogService.openMessageDialog(new MessageDialogData('', err.message, true));
  //     }
  //   });
  // }



}



