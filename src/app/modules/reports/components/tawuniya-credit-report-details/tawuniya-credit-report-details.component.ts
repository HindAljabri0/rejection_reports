import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTabChangeEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CreditReportSummaryResponse } from 'src/app/models/tawuniyaCreditReportModels/creditReportSummaryResponse';
import { DeductedService } from 'src/app/models/tawuniyaCreditReportModels/detuctedServices';
import { RejectedService } from 'src/app/models/tawuniyaCreditReportModels/rejectedServices';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { SharedServices } from 'src/app/services/shared.services';
import { TawuniyaCreditReportDetailsDialogComponent } from '../tawuniya-credit-report-details-dialog/tawuniya-credit-report-details-dialog.component';
import { TawuniyaCreditReportErrorsDialogComponent } from '../tawuniya-credit-report-errors-dialog/tawuniya-credit-report-errors-dialog.component';
import { CreditReportUploadModel } from 'src/app/models/creditReportUpload';
import { MessageDialogComponent } from 'src/app/components/dialogs/message-dialog/message-dialog.component';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

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

  selectionControl: {
    deducted: {
      selections: string[],
      countInCurrentPage: number,
      allCheckBoxIsChecked: boolean,
      allCheckBoxIsIndeterminate: boolean
    },
    rejected: {
      selections: string[],
      countInCurrentPage: number,
      allCheckBoxIsChecked: boolean,
      allCheckBoxIsIndeterminate: boolean
    }
  } = {
      deducted: {
        selections: [],
        countInCurrentPage: 0,
        allCheckBoxIsChecked: false,
        allCheckBoxIsIndeterminate: false
      },
      rejected: {
        selections: [],
        countInCurrentPage: 0,
        allCheckBoxIsChecked: false,
        allCheckBoxIsIndeterminate: false
      }
    }

  disagreeComment: string = '';

  constructor(
    private dialog: MatDialog,
    private routeActive: ActivatedRoute,
    private creditReportService: CreditReportService,
    private sharedServices: SharedServices,
    private dialogService: DialogService
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
        this.fetchServices('deducted-services', true)
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        console.log(errorEvent.error);
      }

      this.sharedServices.loadingChanged.next(false);
    })
  }

  fetchServices(serviceType: 'deducted-services' | 'rejected-services', callAgain?: boolean) {
    if (this.sharedServices.loading) return;

    this.sharedServices.loadingChanged.next(true);
    this.creditReportService.getTawuniyaCreditReportServices(
      this.sharedServices.providerId,
      this.batchId,
      serviceType,
      this.paginationControl[serviceType].currentPage, 10).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.sharedServices.loadingChanged.next(false);
          if (serviceType == 'deducted-services') {
            this.deductedServices = event.body['content'] as DeductedService[];
            this.deductedServices.forEach(service => service.newComments = service.comments);
            this.selectionControl.deducted.countInCurrentPage = this.deductedServices.filter(service => this.selectionControl.deducted.selections.includes(service.id.serialno)).length;
            this.setAllCheckBoxIsIndeterminate('deducted');
          } else {
            this.rejectedServices = event.body['content'] as RejectedService[];
            this.rejectedServices.forEach(service => service.newComments = service.comments);
            this.selectionControl.rejected.countInCurrentPage = this.rejectedServices.filter(service => this.selectionControl.rejected.selections.includes(service.id.serialno)).length;
            this.setAllCheckBoxIsIndeterminate('rejected');
          }
          this.paginationControl[serviceType].currentPage = event.body['number'];
          this.paginationControl[serviceType].numberOfPages = event.body['totalPages'];

          if (callAgain) {
            this.fetchServices('rejected-services');
          }
        }
      }, errorEvent => {
        if (errorEvent instanceof HttpErrorResponse) {
          console.log(errorEvent.error);
        }

        this.sharedServices.loadingChanged.next(false);
      });
  }
  showClaim(claimno: string) {
    window.open(`${location.protocol}//${location.host}/${location.pathname.split('/')[1]}/claims/find?claimno=${claimno}`);
  }
  openDetailsDialog(event, serialNo, serviceType: 'rejected' | 'deducted') {
    event.preventDefault();
    const batchReferenceNumber = this.data.providercreditReportInformation.batchreferenceno;
    const dialogRef = this.dialog.open(TawuniyaCreditReportDetailsDialogComponent, { panelClass: ['primary-dialog', 'dialog-xl'], data: { batchReferenceNumber, serialNo, serviceType } });
  }

  fixDataDates() {
    this.data.providercreditReportInformation.receiveddate = this.stringToDate(this.data.providercreditReportInformation.receiveddate);
    this.data.providercreditReportInformation.batchreceiveddate = this.stringToDate(this.data.providercreditReportInformation.batchreceiveddate);
    this.data.providercreditReportInformation.lossmonth = this.stringToDate(this.data.providercreditReportInformation.lossmonth);
  }
  submit() {
    if (this.sharedServices.loading)
      return;
    this.sharedServices.loadingChanged.next(true);
    this.creditReportService.submitTawuniyaCreditReport(this.sharedServices.providerId, this.batchId).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        location.reload();
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        console.log(errorEvent.error);
      }
      this.sharedServices.loadingChanged.next(false);

    }
    );

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
      this.fetchServices(this.selectedServiceTab);
    }
  }
  goToPrePage() {
    if (this.paginationControl[this.selectedServiceTab].currentPage != 0) {
      this.paginationControl[this.selectedServiceTab].currentPage = this.paginationControl[this.selectedServiceTab].currentPage - 1;
      this.fetchServices(this.selectedServiceTab);
    }
  }
  goToNextPage() {
    if (this.paginationControl[this.selectedServiceTab].currentPage + 1 < this.paginationControl[this.selectedServiceTab].numberOfPages) {
      this.paginationControl[this.selectedServiceTab].currentPage = this.paginationControl[this.selectedServiceTab].currentPage + 1;
      this.fetchServices(this.selectedServiceTab);
    }
  }
  goToLastPage() {
    if (this.paginationControl[this.selectedServiceTab].currentPage != this.paginationControl[this.selectedServiceTab].numberOfPages - 1) {
      this.paginationControl[this.selectedServiceTab].currentPage = this.paginationControl[this.selectedServiceTab].numberOfPages - 1;
      this.fetchServices(this.selectedServiceTab);

    }
  }

  isEditableBatch() {
    return this.data != null && (this.data.providercreditReportInformation.status == 'NEW' ||
      this.data.providercreditReportInformation.status == 'UNDERREVIEW');
  }

  openErrorsDialog() {
    const data = new CreditReportUploadModel();
    data.batchId = this.batchId;
    const dialogRef = this.dialog.open(TawuniyaCreditReportErrorsDialogComponent, { panelClass: ['primary-dialog'], data: data });
  }

  selectAllInPage(type: 'deducted' | 'rejected') {
    if (type == 'deducted') {
      if (this.selectionControl.deducted.countInCurrentPage != this.deductedServices.length) {
        for (const service of this.deductedServices) {
          if (!this.selectionControl.deducted.selections.includes(service.id.serialno)) {
            this.selectService('deducted', service.id.serialno);
          }
        }
      } else {
        for (const service of this.deductedServices) {
          this.selectService('deducted', service.id.serialno);
        }
      }
    } else {
      if (this.selectionControl.rejected.countInCurrentPage != this.rejectedServices.length) {
        for (const service of this.rejectedServices) {
          if (!this.selectionControl.rejected.selections.includes(service.id.serialno)) {
            this.selectService('rejected', service.id.serialno);
          }
        }
      } else {
        for (const service of this.rejectedServices) {
          this.selectService('rejected', service.id.serialno);
        }
      }
    }
  }
  setAllCheckBoxIsIndeterminate(type: 'deducted' | 'rejected') {
    if (type == 'deducted') {
      if (this.deductedServices != null) {
        this.selectionControl.deducted.allCheckBoxIsIndeterminate = this.selectionControl.deducted.countInCurrentPage != this.deductedServices.length && this.selectionControl.deducted.countInCurrentPage != 0;
      } else { this.selectionControl.deducted.allCheckBoxIsIndeterminate = false; }
      this.setAllCheckBoxIsChecked(type);
    } else {
      if (this.rejectedServices != null) {
        this.selectionControl.rejected.allCheckBoxIsIndeterminate = this.selectionControl.rejected.countInCurrentPage != this.rejectedServices.length && this.selectionControl.rejected.countInCurrentPage != 0;
      } else { this.selectionControl.rejected.allCheckBoxIsIndeterminate = false; }
      this.setAllCheckBoxIsChecked(type);
    }
  }
  setAllCheckBoxIsChecked(type: 'deducted' | 'rejected') {
    if (type == 'deducted') {
      if (this.deductedServices != null) {
        this.selectionControl.deducted.allCheckBoxIsChecked = this.selectionControl.deducted.countInCurrentPage == this.deductedServices.length;
      } else { this.selectionControl.deducted.allCheckBoxIsChecked = false; }
    } else {
      if (this.rejectedServices != null) {
        this.selectionControl.rejected.allCheckBoxIsChecked = this.selectionControl.rejected.countInCurrentPage == this.rejectedServices.length;
      } else { this.selectionControl.rejected.allCheckBoxIsChecked = false; }
    }
  }
  selectService(type: 'deducted' | 'rejected', serialNo: string) {
    let control = type == 'deducted' ? this.selectionControl.deducted : this.selectionControl.rejected;
    if (!control.selections.includes(serialNo)) {
      control.selections.push(serialNo);
      control.countInCurrentPage++;
    } else {
      control.selections.splice(control.selections.indexOf(serialNo), 1);
      control.countInCurrentPage--
    }
    if (type == 'deducted') {
      this.selectionControl.deducted = control;
    } else {
      this.selectionControl.rejected = control;
    }
    this.setAllCheckBoxIsIndeterminate(type);
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedServiceTab = event.index == 0 ? 'deducted-services' : 'rejected-services';
  }

  agreeOnSelectedServices() {
    if (this.sharedServices.loading) return;
    this.sharedServices.loadingChanged.next(true);
    let control = this.selectedServiceTab == 'deducted-services' ? this.selectionControl.deducted : this.selectionControl.rejected;
    let services = this.selectedServiceTab == 'deducted-services' ? this.deductedServices : this.rejectedServices;
    this.creditReportService.sendTwaniyaReportsFeedbacks(
      this.sharedServices.providerId,
      this.data.providercreditReportInformation.batchreferenceno,
      this.selectedServiceTab == 'deducted-services' ? 'deducted' : 'rejected',
      {
        agree: true,
        serialNumbers: control.selections
      }
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        control.selections.forEach(serial => {
          services.find(service => service.id.serialno == serial).agree = 'Y';
        });
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: 'Colud not handle request. Please try again later.',
          isError: true
        });
      }
    });
  }

  disagreeOnSelectedServices() {
    if (this.sharedServices.loading) return;
    if (this.disagreeComment.trim().length == 0) {
      this.dialogService.openMessageDialog({
        title: '',
        message: 'Please enter a comment.',
        isError: true
      })
      return;
    }
    this.sharedServices.loadingChanged.next(true);
    let control = this.selectedServiceTab == 'deducted-services' ? this.selectionControl.deducted : this.selectionControl.rejected;
    let services = this.selectedServiceTab == 'deducted-services' ? this.deductedServices : this.rejectedServices;
    this.creditReportService.sendTwaniyaReportsFeedbacks(
      this.sharedServices.providerId,
      this.data.providercreditReportInformation.batchreferenceno,
      this.selectedServiceTab == 'deducted-services' ? 'deducted' : 'rejected',
      {
        agree: false,
        serialNumbers: control.selections,
        comment: this.disagreeComment
      }
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        control.selections.forEach(serial => {
          services.find(service => service.id.serialno == serial).agree = 'N';
          services.find(service => service.id.serialno == serial).comments = this.disagreeComment;
        });
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        this.dialogService.openMessageDialog({
          title: '',
          message: 'Colud not handle request. Please try again later.',
          isError: true
        });
      }
    });
  }
}
