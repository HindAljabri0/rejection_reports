import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { SharedServices } from 'src/app/services/shared.services';
import { InitiateResponse } from '../models/InitiateResponse.model';
import { TawuniyaGssService } from '../Services/tawuniya-gss.service';


@Component({
  selector: 'app-tawuniya-gss-report-details',
  templateUrl: './tawuniya-gss-report-details.component.html',
  styles: []
})
export class TawuniyaGssReportDetailsComponent implements OnInit, OnDestroy {

  timeleft: number;
  timer
  downloaded: boolean = false
  initiateModel: InitiateResponse;
  gssReferenceNumber: string;
  

  constructor(private activatedRoute: ActivatedRoute,
    private tawuniyaGssService: TawuniyaGssService,
    private sharedServices: SharedServices,
    private store: Store,
    private downloadService: DownloadService,
    private dialog: MatDialog,
    private router: Router,
    private dialogService: DialogService) { }

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.gssReferenceNumber = this.activatedRoute.snapshot.params.gssReferenceNumber;
    let isInquiry = this.activatedRoute.snapshot.queryParams.inquiry;
    if (isInquiry) {
      this.tawuniyaGssService.gssQueryDetails(this.gssReferenceNumber).subscribe( model => {
        console.log(model);
        this.initiateModel = model;
        this.sharedServices.loadingChanged.next(false);
      });
    } else {
     this.initiateGssReport();
    }
  }

  initiateGssReport() {
    let lossMonthAsDate: Date = new Date();
    let month = lossMonthAsDate.getMonth() == 0 ? 12 : lossMonthAsDate.getMonth()
    let year = lossMonthAsDate.getMonth() == 0 ? lossMonthAsDate.getFullYear() - 1 : lossMonthAsDate.getFullYear()
    let lossMonth = year + '/' + month;
       this.tawuniyaGssService.generateReportInitiate(lossMonth).subscribe(initiateModel =>{
        this.sharedServices.loadingChanged.next(false);
         if (!initiateModel) {
          this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", "Could not initiate GSS report, kindly try to regenerate GSS report again later", true)).subscribe(afterClose =>{
            this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
          });
          } else {
          this.initiateModel = initiateModel
          this.startConfirmationTimer()
        }
          
      }, error =>{
        this.sharedServices.loadingChanged.next(false);
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", error.error.message, true));
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
    clearInterval(this.timer);
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
    this.tawuniyaGssService.generateReportInitiate(this.initiateModel.lossMonth).subscribe(data => {
      this.initiateModel = data;
      this.sharedServices.loadingChanged.next(false);
      if (showMessage) {
        this.startConfirmationTimer()
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Generation Fail", err.error.message, true));
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Generation Fail", 'Internal Server error', true));
      }
    });
  }

  confirmReport() {
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
        this.confirm()
      }
    }, error => { });
  }

  private confirm() {
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.gssConfirmReport(this.gssReferenceNumber).subscribe(data => {
      console.log("data: ", data);
      this.initiateModel.status = 'signed'
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
}