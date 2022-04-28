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
  title = 'testing';
  errorChange: Subject<string> = new Subject();
  PhysiciansListDoesNotExistMessages: string[] = [];
  FormPhysiciansList: FormGroup = this.formBuilder.group({
    file: ['', Validators.required]
  });

  constructor(
    private common: SharedServices,
    private dialogRef: MatDialogRef<UploadPhysiciansDialogComponent>,
    private formBuilder: FormBuilder,
    private nphiesConfigurationService: NphiesConfigurationService,
    private dialogService: DialogService
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
          const errors: any[] = [];
          const body: any = event.body;
          if (event.status === 200) {

          }
          this.common.loadingChanged.next(false);
this.closeDialog();
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.common.loadingChanged.next(false);

      this.uploading = false;

        }
        console.log(error);
      });
    }
  }
  cancel() {
    if (this.common.loading || this.uploading) {
      return;
    }
    this.currentFileUpload = null;
    this.selectedFiles = null;
    this. PhysiciansListDoesNotExistMessages = [];
  }
}
