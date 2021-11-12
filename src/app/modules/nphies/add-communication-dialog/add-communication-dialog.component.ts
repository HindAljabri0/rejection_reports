import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-communication-dialog',
  templateUrl: './add-communication-dialog.component.html',
  styles: []
})
export class AddCommunicationDialogComponent implements OnInit {

  FormCommunication: FormGroup = this.formBuilder.group({
    communicationRequestId: ['', Validators.required],
    claimResponseId: ['', Validators.required],
    payloadValue: ['', Validators.required],
    payloadAttachment: [''],
    attachmentName: [''],
    attachmentType: [''],
    createdDate: [''],
  });

  currentFileUpload: any;

  constructor(private dialogRef: MatDialogRef<AddCommunicationDialogComponent>, private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  selectFile(event) {
    this.currentFileUpload = event.target.files[0];
    this.FormCommunication.controls.attachmentName.setValue(this.currentFileUpload.name);
    this.FormCommunication.controls.attachmentType.setValue(this.currentFileUpload.type);
    this.FormCommunication.controls.createdDate.setValue(new Date());

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

  }

  onSubmit() {

  }

}
