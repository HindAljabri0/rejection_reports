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
import { GssReportResponse } from './models/InitiateResponse.model';
import { TawuniyaGssService } from './Services/tawuniya-gss.service';
import { TawuniyaGssGenerateReportDialogComponent } from './tawuniya-gss-generate-report-dialog/tawuniya-gss-generate-report-dialog.component';
import { VatInfoDialogComponent } from './vat-info-dialog/vat-info-dialog.component';


@Component({
  selector: 'app-tawuniya-gss',
  templateUrl: './tawuniya-gss.component.html',
  styles: []
})
export class TawuniyaGssComponent implements OnInit {

  gssReportResponses: Array<GssReportResponse> = [];
  fromDateMonth = new FormControl(null, Validators.required);
  toDateMonth = new FormControl(null, Validators.required);
  detailTopActionIcon = 'ic-download.svg';
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
  minDate: any;
  formIsSubmitted: boolean = false

  constructor(
    private tawuniyaGssService: TawuniyaGssService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private downloadService: DownloadService,
    private dialogService: DialogService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }


  openGenerateReportDialog() {
    const dialogRef = this.dialog.open(TawuniyaGssGenerateReportDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-sm']
    })
    dialogRef.afterClosed().subscribe(lossMonth => {
      if (lossMonth) {
        this.handleInitRequest(lossMonth);
      }
    });
  }

  private handleInitRequest(lossMonth) {
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.generateReportInitiate(lossMonth).subscribe((gssReportResponse: GssReportResponse) => {
    this.sharedServices.loadingChanged.next(false);
      this.handleGssReportResponse(gssReportResponse, false)
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", err.error.message, true));
      } else if (err && err.error instanceof ProgressEvent) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", 'Could not reach server at the moment. Please try again later', true));
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", ' unknown error!', true));
      }
    })
  }

  handleGssReportResponse(gssReportResponse: GssReportResponse, isInquiry: boolean) {
    let netAmountHasData: boolean = !!gssReportResponse && !!gssReportResponse.vatInformation && !!gssReportResponse.vatInformation.totalNet && !!gssReportResponse.vatInformation.totalNet.value;
    let gssReportIsProcessable: boolean = this.tawuniyaGssService.isGssProcessable(gssReportResponse.lossMonth, gssReportResponse.status);
    if (!netAmountHasData && gssReportIsProcessable) {
      this.sharedServices.loadingChanged.next(false);
      this.dialog.open(VatInfoDialogComponent, {
        panelClass: ['primary-dialog', 'dialog-lg'],
        data: {
          gssReportResponse: gssReportResponse,
          editMode: true,
          editable: true
        }
      })
    } else {
      if (isInquiry) {
        this.router.navigate([encodeURIComponent(gssReportResponse.gssReferenceNumber), "report-details"], { relativeTo: this.activatedRoute, queryParams: { inquiry: 'true' } });
        this.sharedServices.loadingChanged.next(false);
      } else {
        this.router.navigate([encodeURIComponent(gssReportResponse.gssReferenceNumber), "report-details"], { relativeTo: this.activatedRoute, queryParams: { lossMonth: encodeURIComponent(gssReportResponse.lossMonth) } });
      }

    }
  }

  openDetailView(model: GssReportResponse) {
    // this.tawuniyaGssService.resetModels();
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.gssQueryDetails(model.gssReferenceNumber).subscribe(model => {
      this.handleGssReportResponse(model, true)
    }, error => {
      this.sharedServices.loadingChanged.next(false);
      if (error && error.error && error.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Query Fail", error.error.message, true));
      } else if (error && error.error instanceof ProgressEvent) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Query Fail", 'Could not reach server at the moment. Please try again later', true));
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Query Fail", 'Internal Server error', true));
      }
    });
  }

  searchQuerySummary() {
    const newFromDate = new Date(this.fromDateMonth.value);
    const newToDate = new Date(this.toDateMonth.value);
    if (newFromDate && newToDate && !this.valid(newFromDate, newToDate)) {
      this.fromDateMonth.setErrors({ overlapped: true })
      return
    } else {
      this.fromDateMonth.setErrors({ overlapped: null })
      this.fromDateMonth.updateValueAndValidity()
    }
    if (this.fromDateMonth.invalid || this.toDateMonth.invalid) {
      return;
    }


    this.sharedServices.loadingChanged.next(true);
    let fromDate: string = newFromDate.getFullYear() + "-" + (newFromDate.getMonth() + 1);
    let toDate: string = newToDate.getFullYear() + "-" + (newToDate.getMonth() + 1);
    this.tawuniyaGssService.gssQuerySummary(fromDate, toDate).subscribe(gssReportResponses => {
      this.gssReportResponses = gssReportResponses;
      this.formIsSubmitted = true
      this.sharedServices.loadingChanged.next(false);
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Search Fail", err.error.message, true))
      } else if (err && err.error instanceof ProgressEvent) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Search Fail", 'Could not reach server at the moment. Please try again later', true));
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Search Fail", 'Internal Server error', true))
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

  downloadData(data: GssReportResponse) {
    this.tawuniyaGssService.gssQueryDetails(data.gssReferenceNumber).subscribe(detailRespons => {
      this.downloadService.startGeneratingDownloadFile(this.tawuniyaGssService.downloadPDF(detailRespons))
        .subscribe(status => {
          if (status != DownloadStatus.ERROR) {
            this.detailTopActionIcon = 'ic-check-circle.svg';
          } else {
            this.detailTopActionIcon = 'ic-download.svg';
          }
        });
    })
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


  searchResponseIsNull() {

  }

  resultHasValue() {
    return this.gssReportResponses && this.gssReportResponses.length > 0 && !this.gssReportResponses.every(element => !element)
  }


}
