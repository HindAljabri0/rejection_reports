import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CreditReportSummaryResponse } from 'src/app/models/tawuniyaCreditReportModels/creditReportSummaryResponse';
import { DeductedService } from 'src/app/models/tawuniyaCreditReportModels/detuctedServices';
import { RejectedService } from 'src/app/models/tawuniyaCreditReportModels/rejectedServices';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { SharedServices } from 'src/app/services/shared.services';
import { TawuniyaCreditReportDetailsDialogComponent } from '../tawuniya-credit-report-details-dialog/tawuniya-credit-report-details-dialog.component';

@Component({
  selector: 'app-tawuniya-credit-report-details',
  templateUrl: './tawuniya-credit-report-details.component.html',
  styles: []
})
export class TawuniyaCreditReportDetailsComponent implements OnInit {

  batchId: string;

  data: CreditReportSummaryResponse;

  deductedServices: DeductedService[] = [];
  rejectedServices: RejectedService[] = [];

  selectedServiceTab: 'deducted-services' | 'rejected-services' = 'deducted-services';

  paginationControl: {
    'deducted-services': {
      currentPage: number,
      numberOfPages: number
    },
    'rejected-services': {
      currentPage: number,
      numberOfPages: number
    }
  } = {
      'deducted-services': {
        currentPage: 0,
        numberOfPages: 0
      },
      'rejected-services': {
        currentPage: 0,
        numberOfPages: 0
      }
    };

  constructor(
    private dialog: MatDialog,
    private routeActive: ActivatedRoute,
    private creditReportService: CreditReportService,
    private sharedServices: SharedServices,
  ) { }

  ngOnInit() {
    this.routeActive.params.subscribe(value => {
      this.batchId = value.batchId;
      this.fetchData();
    }).unsubscribe();
  }


  fetchData() {
    if (this.sharedServices.loading) return;

    this.sharedServices.loadingChanged.next(true);
    this.creditReportService.getTawuniyaCreditReport(this.sharedServices.providerId, this.batchId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.data = event.body as CreditReportSummaryResponse;
        this.fixDataDates();
        this.sharedServices.loadingChanged.next(false);
        this.fetchServices();
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        console.log(errorEvent.error);
      }

      this.sharedServices.loadingChanged.next(false);
    })
  }

  fetchServices() {
    if (this.sharedServices.loading) return;

    this.sharedServices.loadingChanged.next(true);
    this.creditReportService.getTawuniyaCreditReportServices(
      this.sharedServices.providerId,
      this.batchId,
      this.selectedServiceTab,
      this.paginationControl[this.selectedServiceTab].currentPage, 10).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.sharedServices.loadingChanged.next(false);
          if (this.selectedServiceTab == 'deducted-services') {
            this.deductedServices = event.body['content'] as DeductedService[];
          } else {
            this.rejectedServices = event.body['content'] as RejectedService[];
          }
          this.paginationControl[this.selectedServiceTab].currentPage = event.body['number'];
          this.paginationControl[this.selectedServiceTab].numberOfPages = event.body['totalPages'];
        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {
          console.log(errorEvent.error);
        }

        this.sharedServices.loadingChanged.next(false);
      });
  }

  openDetailsDialog(event, batchReferenceNumber, serialNo, serviceType: 'rejected' | 'deducted') {
    event.preventDefault();
    const dialogRef = this.dialog.open(TawuniyaCreditReportDetailsDialogComponent, { panelClass: ['primary-dialog', 'dialog-md'], data: { batchReferenceNumber, serialNo, serviceType } });
  }

  fixDataDates() {
    this.data.providercreditReportInformation.receiveddate = this.stringToDate(this.data.providercreditReportInformation.receiveddate);
    this.data.providercreditReportInformation.batchreceiveddate = this.stringToDate(this.data.providercreditReportInformation.batchreceiveddate);
    this.data.providercreditReportInformation.lossmonth = this.stringToDate(this.data.providercreditReportInformation.lossmonth);
  }

  stringToDate(date: any) {
    if (date != null) {
      try {
        return new Date(date);
      } catch (e) {

      }
    }
    return date;
  }

  isDate(object: any) {
    return object != null && object instanceof Date;
  }

  goToFirstPage() {
    if (this.paginationControl[this.selectedServiceTab].currentPage != 0) {
      this.paginationControl[this.selectedServiceTab].currentPage = 0;
      this.fetchServices();
    }
  }
  goToPrePage() {
    if (this.paginationControl[this.selectedServiceTab].currentPage != 0) {
      this.paginationControl[this.selectedServiceTab].currentPage = this.paginationControl[this.selectedServiceTab].currentPage - 1;
      this.fetchServices();
    }
  }
  goToNextPage() {
    if (this.paginationControl[this.selectedServiceTab].currentPage + 1 < this.paginationControl[this.selectedServiceTab].numberOfPages) {
      this.paginationControl[this.selectedServiceTab].currentPage = this.paginationControl[this.selectedServiceTab].currentPage + 1;
      this.fetchServices();
    }
  }
  goToLastPage() {
    if (this.paginationControl[this.selectedServiceTab].currentPage != this.paginationControl[this.selectedServiceTab].numberOfPages - 1) {
      this.paginationControl[this.selectedServiceTab].currentPage = this.paginationControl[this.selectedServiceTab].numberOfPages - 1;
      this.fetchServices();

    }
  }

}
