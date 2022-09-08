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
import { InitiateResponse } from './models/InitiateResponse.model';
import { TawuniyaGssService } from './Services/tawuniya-gss.service';
import { TawuniyaGssGenerateReportDialogComponent } from './tawuniya-gss-generate-report-dialog/tawuniya-gss-generate-report-dialog.component';


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
      if (lossMonth != undefined) {
        console.log(`lossMonth: `, lossMonth);
        this.sharedServices.loadingChanged.next(true);
        this.tawuniyaGssService.generateReportInitiate(lossMonth).subscribe((data: InitiateResponse) => {
          this.router.navigate([encodeURIComponent(data.gssReferenceNumber), "report-details"], { relativeTo: this.activatedRoute });
          this.sharedServices.loadingChanged.next(false);
        }, err => {
          this.sharedServices.loadingChanged.next(false);
          this.dialogService.openMessageDialog(new MessageDialogData("GSS Initiation Fail", err.error.message, true));
        })
      }
    });
  }

  openDetailView(model: InitiateResponse) {
    this.router.navigate([model.gssReferenceNumber, "report-details"], { relativeTo: this.activatedRoute, queryParams: { inquiry: 'true' } });
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
    this.tawuniyaGssService.gssQuerySummary(newFromDate.getFullYear() + "/" + (newFromDate.getMonth() + 1), newToDate.getFullYear() + "/" + (newToDate.getMonth() + 1)).subscribe(data => {
      this.initiateModel = data;
      this.formIsSubmitted = true
      this.sharedServices.loadingChanged.next(false);
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.message) {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Search Fail", err.error.message, true))
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

  downloadData(data: InitiateResponse) {
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
    return this.initiateModel && this.initiateModel.length > 0 && !this.initiateModel.every(element => !element)
  }


}
