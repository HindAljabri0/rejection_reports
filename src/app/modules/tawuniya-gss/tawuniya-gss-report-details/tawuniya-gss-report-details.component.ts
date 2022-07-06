import { Component, OnInit } from '@angular/core';
import { DateAdapter, MatDatepicker, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SharedServices } from 'src/app/services/shared.services';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { InitiateResponse } from '../models/InitiateResponse.model';
import { TawuniyaGssService } from '../Services/tawuniya-gss.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-tawuniya-gss-report-details',
  templateUrl: './tawuniya-gss-report-details.component.html',
  styles: []
})
export class TawuniyaGssReportDetailsComponent implements OnInit {

  initiateModel: InitiateResponse = new InitiateResponse();
  gssReferenceNumber: string;

  constructor(private activatedRoute: ActivatedRoute, private tawuniyaGssService: TawuniyaGssService, private sharedServices: SharedServices, private store: Store) { }

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
    });
  }

  confirmReport() {
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.gssConfirmReport(this.gssReferenceNumber).subscribe(data => {
      this.sharedServices.loadingChanged.next(false);
      return this.store.dispatch(showSnackBarMessage({ message: data.error.text }));
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      return this.store.dispatch(showSnackBarMessage({ message: err.error.text }));
    });
  }
}
