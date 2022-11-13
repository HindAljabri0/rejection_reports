import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';
import { InitiateResponse } from '../models/InitiateResponse.model';
import { TawuniyaGssService } from '../Services/tawuniya-gss.service';

@Component({
  selector: 'app-vat-info-dialog',
  templateUrl: './vat-info-dialog.component.html',
  styles: []
})
export class VatInfoDialogComponent implements OnInit {

  netAmount: number = 0;
  vatRate: number;
  vatAmount: number = 0;
  initiateModel: InitiateResponse;
  form!: FormGroup;
  formIsSubmitted: boolean = false;
  readonly: boolean = true; // view form only
  // uploadedFileName: string = "";


  constructor(private tawuniyaGssService: TawuniyaGssService,
    private dialogRef: MatDialogRef<VatInfoDialogComponent>,
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) public data: {
      initiateModel: InitiateResponse,
      readonly: boolean
    }) {
    this.initiateModel = data.initiateModel;
    this.readonly = data.readonly
  }

  ngOnInit() {
    this.initForm();
    this.calculateFields();
    this.fetchVatNo();
    this.fetchFormDataIfAvailable();
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
    this.tawuniyaGssService.getVatRate(this.initiateModel.lossMonth).subscribe(response => {
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

  fetchFormDataIfAvailable() {
    if (this.readonly && this.initiateModel) {
      // response must come from the same gss reference no
      this.tawuniyaGssService.getVatInfoByGssRefNo(this.initiateModel.gssReferenceNumber).subscribe(vatInfo => {
        if (vatInfo) {
          this.form.get('vatNo').setValue(vatInfo.vatNo)
          this.form.get('grossAmount').setValue(vatInfo.grossAmount);
          this.form.get('discount').setValue(vatInfo.discount);
          this.form.get('claimCount').setValue(vatInfo.claimCount);
          this.form.get('grossAmount').setValue(vatInfo.grossAmount);
          this.form.get('patientShare').setValue(vatInfo.patientShare);
          this.form.get('taxableAmount').setValue(vatInfo.taxableAmount);
          this.form.get('nonTaxableAmount').setValue(vatInfo.nonTaxableAmount);
          this.form.get('vatInvoice').setValue(vatInfo.vatAttachmentUrl);
        }
      });
    }
  }

  fetchVatNo() {
    // set last vat No for this provider from any previous record  
    if (!this.readonly) {
      this.tawuniyaGssService.getVatInfoByProviderId().subscribe(vatInfo => {
        if (vatInfo) {
          this.form.get('vatNo').setValue(vatInfo.vatNo)
        }
      });
    }
  }

  onConfirm() {
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
    this.sharedServices.loadingChanged.next(true);

          this.dialogRef.close(this.form.value);
        }
      }, error => { });
    }
  }

  selectFile(files) {
    if (files) {
      if (this.validateUploadedFile(files[0])) {
        this.form.get('vatInvoice').setValue(files[0]);
      }
    }
  }


  private validateUploadedFile(file): boolean {
    if (!file) {
      return false;
    }
    let allowedSize = 5; // MB
    let allowedType = 'application/pdf'
    if (file.size / (1024 * 1024) > allowedSize) {
      this.form.controls['vatInvoice'].setErrors({ 'size': true })
      return false;
    } else if (file.type !== allowedType) {
      this.form.controls['vatInvoice'].setErrors({ 'format': true })
      return false;
    } else {
      this.form.controls['vatInvoice'].setErrors(null)
      return true;
    }
  }

  removeAttachment() {
    this.form.get('vatInvoice').setValue(null);
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
