import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AsyncSubject, Observable } from 'rxjs';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';
import { GssReportResponse, VatInformation } from '../models/InitiateResponse.model';
import { VatInformationRequest } from '../models/vat-information-request.model';
import { TawuniyaGssService } from '../Services/tawuniya-gss.service';

interface SelectedFile {
  name: string;
  file: any;
  base64?: string;
  url?: string;
}


@Component({
  selector: 'app-vat-info-dialog',
  templateUrl: './vat-info-dialog.component.html',
  styles: []
})
export class VatInfoDialogComponent implements OnInit {

  netAmount: number = 0;
  vatAmount: number = 0;
  gssReportResponse: GssReportResponse;
  form!: FormGroup;
  formIsSubmitted: boolean = false;
  editMode: boolean = false;
  editable: boolean = false;
  base64: string = null;
  fileName: string = null;
  attachmentUrl: string = null;


  constructor(private tawuniyaGssService: TawuniyaGssService,
    private router: Router,
    // private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private dialogService: DialogService,
    private dialogRef: MatDialogRef<VatInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      gssReportResponse: GssReportResponse,
      editMode: boolean,
      editable: boolean
    }) {
    this.gssReportResponse = data.gssReportResponse;
    this.editMode = data.editMode
    this.editable = data.editable;
  }

  ngOnInit() {
    this.initForm();
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
      vatInvoice: new FormControl(null, [Validators.required]),
      vatRate: new FormControl(null, [Validators.required])
    });
    this.calculateFields();
    this.fetchVatInfo();

  }

  calculateFields() {
    this.calculateNetAmount();
    this.calculateVatAmount();
    this.form.valueChanges.subscribe(formVal => {
      this.calculateNetAmount();
      this.calculateVatAmount();
    })
  }

  calculateVatAmount() {
    if (this.form && this.form.get('vatRate') && this.form.get('vatRate').value
      && this.form.get('taxableAmount') && this.form.get('taxableAmount').value) {
      this.vatAmount = +((this.form.get('vatRate').value / 100) * +this.form.get('taxableAmount').value).toFixed(2);
    } else {
      this.vatAmount = 0
    }
  }

  private calculateNetAmount() {
    let taxableAmount: number = 0
    let nonTaxableAmount: number = 0
    if (this.form && this.form.get('taxableAmount') && this.form.get('taxableAmount').value) {
      taxableAmount = +this.form.get('taxableAmount').value

    }
    if (this.form.get('nonTaxableAmount') && this.form.get('nonTaxableAmount').value) {
      nonTaxableAmount = +this.form.get('nonTaxableAmount').value;
    }
    this.netAmount = +(taxableAmount + nonTaxableAmount).toFixed(2);
  }

  fetchVatInfo() {
    if (!this.editMode) {
      let vatInfo: VatInformation = this.tawuniyaGssService.getVatInformation();
      if (!vatInfo) {
        this.sharedServices.loadingChanged.next(true);
        this.tawuniyaGssService.getVatInformationByGssRefNo(this.gssReportResponse.gssReferenceNumber).subscribe(vatInfo => {
          this.sharedServices.loadingChanged.next(false);
          this.setVatInfoForm(vatInfo);
        }, error => {
          this.sharedServices.loadingChanged.next(false);
          if (error && error.error && error.error.message) {
            this.dialogService.openMessageDialog(new MessageDialogData("GSS Get VAT Information Fail", error.error.message, true))
          } else if (error && error.error instanceof ProgressEvent) {
            this.dialogService.openMessageDialog(new MessageDialogData("GSS Get VAT Information Fail", 'Could not reach server at the moment. Please try again later', true));
          } else {
            this.dialogService.openMessageDialog(new MessageDialogData("GSS Get Vat Information Fail", 'Internal Server error', true))
          }
        });
      } else {
        this.setVatInfoForm(vatInfo);
      }
    } else {
      this.setVatInfoForm(null);
    }
  }



  fetchVatNo() {
    // set last vat No for this provider from the last previous record 
    this.tawuniyaGssService.getVatNoByProviderId().subscribe(response => {
      console.log('response: ', response);
      this.form.get('vatNo').setValue(response.vatNo)
    });

  }

  fetchVatRate() {
    if (this.getLossMonth()) {
      this.tawuniyaGssService.getVatRate(this.getLossMonth()).subscribe(response => {
        this.form.get('vatRate').setValue(response.vatRate)
      });
    }
  }

  private setVatInfoForm(vatInfo) {
    if (vatInfo) {
      this.form.get('grossAmount').setValue(vatInfo.totalGross ? vatInfo.totalGross.value : null);
      this.form.get('discount').setValue(vatInfo.totalDiscount ? vatInfo.totalDiscount.value : null);
      this.form.get('patientShare').setValue(vatInfo.totalPatientShare ? vatInfo.totalPatientShare.value : null);
      this.form.get('nonTaxableAmount').setValue(vatInfo.nonTaxableAmount ? vatInfo.nonTaxableAmount.value : null);
      this.form.get('taxableAmount').setValue(vatInfo.taxableAmount ? vatInfo.taxableAmount.value : null);
      this.form.get('vatRate').setValue(vatInfo.vatRate ? vatInfo.vatRate.value : null);
      this.form.get('vatNo').setValue(vatInfo.vatNumber ? vatInfo.vatNumber : null)
      this.form.get('claimCount').setValue(vatInfo.totalNumberOfClaims);
      console.log('form.values: ', this.form.value)

      this.setAttachmentData(vatInfo);
    }
    if (!this.form.get('vatRate').value) {
      this.fetchVatRate()
    }
    if (!this.form.get('vatNo').value) {
      // console.log(`!this.form.get('vatNo').value`, !this.form.get('vatNo').value);
      this.fetchVatNo()
    }
    console.log('vatInfo check attachment: ', vatInfo);

  }

  setAttachmentData(vatInfo) {
    if (vatInfo && vatInfo.attachment) {
      this.base64 = vatInfo.attachment.base64EncodedAttachmentFile;
      this.fileName = vatInfo.attachment.fileName;
      this.attachmentUrl = vatInfo.vatAttachmentUrl
      this.form.controls['vatInvoice'].clearValidators();
      this.form.controls['vatInvoice'].updateValueAndValidity();
      console.log('check vat invoice validity right after', this.form.get('vatInvoice'));
    }
  }

  onSubmit() {
    this.formIsSubmitted = true
    if (this.form.valid) {
      this.sharedServices.loadingChanged.next(true);
      this.tawuniyaGssService.submitVatInfoRequest(this.getVatInfoFormData()).subscribe(msg => {
        this.sharedServices.loadingChanged.next(false);
        this.dialogService.openMessageDialog(new MessageDialogData("GSS VAT Information Success", 'VAT information has been submitted successfully', false)).subscribe(afterClose => {
          this.closeDialog()
          this.router.navigate(['/tawuniya-gss/' + encodeURIComponent(this.gssReportResponse.gssReferenceNumber), "report-details"], { queryParams: { lossMonth: encodeURIComponent(this.getLossMonth()) } });
        })
      }, err => {
        this.sharedServices.loadingChanged.next(false);
        // this.dialogRef.close(this.form.value);
        if (err && err.error && err.error.message) {
          this.dialogService.openMessageDialog(new MessageDialogData("GSS VAT Information Fail", err.error.message, true))
        } else if (err && err.error instanceof ProgressEvent) {
          this.dialogService.openMessageDialog(new MessageDialogData("GSS VAT Information Fail", 'Could not reach server at the moment. Please try again later', true));
        } else {
          this.dialogService.openMessageDialog(new MessageDialogData("GSS VAT Information Fail", 'Internal Server error', true))
        }

      })
    }
  }
  getVatInfoFormData(): any {
    this.gssReportResponse.gssReferenceNumber
    this.form.value, this.getLossMonth(), this.gssReportResponse.gssReferenceNumber
    let formData: FormData = new FormData();
    let vatInfoFormData: VatInformationRequest =
    {
      providerId: +localStorage.getItem('provider_id'),
      username: localStorage.getItem('auth_username'),
      lossMonth: this.getLossMonth(),
      gssReferenceNumber: this.gssReportResponse.gssReferenceNumber,

      claimCount: this.form.get('claimCount').value,
      discount: this.form.get('discount').value,
      grossAmount: this.form.get('grossAmount').value,
      nonTaxableAmount: this.form.get('nonTaxableAmount').value,
      taxableAmount: this.form.get('taxableAmount').value,
      patientShare: this.form.get('patientShare').value,
      vatNo: this.form.get('vatNo').value,
      vatRate: this.form.get('vatRate').value,

      attachmentUrl: this.attachmentUrl
    }
    formData.append("vatInformationRequest", new Blob([JSON.stringify(vatInfoFormData)], { type: 'application/json' }));
    formData.append("vatInfoFile", this.form.get('vatInvoice').value);
    return formData;
  }

  getLossMonth(): string {
    if (this.gssReportResponse && this.gssReportResponse.lossMonth) {
      return this.gssReportResponse.lossMonth.replace('/', '-');
    }
    return null;
  }

  selectFile($event) {
    let valid: boolean = !!$event && !!$event.target && $event.target.files
    if (valid) {
      let selectedFile: SelectedFile = null
      this.fileName = $event.target.files[0].name;
      this.toFilesBase64($event.target.files[0], selectedFile).subscribe(res => {
        this.base64 = res.base64.replace('data:application/pdf;base64,', '').trim();
      })
      if (this.validateUploadedFile($event.target.files[0])) {
        this.form.get('vatInvoice').setValue($event.target.files[0]);
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
    this.base64 = null
    this.fileName = null
    this.form.get('vatInvoice').setErrors({ required: true })
  }

  downloadAttachment() {
    var blob = this.b64toBlob(this.base64, "application/pdf");
    let a = document.createElement("a");
    document.body.appendChild(a);
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = String(this.fileName);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  toFilesBase64(file: File, selectedFile: SelectedFile): Observable<SelectedFile> {
    const result = new AsyncSubject<SelectedFile>();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (file && reader) {
        selectedFile = { name: file.name, file: file, base64: reader.result as string }
      }
      result.next(selectedFile);
      result.complete();
    };
    return result;
  }

  // getBase64(file): string {
  //   let base64 = ""
  //   var reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function () {
  //     base64 += reader.result;
  //   };
  //   reader.onerror = function (error) {
  //     console.log('Error: ', error);
  //   };
  //   return base64;
  // }

  public b64toBlob(b64Data: string, contentType: string) {
    contentType = contentType || '';
    let sliceSize = 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  onEdit() {
    // this.removeAttachment();
    this.editMode = true
    console.log('vatInvoice check validity', this.form.get('vatInvoice'));
  }
  closeDialog() {
    this.dialogRef.close();
  }

}
