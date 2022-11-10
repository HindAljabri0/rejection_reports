import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { files, file } from 'jszip';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { InitiateResponse } from '../../models/InitiateResponse.model';
import { TawuniyaGssService } from '../../Services/tawuniya-gss.service';

@Component({
  selector: 'app-vat-form-dialog',
  templateUrl: './vat-form-dialog.component.html',
  styles: []
})
export class VatFormDialogComponent implements OnInit {
  netAmount: number = 0;
  vatRate: number;
  vatAmount: number = 0;
  initiateModel: InitiateResponse;
  form!: FormGroup;
  formIsSubmitted: boolean = false;
  uploadedFileName: any = "";
  lossMonth
  constructor(private tawuniyaGssService: TawuniyaGssService,
    private dialogRef: MatDialogRef<VatFormDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      lossMonth: string,
      initiateModel: InitiateResponse,

    }) {
    this.initiateModel = data.initiateModel;
    this.lossMonth = data.lossMonth
  }

  ngOnInit() {
    this.initForm();
    this.calculateFields();
    this.fetchVatNo();
  }
  

  initForm() {
    this.form = new FormGroup({
      vatNo: new FormControl(null, [Validators.required, Validators.maxLength(15), Validators.minLength(15)]),
      claimCount: new FormControl(null, [Validators.required]),
      grossAmount: new FormControl(null, [Validators.required]),
      discount: new FormControl(null, [Validators.required]),
      patientShare: new FormControl(null, [Validators.required]),
      taxableAmount: new FormControl(null, [Validators.required]),
      nonTaxableAmount: new FormControl(null, [Validators.required]),
      vatInvoice: new FormControl(null, [Validators.required])
    });
  }

  calculateFields() {
    this.tawuniyaGssService.getVatRate(this.lossMonth).subscribe(response => {
      this.vatRate = response.vatRate
      this.calculateVatAmount();
    });
    this.form.get('taxableAmount').valueChanges.subscribe(taxableAmount => {
      this.calculateNetAmount();
      this.calculateVatAmount();
    })
    this.form.get('nonTaxableAmount').valueChanges.subscribe(nonTaxableAmount => {
      this.calculateNetAmount();
    })
  }

  calculateVatAmount() {
    this.vatAmount = +((this.vatRate / 100) * +this.form.get('taxableAmount').value).toFixed(2);
  }

  private calculateNetAmount() {
    this.netAmount = +(+this.form.get('taxableAmount').value + +this.form.get('nonTaxableAmount').value).toFixed(2);;
  }

  fetchVatNo() {
    this.tawuniyaGssService.getVatInfoByProviderId().subscribe(vatInfo => {
      this.form.get('vatNo').setValue(vatInfo.vatNo)
    });
  }

  confirmClick() {
    console.log('vatInvoiceErrors', this.form.get('vatInvoice').errors);
    this.formIsSubmitted = true
    if (this.form.valid) {
      const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, {
        panelClass: ['primary-dialog'],
        disableClose: true,
        autoFocus: false,
        data: {
          mainMessage: 'Are you sure you want to sign and confirm the GSS?',
          subMessage: 'Disclaimer: GSS is the process to confirm the billing submission that is sent to Tawuniya and by confirming the GSS, no claims will be allowed to submit.',
          mode: 'warning'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close(this.form.value);
        }
      }, error => { });
    }
  }

  selectFile(files) {
    if (files) {
      this.validateUploadedFile(files[0]);
      this.uploadedFileName = files[0].name
      this.form.get('vatInvoice').setValue(files[0]);
    }
  }

  private validateUploadedFile(file) {
    let allowedSize = 5; // MB
    let allowedType = 'application/pdf'
    console.log('file.size ', file.size);
    console.log('file.type ', file.type);
    if (file.size / (1024 * 1024) > allowedSize) {
      this.form.controls['vatInvoice'].setErrors({ size: true })
    } else if (file.type !== allowedType) {
      console.log(this.form.get('vatInvoice'));
      console.log('we should throw an error for file type');
      this.form.controls['vatInvoice'].setErrors({'format': true})
    }
    this.form.updateValueAndValidity()
    console.log('errors: ', this.form.get('vatInvoice'));
    console.log('type', file.type);
  }

  cancelClick() {
    this.dialogRef.close(null);
  }

}
