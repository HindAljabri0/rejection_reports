import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DatePipe, Location } from '@angular/common';
import { AddFinalRejectionDialogComponent } from '../add-final-rejection-dialog/add-final-rejection-dialog.component';
import { AddReconciliationDialogComponent } from '../add-reconciliation-dialog/add-reconciliation-dialog.component';
import { ReconciliationReport } from 'src/app/models/reconciliationReport'
import { ReconciliationReportResponse } from 'src/app/models/reconciliationReportResponse'
import { ReconciliationService } from 'src/app/services/reconciliationService/reconciliation.service'
import { SharedServices } from 'src/app/services/shared.services';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormControl } from '@angular/forms';
import { ReconciliationAddPaymentComponent } from '../reconciliation-add-payment/reconciliation-add-payment.component';
@Component({
  selector: 'app-reconciliation-report',
  templateUrl: './reconciliation-report.component.html',
  styles: []
})
export class ReconciliationReportComponent implements OnInit {
  reconciliationReport = new ReconciliationReport();
  selectedPayerId = 'All';
  payersList: { id: string[] | string, name: string }[];
  selectedPayerName = 'All';
  selectedDate: Date;
  YearDatePickerTitle = 'year';
  currentDetailsOpen = -1;
  selectedReconciliationIdAndTotalDubmitted: any;
  reconciliationReportResponse: ReconciliationReportResponse[] = [];
  payerIdControl: FormControl = new FormControl();
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
  startDateController: FormControl = new FormControl();
  endDateController: FormControl = new FormControl();

  totalPages: number;
  page: number = 0;
  constructor(
    private reconciliationService: ReconciliationService,
    private dialog: MatDialog,
    private sharedService: SharedServices,
    private routeActive: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe,

  ) { }

  ngOnInit() {
    this.payersList = [];
    const allPayersIds = [];
    this.sharedService.getPayersList().map(value => {
      this.payersList.push({
        id: `${value.id}`,
        name: value.name
      });
      allPayersIds.push(`${value.id}`);
    });
    this.payersList.push({
      id: allPayersIds,
      name: 'All'
    });
    this.routeActive.queryParams.subscribe(params => {
      if (params.payer != undefined) {
        if (params.payer instanceof Array && params.payer.length > 1) {
          this.payerIdControl.setValue(allPayersIds);
        } else {
          this.payerIdControl.setValue(params.payer);
        }
      }
      if (params.startDate != null) {
        this.reconciliationReport.startDate = params.startDate;
      }
      if (params.endDate != null) {
        this.reconciliationReport.endDate = params.endDate;
      }
      if (params.page != null) {
        this.reconciliationReport.page = params.page;
      }
      if (params.size != null) {
        this.reconciliationReport.size = params.size;
      }
      this.startDateController.setValue(new Date());
      this.endDateController.setValue(new Date());


    });
  }
incrementYear(startDate){
  var year = new Date(startDate);
return new Date(year.setFullYear(year.getFullYear() +1));


}

  search() {

    console.log(this.payerIdControl.value)
    if (this.reconciliationReport.startDate == null || this.reconciliationReport.startDate == undefined)
      return

    this.reconciliationReportResponse = [];
    this.endDateController.setValue(this.incrementYear(this.startDateController.value));
    // this.editURL(this.reconciliationReport.startDate, this.reconciliationReport.endDate);
    this.reconciliationService.getReconciliationBtsearch(
      this.sharedService.providerId,
      this.payerIdControl.value,
      this.datePipe.transform(this.startDateController.value,'yyyy-MM-dd'),
      this.datePipe.transform(this.endDateController.value,'yyyy-MM-dd'),
      this.reconciliationReport.page,
      this.reconciliationReport.size
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.reconciliationReportResponse = event.body['content'] as ReconciliationReportResponse[];
          this.totalPages = event.body['totalPages'];

          this.sharedService.loadingChanged.next(false);
        }
      }
    }, err => {
      this.sharedService.loadingChanged.next(false);
      console.log(err);

    });
  }
  editURL(startDate?: string, endDate?: string) {
    let path = `/reconciliationService/reconciliation.service?`;

    if (this.payerIdControl.value != null) {
      path += `payer=${this.payerIdControl.value}&`;
    }
    if (startDate != null) {
      path += `from=${startDate}&`;
    }
    if (endDate != null) {
      path += `to=${endDate}`;
    }
    if (this.reconciliationReport.page > 0) {
      path += `&page=${this.reconciliationReport.page}`;
    }
    if (this.reconciliationReport.size > 10) {
      path += `&pageSize=${this.reconciliationReport.size}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }

  goToFirstPage() {
    this.page = 0;
    this.search();
  }

  goToPrePage() {
    this.page -= 1;
    this.search();
  }

  goToNextPage() {
    this.page += 1;
    this.search();
  }

  goToLastPage() {
    this.page = this.totalPages - 1;
    this.search();
  }


  openAddReconciliationDialog() {
    const dialogRef = this.dialog.open(AddReconciliationDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg'],
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.status) {
      }
    }, error => {

    });

  }

  openAddFinalRejectionDialog() {

    const dialogRef = this.dialog.open(AddFinalRejectionDialogComponent,
      {
        panelClass: ['primary-dialog', 'dialog-sm'],

        data: {
          id: this.selectedReconciliationIdAndTotalDubmitted.reconciliationId,
          total: this.selectedReconciliationIdAndTotalDubmitted.totalSubmitted

        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.status) {
        this.search();
      }
    }, error => {


    });
  }
  openAddPaymentDialog() {
    const dialogRef = this.dialog.open(ReconciliationAddPaymentComponent,
      {
        panelClass: ['primary-dialog'],

        data: {
          id: this.selectedReconciliationIdAndTotalDubmitted.reconciliationId,
          payerId: this.selectedReconciliationIdAndTotalDubmitted.payerId
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.status) {
        this.search();
      }
    }, error => {

    });
  }


  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.reconciliationReport.endDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.reconciliationReport.endDate = '';
      }
    }
  }

}



