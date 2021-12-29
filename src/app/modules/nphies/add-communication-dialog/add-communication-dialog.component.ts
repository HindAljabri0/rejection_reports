import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NphiesPollManagementService } from 'src/app/services/nphiesPollManagement/nphies-poll-management.service';
import { SharedServices } from 'src/app/services/shared.services';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-communication-dialog',
  templateUrl: './add-communication-dialog.component.html',
  styles: []
})
export class AddCommunicationDialogComponent implements OnInit {

  fetchCommunications = new EventEmitter();

  payLoads = [];
  FormCommunication: FormGroup = this.formBuilder.group({
    payloadValue: ['', Validators.required],
    payloadAttachment: [''],
    attachmentName: [''],
    attachmentType: [''],
    createdDate: [''],
  });

  currentFileUpload: any;
  isSubmitted = false;
  emptyPayloadError = '';
  invalidFileMessage = '';

  constructor(
    private dialogRef: MatDialogRef<AddCommunicationDialogComponent>, private nphiesPollManagementService: NphiesPollManagementService,
    private dialogService: DialogService, private sharedServices: SharedServices,
    @Inject(MAT_DIALOG_DATA) public data, private formBuilder: FormBuilder) { }

  ngOnInit() {

  }

  closeDialog() {
    this.dialogRef.close();
  }

  selectFile(event) {
    this.FormCommunication.reset();
    this.invalidFileMessage = '';

    for (let i = 0; i < event.target.files.length; i++) {
      if (!this.checkfile(event.target.files[i])) {
        this.invalidFileMessage = 'Attachments are only allowed in the formats of .pdf, .png, .jpg or .jpeg';
        break;
      }
    }

    for (let i = 0; i < event.target.files.length; i++) {
      this.currentFileUpload = event.target.files[i];
      const attachmentName = this.currentFileUpload.name;
      const attachmentType = this.currentFileUpload.type;
      const sizeInMB = this.sharedServices.formatBytes(this.currentFileUpload.size);

      if (!this.checkfile(event.target.files[i])) {
        continue;
      }

      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onloadend = () => {
        const data: string = reader.result as string;
        const model: any = {};
        model.payloadValue = null;
        model.payloadAttachment = (data.substring(data.indexOf(',') + 1));
        model.attachmentName = attachmentName;
        model.attachmentType = attachmentType;
        const createDate = new Date();
        model.createdDate = createDate.toISOString().replace('Z', '');


        this.payLoads.push(model);

        if (i === event.target.files.length - 1) {
          this.emptyPayloadError = '';
          this.FormCommunication.reset();
          this.isSubmitted = false;
        }

      };
    }

  }

  checkfile(file: any) {
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg'];
    let fileExt = file.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      return false;
    } else {
      return true;
    }
  }

  add() {
    this.isSubmitted = true;
    if (this.FormCommunication.valid) {
      const model: any = this.FormCommunication.value;
      this.payLoads.push(model);
      this.isSubmitted = false;
      this.emptyPayloadError = '';
      this.FormCommunication.reset();
    }
  }

  removePayload(i) {
    this.payLoads.splice(i, 1);
    if (this.payLoads.length === 0) {
      this.emptyPayloadError = 'Please select a file or enter comment';
    }
  }

  onSubmit() {
    if (this.payLoads.length === 0) {
      this.emptyPayloadError = 'Please select a file or enter comment';
      return;
    }
    this.emptyPayloadError = '';
    this.sharedServices.loadingChanged.next(true);
    const model: any = {};
    model.claimResponseId = this.data.claimResponseId;
    if (this.data.communicationRequestId) {
      model.communicationRequestId = this.data.communicationRequestId;
    }
    model.payloads = this.payLoads;
    console.log(model);
    this.nphiesPollManagementService.sendCommunication(this.sharedServices.providerId, model).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;

          if (body.outcome.toString().toLowerCase() === 'error') {
            const errors: any[] = [];

            if (body.disposition) {
              errors.push(body.disposition);
            }

            if (body.errors && body.errors.length > 0) {
              body.errors.forEach(err => {
                errors.push(err);
              });
            }
            this.sharedServices.loadingChanged.next(false);
            this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors, true);
            this.fetchCommunications.emit(true);
          } else {
            this.sharedServices.loadingChanged.next(false);
            this.dialogRef.close(true);
          }
        }
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK', error.error.errors);
          } else {
            // tslint:disable-next-line:max-line-length
            this.dialogService.showMessage('Error', (error.error && error.error.message) ? error.error.message : ((error.error && !error.error.message) ? error.error : (error.error ? error.error : error.message)), 'alert', true, 'OK');
          }
        } else if (error.status === 404) {
          this.dialogService.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK');
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
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  getFilename(str) {
    if (str.indexOf('pdf') > -1) {
      return 'pdf';
    } else {
      return 'image';
    }
  }

}
