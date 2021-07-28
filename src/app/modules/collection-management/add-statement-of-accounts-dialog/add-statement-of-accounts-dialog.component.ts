import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { AddStatmentAccountModel } from 'src/app/models/statementAccountModel';
import * as moment from 'moment';
import { SharedServices } from 'src/app/services/shared.services';
@Component({
  selector: 'app-add-statement-of-accounts-dialog',
  templateUrl: './add-statement-of-accounts-dialog.component.html',
  styles: []
})
export class AddStatementOfAccountsDialogComponent implements OnInit {
  fileUploadFlag = false;
  minDate: any;
  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' };
  addStatmentAccountModel = new AddStatmentAccountModel();
  currentFileUpload: File;
  fileError = '';
  sizeInMB: string;
  constructor(private dialogRef: MatDialogRef<AddStatementOfAccountsDialogComponent>, public common: SharedServices) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.addStatmentAccountModel.statmentEndDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.addStatmentAccountModel.statmentEndDate = '';
      }
    }
    this.minDate = new Date(event);

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
      this.fileError = '';
      return true;
    }
  }
  showError(error: string) {
    this.currentFileUpload = null;
    this.fileError = error;
    this.common.loadingChanged.next(false);
  }

  submit() {

  }
  selectFile(event) {
    this.fileUploadFlag = true;
    this.currentFileUpload = event.target.files[0];
    this.sizeInMB = this.common.formatBytes(this.currentFileUpload.size);
    if (!this.checkfile()) {
      event.target.files = [];
      this.currentFileUpload = undefined;
      return;
    }
  }

}
