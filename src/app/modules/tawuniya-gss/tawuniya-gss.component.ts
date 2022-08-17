import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DownloadStatus } from 'src/app/models/downloadRequest';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { DownloadService } from 'src/app/services/downloadService/download.service';
import { SharedServices } from 'src/app/services/shared.services';
import { InitiateResponse } from './models/InitiateResponse.model';
import { TawuniyaGssService } from './Services/tawuniya-gss.service';
import { environment } from 'src/environments/environment';


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
  envProd = false;
  envStaging = false;
  formIsSubmitted: boolean = false

  constructor(
    private tawuniyaGssService: TawuniyaGssService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private downloadService: DownloadService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    this.envProd = (environment.name == 'oci_prod' || environment.name == 'prod');
    this.envStaging = (environment.name == 'oci_staging' || environment.name == 'staging');
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

      // return this.store.dispatch(showSnackBarMessage({ message: "From Date can not be after To Date" }));
      this.fromDateMonth.setErrors({overlapped: true})
      
      return;
    }
    
    this.sharedServices.loadingChanged.next(true);
    this.tawuniyaGssService.gssQuerySummary(newFromDate.getFullYear() + "/" + (newFromDate.getMonth() + 1), newToDate.getFullYear() + "/" + (newToDate.getMonth() + 1)).subscribe(data => {
      this.formIsSubmitted = true
      this.initiateModel = data;
      this.sharedServices.loadingChanged.next(false);
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      if (err && err.error && err.error.message) {
        // return this.store.dispatch(showSnackBarMessage({ message: err.error.text }));
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Search Fail", err.error.message, true))
      } else {
        this.dialogService.openMessageDialog(new MessageDialogData("GSS Search Fail", 'Internal Server error', true))

        // return this.store.dispatch(showSnackBarMessage({ message: 'Internal Server error' }));
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
    this.tawuniyaGssService.gssQueryDetails(data.gssReferenceNumber).subscribe(detailRespons =>{
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

  getEmptyStateMessage() {
    return 'No GSS reports found with the requested search criteria!';
  }

  searchResponseIsNull(){
    
  }

  resultHasValue(){
    return this.initiateModel &&  this.initiateModel.length > 0 && !this.initiateModel.every(element => !element)
  }
  
 
}
