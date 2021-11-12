import { Component, OnInit, Inject } from '@angular/core';
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

  constructor(
    private dialogRef: MatDialogRef<AddCommunicationDialogComponent>, private nphiesPollManagementService: NphiesPollManagementService,
    private dialogService: DialogService, private datePipe: DatePipe,
    private sharedServices: SharedServices,
    @Inject(MAT_DIALOG_DATA) public data, private formBuilder: FormBuilder) { }

  ngOnInit() {

  }

  closeDialog() {
    this.dialogRef.close();
  }

  selectFile(event) {
    this.FormCommunication.reset();
    this.currentFileUpload = event.target.files[0];
    this.FormCommunication.controls.attachmentName.setValue(this.currentFileUpload.name);
    this.FormCommunication.controls.attachmentType.setValue(this.currentFileUpload.type);
    this.FormCommunication.controls.createdDate.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));

    // this.sizeInMB = this.sharedServices.formatBytes(this.currentFileUpload.size);
    if (!this.checkfile()) {
      this.currentFileUpload = undefined;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const data: string = reader.result as string;
      this.FormCommunication.controls.payloadAttachment.setValue(data.substring(data.indexOf(',') + 1));
      const model: any = this.FormCommunication.value;
      this.payLoads.push(model);
      this.FormCommunication.reset();
      this.isSubmitted = false;
    };
  }

  checkfile() {
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg'];
    let fileExt = this.currentFileUpload.name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      // this.showError('Invalid file selected, valid files are of ' +
      //   validExts.toString() + ' types.');
      return false;
    } else {
      // this.uploadContainerClass = '';
      // this.error = '';
      return true;
    }
  }

  add() {
    this.isSubmitted = true;
    if (this.FormCommunication.valid) {
      const model: any = this.FormCommunication.value;
      this.payLoads.push(model);
      this.FormCommunication.reset();
      this.isSubmitted = false;
    }
  }

  removePayload(i) {
    this.payLoads.splice(i, 1);
  }

  onSubmit() {
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
                err.coding.forEach(codex => {
                  errors.push(codex.code + ' : ' + codex.display);
                });
              });
            }
            this.sharedServices.loadingChanged.next(false);
            this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors);
          } else {
            this.sharedServices.loadingChanged.next(false);
            this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
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
