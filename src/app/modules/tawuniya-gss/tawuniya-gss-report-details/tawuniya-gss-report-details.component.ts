import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { SharedServices } from 'src/app/services/shared.services';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
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
  // signed: boolean = false

  constructor(private activatedRoute: ActivatedRoute,
    private tawuniyaGssService: TawuniyaGssService,
    private sharedServices: SharedServices,
    private store: Store,
    private downloadService: DownloadService,
    private dialog: MatDialog,
    private router: Router) { }
    
    ngOnInit() {
    this.gssReferenceNumber = this.activatedRoute.snapshot.params.gssReferenceNumber;
    this.initiateModel = this.tawuniyaGssService.getInitiatedResponse();
      if(!this.initiateModel){
        this.store.dispatch(showSnackBarMessage({ message: "Could not initiate GSS report, kindly try to regenerate GSS report again later" }));
        this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
      }
    this.startConfirmationTimer()
  }
  startConfirmationTimer() {
      this.timeleft = 60
this.timer = setInterval(() => {
  if(this.timeleft > 0) {
    this.timeleft--;
  } else {
    clearInterval(this.timer);
  }
},1000)
    }
    
  

  ngOnDestroy() {
    clearInterval(this.timer);
 }

 downloadData() {
  if(this.downloaded){
    return;
  }
  this.downloadService.startGeneratingDownloadFile(this.tawuniyaGssService.downloadPDF(this.initiateModel))
    .subscribe(status => {

      if (status != DownloadStatus.ERROR) {
        this.downloaded = true
      //   this.detailTopActionIcon = 'ic-check-circle.svg';
      // } else {
      //   this.detailTopActionIcon = 'ic-download.svg';
      }
    });
}
  
  generateReport(showMessage: Boolean) {
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.generateReportInitiate(this.initiateModel.lossMonth).subscribe(data => {
      this.initiateModel = data;
      // console.log(this.initiateModel);
      this.sharedServices.loadingChanged.next(false);
      if (showMessage) {
        this.startConfirmationTimer()
        return this.store.dispatch(showSnackBarMessage({ message: "GSS Report Generated Successfully!" }));
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.text) {
        return this.store.dispatch(showSnackBarMessage({ message: err.error.text }));
      } else {
        return this.store.dispatch(showSnackBarMessage({ message: 'Internal Server error' }));
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
      // this.generateReport(false);
      return this.store.dispatch(showSnackBarMessage({ message: data.message }));
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.text) {
        return this.store.dispatch(showSnackBarMessage({ message: err.error.text }));
      } else {
        return this.store.dispatch(showSnackBarMessage({ message: 'Internal Server error' }));
      }
    });
  }
}
