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
import { environment } from 'src/environments/environment';
import { HttpResponse } from '@angular/common/http';


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
    this.tawuniyaGssService.isAnnouncementUpdateAvailable("1").subscribe(res => {
      if (!res) {
        this.showDialogAndSaveResponse();
      }
    });
  }

  getUrlLink() {
    if (environment.name === 'oci_qa' || environment.name === 'dev') return 'https://qa-jisr.waseel.com';
    else if (environment.name === 'oci_stg') return 'https://stg-jisr.waseel.com';
    else return 'https://jisr.waseel.com';
  }

  showDialogAndSaveResponse() {
    this.dialogService.openMessageDialog({
      title: '',
      message: '<div style="font-size:16px;line-height:22px;color:#222"><img src="./assets/tawuniya-logo.svg" class="d-block mb-4" height="48" width="162" /><span class="medium">Dear Respected Providers,</span>\n\nIn the spirit of enhancing the communication process by Tawuniya with its partners of healthcare providers, it encourages all providers to use the Providers Portal that has been released recently. Which includes the following services:\n\n<ul class="unordered-list"><li>Contracting</li><li>Medical Services</li><li>Update of Provider Information</li><li>Meeting Requests</li><li>Announcements and Circulars</li><li>Provider Performance</li><li>Display rejection reports and respond</li></ul>\nAlso, kindly be informed that the Rejection Report Service will be available through the providers’ portal, and it will be disabled in the current one effective <span class="semibold text-primary">15-06-2023</span>.\n\nYou can access the provider portal from <a class="primary-link semibold" target="_blank" href="' + this.getUrlLink() + '">here</a></div>',
      isError: false,
      withButtons: true,
      confirmButtonText: 'Acknowledge',
      cancelButtonText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.tawuniyaGssService.updateAnnouncement("1").toPromise();
      }
    });
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
        this.router.navigate([encodeURIComponent(gssReportResponse.gssReferenceNumber), "report-details"], { relativeTo: this.activatedRoute, queryParams: { inquiry: 'true', lossMonth: encodeURIComponent(gssReportResponse.lossMonth) } });
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