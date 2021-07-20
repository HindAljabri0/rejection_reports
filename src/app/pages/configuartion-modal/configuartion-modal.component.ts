import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.services';
import { ConfigurationService } from 'src/app/services/configurationService/configuration.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-configuartion-modal',
  templateUrl: './configuartion-modal.component.html'
})
export class ConfiguartionModalComponent implements OnInit {
  uploadContainerClass = '';
  currentFileUpload: File;
  error = '';
  sizeInMB: string;
  constructor(
    private dialogRef: MatDialogRef<ConfiguartionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public common: SharedServices,
    private _configurationService: ConfigurationService,
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
    const validExts = new Array('.csv');
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
      this.error = 'Please upload the one csv file.';
      return;
    }
    this.error = '';
    this.startUploading();
  }
  startUploading() {
    this.common.loadingChanged.next(true);
    this._configurationService.uploadCSVFile(this.data.selectedProviderId, this.currentFileUpload).subscribe((res: any) => {
      if (res.body !== undefined) {
        this.common.loadingChanged.next(false);
        this.closeDialog();
        !res.body.response
          ? this.dialogService.openMessageDialog(new MessageDialogData('', res.body.message, true))
          : this.dialogService.openMessageDialog(new MessageDialogData('', res.body.message, false));
      }
    }, err => {
      this.common.loadingChanged.next(false);
      this.error = err.error.message;
      console.log(err);
    });
  }

}
