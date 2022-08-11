import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { SharedServices } from 'src/app/services/shared.services';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { InitiateResponse } from './models/InitiateResponse.model';
import { TawuniyaGssService } from './Services/tawuniya-gss.service';

@Component({
  selector: 'app-tawuniya-gss',
  templateUrl: './tawuniya-gss.component.html',
  styles: []
})
export class TawuniyaGssComponent implements OnInit {

  initiateModel: Array<InitiateResponse> = [];
  fromDateMonth = new FormControl(null, Validators.required);
  toDateMonth = new FormControl(null, Validators.required);
  detailTopActionIcon = 'ic-download.svg';
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
  minDate: any;

  constructor(
    private dialog: MatDialog,
    private tawuniyaGssService: TawuniyaGssService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private downloadService: DownloadService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
  }

  openGenerateReportDialog() {
    let lossMonthAsDate: Date = new Date();
    let month = lossMonthAsDate.getMonth() == 0 ? 12 : lossMonthAsDate.getMonth()
    let year = lossMonthAsDate.getMonth() == 0 ? lossMonthAsDate.getFullYear() - 1 : lossMonthAsDate.getFullYear()
    let lossMonth = year + '/' + month;
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.generateReportInitiate(lossMonth).subscribe((data: InitiateResponse) => {
      this.router.navigate([encodeURIComponent(data.gssReferenceNumber), "report-details"], { relativeTo: this.activatedRoute });
      this.sharedServices.loadingChanged.next(false);
    }, err => {
      console.log(err);
      this.sharedServices.loadingChanged.next(false);
      this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", err.error.message, true));
    })
  }

  openDetailView(model: InitiateResponse) {
    this.router.navigate([model.gssReferenceNumber, "report-details"], { relativeTo: this.activatedRoute, queryParams: { inquiry: 'true' } });
  }

  searchQuerySummary() {
    if (this.fromDateMonth.invalid || this.toDateMonth.invalid) {
      return;
    }
    const newFromDate = new Date(this.fromDateMonth.value);
    const newToDate = new Date(this.toDateMonth.value);

    if (!this.valid(newFromDate, newToDate)) {
      return this.store.dispatch(showSnackBarMessage({ message: "From Date can not be after To Date" }));
    }

    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.gssQuerySummary(newFromDate.getFullYear() + "/" + (newFromDate.getMonth() + 1), newToDate.getFullYear() + "/" + (newToDate.getMonth() + 1)).subscribe(data => {
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
    this.downloadService.startGeneratingDownloadFile(this.tawuniyaGssService.downloadPDF(data))
      .subscribe(status => {
        if (status != DownloadStatus.ERROR) {
          this.detailTopActionIcon = 'ic-check-circle.svg';
        } else {
          this.detailTopActionIcon = 'ic-download.svg';
        }
      });
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  dateValidation(event: any) {
    this.minDate = new Date(event);
    this.minDate = new Date(this.minDate.setMonth(this.minDate.getMonth()));
  }

  getEmptyStateMessage() {
    return 'Please apply the filter and generate the report.';
  }
}
