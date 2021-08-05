import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { AddStatmentAccountModel } from 'src/app/models/statementAccountModel';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
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
  status: boolean = false;
  constructor(private dialogRef: MatDialogRef<AddStatementOfAccountsDialogComponent>, public common: SharedServices, private _reportService: ReportsService, private dialogService: DialogService) { }

  ngOnInit() {
    this.status = false;
  }

  closeDialog(status: boolean = false) {
    this.status = status;
    this.dialogRef.close();
  }

  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.addStatmentAccountModel.statementEndDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.addStatmentAccountModel.statementEndDate = '';
      }
    }
    this.minDate = new Date(event);

  }
  checkfile() {
    const validExts = ['.xlsx', '.xls'];
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
    const body = {
      statementStartDate: moment(this.addStatmentAccountModel.statementStartDate).format('DD-MM-YYYY'),
      statementEndDate: moment(this.addStatmentAccountModel.statementEndDate).format('DD-MM-YYYY'),
    }
    this.common.loadingChanged.next(true);
    this._reportService.addPayerSOAData(
      this.common.providerId,
      this.currentFileUpload,
      body
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.dialogService.openMessageDialog(new MessageDialogData('', 'Your data has been saved successfully', false));
          this.closeDialog(true);
        }
        else {
          this.status = false;
        }
        this.common.loadingChanged.next(false);
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.common.loadingChanged.next(false);
        this.dialogService.openMessageDialog(new MessageDialogData('', err.error, true));
      }
    });
  }
  selectFile(event) {
    this.fileUploadFlag = true;
    this.currentFileUpload = event.target.files[0];
    this.sizeInMB = this.common.formatBytes(this.currentFileUpload.size);
    if (!this.checkfile()) {
      event.target.files = null;
      this.currentFileUpload = undefined;
      this.fileUploadFlag = false;
      return;
    }
  }
}
