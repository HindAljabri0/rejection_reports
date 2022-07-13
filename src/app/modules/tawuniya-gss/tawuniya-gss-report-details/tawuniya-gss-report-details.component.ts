import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { SharedServices } from 'src/app/services/shared.services';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { InitiateResponse } from '../models/InitiateResponse.model';
import { TawuniyaGssService } from '../Services/tawuniya-gss.service';

@Component({
  selector: 'app-tawuniya-gss-report-details',
  templateUrl: './tawuniya-gss-report-details.component.html',
  styles: []
})
export class TawuniyaGssReportDetailsComponent implements OnInit {

  initiateModel: InitiateResponse = new InitiateResponse();
  gssReferenceNumber: string;

  constructor(private activatedRoute: ActivatedRoute,
    private tawuniyaGssService: TawuniyaGssService,
    private sharedServices: SharedServices,
    private store: Store,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.gssReferenceNumber = this.activatedRoute.snapshot.params.gssReferenceNumber;
    this.generateReport(false);
  }

  generateReport(showMessage: Boolean) {
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.gssQueryDetails(this.gssReferenceNumber).subscribe(data => {
      this.initiateModel = data;
      console.log(this.initiateModel);
      this.sharedServices.loadingChanged.next(false);
      if (showMessage) {
        return this.store.dispatch(showSnackBarMessage({ message: "GSS Report Re-Generated Successfully!" }));
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
        mainMessage: 'Are you sure you want to sign the GSS?',
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
      this.sharedServices.loadingChanged.next(false);
      this.generateReport(false);
      return this.store.dispatch(showSnackBarMessage({ message: data.error.text }));
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
