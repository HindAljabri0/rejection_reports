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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };

  isSubmitted: boolean = false;
  totalPages: number;
  page: number = 0;
  constructor(
    private reconciliationService: ReconciliationService,
    private dialog: MatDialog,
    private sharedService: SharedServices,
    private routeActive: ActivatedRoute,
    private location: Location,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder
  ) { }

  FormReconciliationReport: FormGroup = this.formBuilder.group({
    payerId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['']
  });

  ngOnInit() {
    this.payersList = [];
    this.sharedService.getPayersList().map(value => {
      this.payersList.push({
        id: `${value.id}`,
        name: value.name
      });
    });

    this.FormReconciliationReport.controls.payerId.setValue('all');
    this.FormReconciliationReport.controls.startDate.setValue(new Date());
    this.FormReconciliationReport.controls.endDate.setValue(new Date());
    // this.payersList.push({
    //   id: allPayersIds,
    //   name: 'All'
    // });

    // this.FormReconciliationReport.controls.startDate.setValue(this.decrementYear(new Date()));
    // this.FormReconciliationReport.controls.endDate.setValue(new Date());
    this.routeActive.queryParams.subscribe(params => {
      if (params.payer !== undefined) {
        if (params.payer == 'all') {
          this.FormReconciliationReport.controls.payerId.setValue('all');
        } else {
          this.FormReconciliationReport.controls.payerId.setValue(params.payer);
        }
      }
      // if (params.startDate != null) {
      //   this.reconciliationReport.startDate = params.startDate;
      //   const startDate: any = moment(params.startDate, 'YYYY-MM-DD').toDate();
      //   this.FormReconciliationReport.controls.startDate.setValue(startDate);
      // }
      if (params.endDate != null) {
        this.reconciliationReport.startDate = params.endDate;
        const endDate: any = moment(params.endDate, 'YYYY-MM-DD').toDate();
        this.FormReconciliationReport.controls.startDate.setValue(endDate);

        this.reconciliationReport.endDate = params.endDate;
        this.FormReconciliationReport.controls.endDate.setValue(endDate);
      }
      if (params.page != null) {
        this.reconciliationReport.page = parseInt(params.page);
      }
      if (params.size != null) {
        this.reconciliationReport.size = parseInt(params.size);
      }

      this.search();
    });
  }


  decrementYear(startDate) {
    var year = new Date(startDate);
    return new Date(year.setFullYear(year.getFullYear() - 1));
  }

  onSubmit() {
    this.page = 0;
    this.reconciliationReport.page = 0;
    this.reconciliationReport.size = 10;
    this.search();
  }

  search() {
    this.isSubmitted = true;
    if (this.FormReconciliationReport.valid) {
      this.sharedService.loadingChanged.next(true);

      this.reconciliationReportResponse = [];
      // this.endDateController.setValue(this.incrementYear(this.reconciliationReport.startDate));

      let model: any = {};
      model.payerId = this.FormReconciliationReport.controls.payerId.value;
      model.startDate = this.datePipe.transform(this.decrementYear(this.FormReconciliationReport.controls.startDate.value), 'yyyy-MM-dd');
      model.endDate = this.datePipe.transform(this.FormReconciliationReport.controls.startDate.value, 'yyyy-MM-dd');

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

    let path = `/collection-management/reconciliation-report?`;

    if (this.FormReconciliationReport.controls.payerId.value != null) {
      path += `payer=${this.FormReconciliationReport.controls.payerId.value}&`;
    }

    if (startDate != null) {
      path += `startDate=${startDate}&`;
    }
    if (endDate != null) {
      path += `endDate=${endDate}`;
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
    this.reconciliationReport.page = this.page;
    this.search();
  }

  goToPrePage() {
    this.page -= 1;
    this.reconciliationReport.page = this.page;
    this.search();
  }

  goToNextPage() {
    this.page += 1;
    this.reconciliationReport.page = this.page;
    this.search();
  }

  goToLastPage() {
    this.page = this.totalPages - 1;
    this.reconciliationReport.page = this.page;
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



