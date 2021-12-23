import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CertificateConfigurationProvider } from 'src/app/models/certificateConfigurationProvider';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SettingsService } from 'src/app/services/settingsService/settings.service';
import { SharedServices } from 'src/app/services/shared.services';
@Component({
  selector: 'app-certificate-configuration-model',
  templateUrl: './certificate-configuration-model.component.html',
  styleUrls: ['./certificate-configuration-model.component.css']
  
})
export class CertificateConfigurationModelComponent implements OnInit {

  uploadContainerClass = '';
  currentFileUpload: File;
  error = '';
  sizeInMB: string;
  closeStatus = false;
  certificateConfigurationProvider =new CertificateConfigurationProvider();
  constructor(
    private dialogRef: MatDialogRef<CertificateConfigurationModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public common: SharedServices,
    private settingsService: SettingsService,
    private dialogService: DialogService) { }

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
    console.log(this.data.password);
    if (this.currentFileUpload === undefined) {
      this.error = 'Please upload the one p12 file.';
      return;
    }
    this.error = '';

    console.log(this.data.password);
    
    this.startUploading();
  }
  startUploading() {
    let item:  CertificateConfigurationProvider ={
      password: this.data.password
     
    };
    this.settingsService.getSaveCertificateFileToProvider(
      this.data.selectedProviderId,
      this.currentFileUpload,
      item

      ).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            this.dialogService.openMessageDialog(new MessageDialogData('', 'Your data has been saved successfully', false));
            this.closeStatus = true;
            this.closeDialog();
          }
  
          this.common.loadingChanged.next(false);
        }
      }, err => {
        if (err instanceof HttpErrorResponse) {
          this.common.loadingChanged.next(false);
          this.closeStatus = false;
          this.dialogService.openMessageDialog(new MessageDialogData('', err.message, true));
        }
      });
    }


  //      ).subscribe((res: any) => {
  //     if (res.body !== undefined) {
  //       this.common.loadingChanged.next(false);
  //       this.closeDialog();
  //       !res.body.response
  //         ? this.dialogService.openMessageDialog(new MessageDialogData('', res.body.message, true))
  //         : this.dialogService.openMessageDialog(new MessageDialogData('', res.body.message, false));
  //     }
  //   }, err => {
  //     this.common.loadingChanged.next(false);
  //     this.error = err.error.message;
  //     console.log(err);
  //   });
  // }

}

function body(selectedProviderId: any, currentFileUpload: File, body: any) {
  throw new Error('Function not implemented.');
}

