import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';


import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { SharedServices } from 'src/app/services/shared.services';
import { ConfirmationVatInfo, GSSConfirmationRequest } from '../models/confirmation-request.model';
import { GssReportResponse } from '../models/InitiateResponse.model';
import { TawuniyaGssService } from '../Services/tawuniya-gss.service';
import { VatInfoDialogComponent } from '../vat-info-dialog/vat-info-dialog.component';


@Component({
  selector: 'app-tawuniya-gss-report-details',
  templateUrl: './tawuniya-gss-report-details.component.html',
  styles: []
})
export class TawuniyaGssReportDetailsComponent implements OnInit, OnDestroy {

  timeleft: number;
  timer
  downloaded: boolean = false
  gssReportResponse: GssReportResponse;
  gssReferenceNumber: string;
  isInquiry: boolean = true;
  lossMonth: string = null;
  isGssProcessable: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private tawuniyaGssService: TawuniyaGssService,
    private sharedServices: SharedServices,
    private store: Store,
    private downloadService: DownloadService,
    private dialog: MatDialog,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.gssReferenceNumber = this.activatedRoute.snapshot.params.gssReferenceNumber;
    let isInquiry = this.activatedRoute.snapshot.queryParams.inquiry;
    this.lossMonth = decodeURIComponent(this.activatedRoute.snapshot.queryParams.lossMonth);
    console.log("lossMOnth : ", this.lossMonth);

    let gssReportResponse = this.tawuniyaGssService.getGssReportResponse()
    if (gssReportResponse) {
      this.gssReportResponse = gssReportResponse;
      this.setIsGssProcessable(gssReportResponse.lossMonth)
    } else if (this.isInquiry) {
      this.queryGssReport()
    } else {
      this.initiateGssReport(this.lossMonth);
    }
  }

  private queryGssReport() {
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.gssQueryDetails(this.gssReferenceNumber).subscribe(model => {
      this.gssReportResponse = model;
      this.lossMonth = model.lossMonth
      this.sharedServices.loadingChanged.next(false);
      this.setIsGssProcessable(model.lossMonth)
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      if (error && error.error && error.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Query Fail", error.error.message, true));
      } else if (error && error.error instanceof ProgressEvent) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", 'Could not reach server at the moment. Please try again later', true));
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Query Fail", 'Internal Server error', true));
      }
    });
  }

  initiateGssReport(lossMonth: string) {
    this.sharedServices.loadingChanged.next(true);

    this.tawuniyaGssService.generateReportInitiate(lossMonth).subscribe(gssReportResponse => {
      this.sharedServices.loadingChanged.next(false);
      if (gssReportResponse && gssReportResponse.vatInformation && gssReportResponse.vatInformation.totalNet && gssReportResponse.vatInformation.totalNet.value) {

        if (!gssReportResponse) {
          this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", "Could not initiate GSS report, kindly try to regenerate GSS report again later", true))
        } else {
          this.gssReportResponse = gssReportResponse
          this.setIsGssProcessable(gssReportResponse.lossMonth)
        }

      } else {
        this.router.navigate(['/tawuniya-gss']);
      }
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      if (error && error.error && error.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", error.error.message, true));
      } else if (error && error.error instanceof ProgressEvent) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", 'Could not reach server at the moment. Please try again later', true));
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", 'Internal Server error', true));
      }
    });
  }

  startConfirmationTimer() {
    this.timeleft = 60
    this.timer = setInterval(() => {
      if (this.timeleft > 0) {
        this.timeleft--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000)
  }

  ngOnDestroy() {
    this.tawuniyaGssService.resetModels();
  }

  downloadData() {
    if (this.downloaded) {
      return;
    }
    this.downloadService.startGeneratingDownloadFile(this.tawuniyaGssService.downloadPDF(this.gssReportResponse))
      .subscribe(status => {
        if (status != DownloadStatus.ERROR) {
          this.downloaded = true;
        }
      });
  }

  generateReport() {
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.generateReportInitiate(this.lossMonth).subscribe(data => {
      this.gssReportResponse = data;
      this.sharedServices.loadingChanged.next(false);
      if (showMessage) {
        this.startConfirmationTimer()
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", err.error.message, true));
      } else if (err && err.error instanceof ProgressEvent) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", 'Could not reach server at the moment. Please try again later', true));
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Generation Fail", 'Internal Server error', true));
      }
    });
  }

  onShowVatInformation() {
    const dialogRef = this.dialog.open(VatInfoDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg'],
      data: {
        gssReportResponse: this.gssReportResponse,
        editMode: false,
        editable: this.isGssProcessable
      }
    })
  }

  onConfirm() {
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
        this.validateAndConfirm()
      }
    }, error => { });
  }



  private validateAndConfirm() {
    // request another initiate and compare the two netAmount, if both are same then proceed, if no then there is a probability a claim being submitted but initiated
    this.sharedServices.loadingChanged.next(true);

    this.tawuniyaGssService.generateReportInitiate(this.gssReportResponse.lossMonth).subscribe(gssReportResponse => {
      // console.log('gssReportResponse: ', gssReportResponse)
      // console.log('this.gssReportResponse: ', this.gssReportResponse)
      if (gssReportResponse.totalNet.value !== this.gssReportResponse.totalNet.value) {
        this.sharedServices.loadingChanged.next(false);
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Fail", 'Total Net Amount has been changed after last GSS initiation, kindly reinitiate the report to get the lastest GSS report.', true)).subscribe(closed => {
        });
      } else {
        this.confirm()
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Fail", err.error.message, true)).subscribe(closed => {
        });;
      } else if (err && err.error instanceof ProgressEvent) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", 'Could not reach server at the moment. Please try again later', true));
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Fail", 'Internal Server error while validating before confirming GSS', true)).subscribe(closed => {
        });;
      }
    });
  }

  private confirm() {
    let requestBody = {
      'gssReportModel': this.gssReportResponse,
      'providerId': localStorage.getItem('provider_id'),
      'username': localStorage.getItem('auth_username')
    }
    this.tawuniyaGssService.gssConfirmReport(requestBody).subscribe(data => {
      this.gssReportResponse.status = 'pending'
      this.setIsGssProcessable(this.lossMonth);
      this.sharedServices.loadingChanged.next(false);
      this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Success", data.message, false));
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Confirmation Fail", err.error.message, true));

      } else if (err && err.error instanceof ProgressEvent) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", 'Could not reach server at the moment. Please try again later', true));
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
      username: localStorage.getItem('auth_username'),
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
    if (this.gssReportResponse) {
      return this.gssReportResponse.status.trim()
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

  setIsGssProcessable(lossMonth: string) {
    this.isGssProcessable = this.tawuniyaGssService.isGssProcessable(lossMonth, this.getStatus());
  }
}