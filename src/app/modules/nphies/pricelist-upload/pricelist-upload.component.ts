import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NphiesConfigurationService } from 'src/app/services/nphiesConfigurationService/nphies-configuration.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-pricelist-upload',
  templateUrl: './pricelist-upload.component.html',
  styles: []
})
export class PricelistUploadComponent implements OnInit {

  FormPriceList: FormGroup = this.formBuilder.group({
    insurancePlanPayerId: ['', Validators.required],
    effectiveDate: ['', Validators.required],
    file: ['', Validators.required],
    tpaNphiesId: ['']
  });

  isSubmitted = false;
  uploadContainerClass = '';
  error = '';

  constructor(
    private sharedService: SharedServices,
    private dialogRef: MatDialogRef<PricelistUploadComponent>,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private nphiesConfigurationService: NphiesConfigurationService
  ) { }

  ngOnInit() {
  }

  selectPayer(event) {
    if (event.value) {
      console.log(event.value.payerNphiesId)
      console.log(event.value);
      console.log(event.value.payerNphiesId.split(':')[1]);
      this.FormPriceList.patchValue({
        payerNphiesId: event.value.payerNphiesId.split(':')[1],
        tpaNphiesId: event.value.organizationNphiesId != '-1' ? event.value.organizationNphiesId : null
      });
    } else {
      this.FormPriceList.patchValue({
        payerNphiesId: '',
        tpaNphiesId: ''
      });
    }
  }

  selectFile(event) {
    this.FormPriceList.controls.file.setValue(event.item(0));
    if (!this.checkfile()) {
      this.FormPriceList.controls.file.setValue('');
    }
    // this.readFile();
  }

  checkfile() {
    const validExts = new Array('.xlsx');
    let fileExt = this.FormPriceList.controls.file.value.name;
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
    this.FormPriceList.controls.file.setValue('');
    this.uploadContainerClass = 'has-error';
    this.error = error;
    // this.common.loadingChanged.next(false);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.FormPriceList.valid) {
      this.sharedService.loadingChanged.next(true);
      const model: any = this.FormPriceList.value;
      model.effectiveDate = this.datePipe.transform(model.effectiveDate, 'yyyy/MM/dd');
      this.nphiesConfigurationService.uploadPriceList(this.sharedService.providerId, model).subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const body: any = event.body;
            if (body.response) {
              this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
            }
            this.dialogRef.close(model.insurancePlanPayerId);
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
