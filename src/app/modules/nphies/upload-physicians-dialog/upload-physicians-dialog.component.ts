import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-upload-physicians-dialog',
  templateUrl: './upload-physicians-dialog.component.html',
  styles: []
})

export class UploadPhysiciansDialogComponent implements OnInit {
  uploadContainerClass = '';
  error = '';
  isSubmitted = false;
  currentFileUpload: File;
  selectedFiles: FileList;
  uploading = false;
  errorChange: Subject<string> = new Subject();

  FormPhysiciansList: FormGroup = this.formBuilder.group({
    file: ['', Validators.required]
  });

  constructor(
    private common: SharedServices,
    private dialogRef: MatDialogRef<UploadPhysiciansDialogComponent>,
    private formBuilder: FormBuilder,
    private nphiesConfigurationService: NphiesConfigurationService,
    private dialogService: DialogService,


  ) { }

  ngOnInit() { }

  closeDialog() {
    this.dialogRef.close();
  }
  get loading() {
    return this.common.loading;
  }

  selectFile(event) {
    this.FormPhysiciansList.controls.file.setValue(event.item(0));
    if (!this.checkFile()) {
      this.FormPhysiciansList.controls.file.setValue('');
    }
  }

  checkFile() {
    const validExts = new Array('.xlsx');
    let fileExt = this.FormPhysiciansList.controls.file.value.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.showError('Invalid File Selected, Valid Files are of ' +
        validExts.toString() + ' Types.');
      return false;
    } else {
      this.uploadContainerClass = '';
      this.error = '';
      return true;
    }
  }

  showError(error: string) {
    this.FormPhysiciansList.controls.file.setValue('');
    this.uploadContainerClass = 'has-error';
    this.error = error;
  }


  onSubmit() {
    this.isSubmitted = true;

    if (this.FormPhysiciansList.valid) {
      this.common.loadingChanged.next(true);
      const model: any = this.FormPhysiciansList.value;
      console.log(this.FormPhysiciansList.value);
      this.nphiesConfigurationService.uploadPhysicianList(this.common.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const body: any = event.body;

            if (body.errormessage != null && body.errormessage instanceof Array) {
              this.dialogService.showMessage('Summary:', `Saved Physicians: ${body.savedPhysciainsCount}<br>Failed Physicians: ${body.failToSavePhysciainsCount}<br><br>Error info:<br>${body.errormessage.join('<br>')}`, 'info', true, 'OK');

              this.dialogRef.close(model.file);
            } else {
              this.dialogService.showMessage('Summary:', `Saved Physicians: ${body.savedPhysciainsCount}<br>Failed Physicians: ${body.failToSavePhysciainsCount}`,'info', true, 'OK');
            }
          }

          this.common.loadingChanged.next(false);

        }
      }, error => {
        this.common.loadingChanged.next(false);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
          } else if (error.status === 404) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          } else if (error.status === 500) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          } else if (error.status === 503) {
            const errors: any[] = [];
            if (error.error.errors) {
              error.error.errors.forEach(x => {
                errors.push(x);
              });
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
            } else {
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
            }
          }
        }
      });
    }
  }


  cancel() {
    if (this.common.loading || this.uploading) {
      return;
    }
    this.currentFileUpload = null;
    this.selectedFiles = null;
  }
}
