import { Component, OnInit } from '@angular/core';
import { DateAdapter, MatDatepicker, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SharedServices } from 'src/app/services/shared.services';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { InitiateResponse } from './models/InitiateResponse.model';
import { TawuniyaGssService } from './Services/tawuniya-gss.service';
import { TawuniyaGssGenerateReportDialogComponent } from './tawuniya-gss-generate-report-dialog/tawuniya-gss-generate-report-dialog.component';
import { Moment } from 'moment';
import * as _moment from 'moment';
import { FormControl, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { DownloadStatus } from 'src/app/models/downloadRequest';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-tawuniya-gss',
  templateUrl: './tawuniya-gss.component.html',
  styles: [],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class TawuniyaGssComponent implements OnInit {

  initiateModel: Array<InitiateResponse> = [];
  fromDate = new FormControl(null, Validators.required);
  toDate = new FormControl(null, Validators.required);
  detailTopActionIcon = 'ic-download.svg';

  constructor(
    private dialog: MatDialog,
    private tawuniyaGssService: TawuniyaGssService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private downloadService: DownloadService
  ) { }

  ngOnInit() {
  }

  openGenerateReportDialog() {
    const dialogRef = this.dialog.open(TawuniyaGssGenerateReportDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-sm']
    })
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      if (data != undefined) {
        this.sharedServices.loadingChanged.next(true);
        this.tawuniyaGssService.generateReportInitiate(data).subscribe((data: InitiateResponse) => {
          console.log(data);
          this.initiateModel.push(data);
          this.sharedServices.loadingChanged.next(false);
          return this.store.dispatch(showSnackBarMessage({ message: 'Tawuniya Report Initiated Successfully!' }));
        }, err => {
          console.log(err);
          this.sharedServices.loadingChanged.next(false);
          return this.store.dispatch(showSnackBarMessage({ message: err.error.error_description }));
        })
      }
    });
  }

  openDetailView(model: InitiateResponse) {
    this.router.navigate([model.gssReferenceNumber, "report-details"], { relativeTo: this.activatedRoute });
  }

  searchQuerySummary() {
    this.fromDate.markAllAsTouched()
    this.toDate.markAllAsTouched()
    if (this.fromDate.invalid || this.toDate.invalid) {
      return;
    }
    const newFromDate = new Date(this.fromDate.value);
    const newToDate = new Date(this.toDate.value);

    if (!this.valid(newFromDate, newToDate)) {
      return this.store.dispatch(showSnackBarMessage({ message: "From Date can not be after To Date" }));
    }
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.gssQuerySummary(newFromDate.getFullYear() + "/" + (newFromDate.getMonth() + 1), newToDate.getFullYear() + "/" + (newToDate.getMonth() + 1)).subscribe(data => {
      console.log(data);
      this.initiateModel = [];
      this.initiateModel = data;
      this.sharedServices.loadingChanged.next(false);
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.text) {
        return this.store.dispatch(showSnackBarMessage({ message: err.error.text }));
      } else {
        return this.store.dispatch(showSnackBarMessage({ message: 'Internal Server error' }));
      }

    });
  }

  valid(newFromDate: Date, newToDate: Date): boolean {
    var months;
    months = (newToDate.getFullYear() - newFromDate.getFullYear()) * 12;
    months -= newFromDate.getMonth();
    months += newToDate.getMonth();
    return months >= 0;
  }

  downloadData(data: InitiateResponse) {
    this.downloadService.startGeneratingDownloadFile(this.tawuniyaGssService.downloadPDF(data.gssReferenceNumber))
      .subscribe(status => {
        if (status != DownloadStatus.ERROR) {
          this.detailTopActionIcon = 'ic-check-circle.svg';
        } else {
          this.detailTopActionIcon = 'ic-download.svg';
        }
      });
  }
}
