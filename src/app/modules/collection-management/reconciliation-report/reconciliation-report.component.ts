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
  sumOfTotalReceivableObj: any;
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


  decrementYear(startDate) {
    var year = new Date(startDate);
    return new Date(year.setFullYear(year.getFullYear() - 1));
  }

  search() {

    if (this.reconciliationReport.endDate == null || this.reconciliationReport.endDate == undefined) {
      return;
    }

    this.reconciliationReportResponse = [];
    // this.endDateController.setValue(this.incrementYear(this.reconciliationReport.startDate));

    let model: any = {};
    model.payerId = this.payerIdControl.value;
    model.startDate =  this.datePipe.transform(this.decrementYear(this.reconciliationReport.endDate), 'yyyy-MM-dd');
    model.endDate = this.datePipe.transform(this.reconciliationReport.endDate, 'yyyy-MM-dd');
    model.page = this.reconciliationReport.page;
    model.pageSize = this.reconciliationReport.size;

    this.editURL(model.startDate, model.endDate);

    this.reconciliationService.getReconciliationBtsearch(
      this.sharedService.providerId,
      model.payerId,
      model.startDate,
      model.endDate,
      model.page,
      model.pageSize
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.reconciliationReportResponse = event.body['content'] as ReconciliationReportResponse[];
          this.totalPages = event.body['totalPages'];

          let sumTotalSubmitted = 0, sumTotalReceivedAmount = 0, sumTotalReceivedAmountPerc = 0, finalRejectionAmount = 0, finalRejectionAmountPrec = 0, sumTotalOutstandingAmount = 0, promptPaymentDiscountPrec = 0, sumPromptPaymentDiscount = 0, sumVolumeDiscount = 0, volumeDiscountPrec = 0;
          this.reconciliationReportResponse.map(ele => {
            const payerData = this.payersList.find(sele => sele.id === ele.payerId);
            ele.payerName = payerData !== undefined ? payerData.name : ele.payerId;
            if (ele.finalRejectionAmountPerc !== null)
              ele.finalRejectionAmountPerc = ele.finalRejectionAmountPerc + '%';

            if (ele.totalReceivedPerc !== null)
              ele.totalReceivedPerc = ele.totalReceivedPerc + '%';

            if (ele.promptDiscountPerc !== null)
              ele.promptDiscountPerc = ele.promptDiscountPerc + '%';

            if (ele.volumeDiscountPerc !== null)
              ele.volumeDiscountPerc = ele.volumeDiscountPerc + '%';

            sumTotalSubmitted += ele.totalSubmittedAmount;
            sumTotalReceivedAmount += ele.totalReceived;
            finalRejectionAmount += ele.finalRejectionAmount;
            sumTotalOutstandingAmount += ele.totalOutstandingAmount;
            sumPromptPaymentDiscount += ele.promptDiscount;
            sumVolumeDiscount += ele.promptDiscount;

            return ele;
          });

          sumTotalReceivedAmountPerc = (sumTotalReceivedAmount / sumTotalSubmitted) * 100;
          finalRejectionAmountPrec = (finalRejectionAmount / sumTotalSubmitted) * 100;
          promptPaymentDiscountPrec = (sumPromptPaymentDiscount / sumTotalSubmitted) * 100;
          volumeDiscountPrec = (sumVolumeDiscount / sumTotalSubmitted) * 100;

          this.sumOfTotalReceivableObj = {
            sumTotalSubmitted: sumTotalSubmitted.toFixed(2),
            sumTotalReceivedAmount: sumTotalReceivedAmount.toFixed(2),
            sumTotalReceivedAmountPerc: sumTotalReceivedAmountPerc !== null && !isNaN(sumTotalReceivedAmountPerc) ? sumTotalReceivedAmountPerc.toFixed(2) + '%' : '0%',
            initRejectionAmountPerc: finalRejectionAmountPrec !== null && !isNaN(finalRejectionAmountPrec) ? finalRejectionAmountPrec.toFixed(2) + '%' : '0%',
            initRejectionAmount: finalRejectionAmount.toFixed(2),
            sumTotalOutstandingAmount: sumTotalOutstandingAmount.toFixed(2),

            sumPromptPaymentDiscount: sumPromptPaymentDiscount.toFixed(2),
            promptPaymentDiscountPrec: promptPaymentDiscountPrec !== null && !isNaN(promptPaymentDiscountPrec) ? promptPaymentDiscountPrec.toFixed(2) + '%' : '0%',

            sumVolumeDiscount: sumVolumeDiscount.toFixed(2),
            volumeDiscountPrec: volumeDiscountPrec !== null && !isNaN(volumeDiscountPrec) ? volumeDiscountPrec.toFixed(2) + '%' : '0%'

          };

          this.sharedService.loadingChanged.next(false);
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.sharedService.loadingChanged.next(false);
        this.reconciliationReportResponse = [];
        console.log(err);
      }
    });
  }

  //          this.sharedService.loadingChanged.next(false);
  //        }
  //      }
  //   }, err => {
  //     this.sharedService.loadingChanged.next(false);
  //      console.log(err);

  //   });
  //  }
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



