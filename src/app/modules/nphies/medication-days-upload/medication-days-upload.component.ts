import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-medication-days-upload',
  templateUrl: './medication-days-upload.component.html',
  styles: []
})
export class MedicationDaysUploadComponent implements OnInit {

  FormMedicationDays: FormGroup = this.formBuilder.group({
    file: ['', Validators.required],
  });

  isSubmitted = false;
  uploadContainerClass = '';
  error = '';

  constructor(
    private sharedService: SharedServices,
    private dialogRef: MatDialogRef<MedicationDaysUploadComponent>,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private nphiesConfigurationService: NphiesConfigurationService
  ) { }

  ngOnInit() {
  }

  selectFile(event) {
    this.FormMedicationDays.controls.file.setValue(event.item(0));
    if (!this.checkfile()) {
      this.FormMedicationDays.controls.file.setValue('');
    }
    // this.readFile();
  }

  checkfile() {
    const validExts = new Array('.xlsx');
    let fileExt = this.FormMedicationDays.controls.file.value.name;
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

  showError(error: string) {
    this.FormMedicationDays.controls.file.setValue('');
    this.uploadContainerClass = 'has-error';
    this.error = error;
    // this.common.loadingChanged.next(false);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.FormMedicationDays.valid) {
      this.sharedService.loadingChanged.next(true);
      const model: any = this.FormMedicationDays.value;
      this.nphiesConfigurationService.uploadMedicationDays(this.sharedService.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const body: any = event.body;
            if (body.response) {
              this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
            }
            this.dialogRef.close(model.payerNphiesId);
          }
          this.sharedService.loadingChanged.next(false);
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.sharedService.loadingChanged.next(false);
          if (error.status === 500) {
            this.dialogService.showMessage(error.error.message ? error.error.message : error.error.error, '', 'alert', true, 'OK');
          }
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
