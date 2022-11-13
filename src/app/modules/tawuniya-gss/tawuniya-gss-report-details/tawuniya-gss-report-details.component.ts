import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';


import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ConfirmationVatInfo, GSSConfirmationRequest } from '../models/confirmation-request.model';
import { InitiateResponse } from '../models/InitiateResponse.model';
import { TawuniyaGssService } from '../Services/tawuniya-gss.service';
import { VatInfoDialogComponent } from '../vat-info-dialog/vat-info-dialog.component';


@Component({
  selector: 'app-tawuniya-gss-report-details',
  templateUrl: './tawuniya-gss-report-details.component.html',
  styles: []
})
export class TawuniyaGssReportDetailsComponent implements OnInit, OnDestroy {



  downloaded: boolean = false
  initiateModel: InitiateResponse;
  gssReferenceNumber: string;
  isInquiry: boolean = true;
  lossMonth: string = null;

  constructor(private activatedRoute: ActivatedRoute,
    private tawuniyaGssService: TawuniyaGssService,
    private sharedServices: SharedServices,

    private downloadService: DownloadService,
    private dialog: MatDialog,
    private router: Router,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.gssReferenceNumber = this.activatedRoute.snapshot.params.gssReferenceNumber;
    this.isInquiry = this.activatedRoute.snapshot.queryParams.inquiry;
    this.lossMonth = decodeURIComponent(this.activatedRoute.snapshot.queryParams.lossMonth);


    if (this.isInquiry) {
      this.tawuniyaGssService.gssQueryDetails(this.gssReferenceNumber).subscribe(model => {

        this.initiateModel = model;
        this.sharedServices.loadingChanged.next(false);
      });
    } else {
      this.initiateGssReport(this.lossMonth);
    }
  }

  initiateGssReport(lossMonth: string) {
    this.tawuniyaGssService.generateReportInitiate(lossMonth).subscribe(initiateModel => {
      this.sharedServices.loadingChanged.next(false);
      if (!initiateModel) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", "Could not initiate GSS report, kindly try to regenerate GSS report again later", true)).subscribe(afterClose => {
          this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
        });
      } else {
        this.initiateModel = initiateModel

      }

    }, error => {
      this.sharedServices.loadingChanged.next(false);
      if (error && error.error && error.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", error.error.message, true));
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", 'Internal Server error', true));
      }
    });
  }



  ngOnDestroy() {

  }

  downloadData() {
    if (this.downloaded) {
      return;
    }
    this.downloadService.startGeneratingDownloadFile(this.tawuniyaGssService.downloadPDF(this.initiateModel))
      .subscribe(status => {
        if (status != DownloadStatus.ERROR) {
          this.downloaded = true;
        }
      });
  }

  generateReport(showMessage: Boolean) {
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.generateReportInitiate(this.lossMonth).subscribe(data => {
      console.log('this.initiateModel', data);
      this.initiateModel = data;
      this.sharedServices.loadingChanged.next(false);
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", err.error.message, true));
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", 'Internal Server error', true));
      }
    });
  }

  onConfirm() {
    const dialogRef = this.dialog.open(VatInfoDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg'],
      data: {
        initiateModel: this.initiateModel,
        readonly: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.validateAndConfirm(result);
        // this.confirm(result)
      }
    }, error => { });
  }

  onShowVatInformation() {
    const dialogRef = this.dialog.open(VatInfoDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg'],
      data: {
        initiateModel: this.initiateModel,
        readonly: true
      }
    })
  }

  private validateAndConfirm(vatForm) {
    // request another initiate and compare the two netAmount, if both are same then proceed, if no then there is a probability a claim being submitted but initiated

    this.tawuniyaGssService.generateReportInitiate(this.initiateModel.lossMonth).subscribe(initiateModel => {
      console.log('initiateModel: ', initiateModel)
      console.log('this.initiateModel: ', this.initiateModel)
      if (initiateModel.totalNet.value !== this.initiateModel.totalNet.value) {
        this.sharedServices.loadingChanged.next(false);
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Fail", 'Total Net Amount has been changed after last GSS initiation, kindly reinitiate the report to get the lastest GSS report.', true)).subscribe(closed => {
        });
      } else {
        this.confirm(vatForm)
      }
    }, err => {
      if (err && err.error && err.error.message) {
        this.sharedServices.loadingChanged.next(false);
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Fail", err.error.message, true)).subscribe(closed => {
        });;
      } else {
        this.sharedServices.loadingChanged.next(false);
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Fail", 'Internal Server error while validating before confirming GSS', true)).subscribe(closed => {
        });;
      }
    });
  }

  private confirm(vatForm) {
    console.log('vatForm', vatForm);

    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.gssConfirmReport(this.getFormData(vatForm)).subscribe(data => {

      this.initiateModel.status = 'pending'
      this.sharedServices.loadingChanged.next(false);
      this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Success", data.message, false));
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Fail", err.error.message, true));

      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Fail", 'Internal Server error', true));

      }
    });
  }

  getFormData(vatForm): FormData {
    var formData: any = new FormData();
    let confirmRequestModel: GSSConfirmationRequest =
    {
      providerId: localStorage.getItem('provider_id'),
      userName: localStorage.getItem('auth_username'),
      lossMonth: this.lossMonth
    }

    let confirmationVatInfo: ConfirmationVatInfo =
    {
      claimCount: vatForm.claimCount,
      discount: vatForm.discount,
      grossAmount: vatForm.grossAmount,
      nonTaxableAmount: vatForm.nonTaxableAmount,
      taxableAmount: vatForm.taxableAmount,
      vatNo: vatForm.vatNo,
      patientShare: vatForm.patientShare
    }
    formData.append("vatInfoFile", vatForm.vatInvoice);
    formData.append("confirmRequestModel", new Blob([JSON.stringify(confirmRequestModel)], { type: 'application/json' }));
    formData.append("confirmationVatInfo", new Blob([JSON.stringify(confirmationVatInfo)], { type: 'application/json' }));
    return formData;
  }

  getStatus(): string {
    if (this.initiateModel) {
      return this.initiateModel.status.trim()
    }
    return ''
  }

  isNew(): boolean {
    return this.getStatus().toLowerCase() === 'new'
  }
  isSigned(): boolean {
    return this.getStatus().toLowerCase() === 'signed'
  }
  isConfirmed(): boolean {
    return this.getStatus().toLowerCase() === 'confirmed'
  }
  isRejected(): boolean {
    return this.getStatus().toLowerCase() === 'rejected'
  }
  isPending(): boolean {
    return this.getStatus().toLowerCase() === 'pending'
  }

  disabledConfirmBtn(): boolean {
    return (!this.isNew() && !this.isRejected()) || this.isInquiry
  }



}