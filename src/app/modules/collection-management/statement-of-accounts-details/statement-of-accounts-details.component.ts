import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { StatementAccountSummary } from 'src/app/models/statementAccountModel';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AddEditPaymentDialogComponent } from '../add-edit-payment-dialog/add-edit-payment-dialog.component';
import { PayerStatementModel } from 'src/app/models/payerStatmentModel';
@Component({
  selector: 'app-statement-of-accounts-details',
  templateUrl: './statement-of-accounts-details.component.html',
  styles: []
})
export class StatementOfAccountsDetailsComponent implements OnInit {
  transactionModel = new PayerStatementModel();
  minDate: any;
  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' };
  transactionData: any[] = [];
  payersList: { id: number, name: string, arName: string }[] = [];
  previousFromdate: any;
  previousToDate: any;

  constructor(public dialog: MatDialog, private reportService: ReportsService, private commen: SharedServices, private location: Location, private routeActive: ActivatedRoute) {
    this.routeActive.queryParams.subscribe(params => {
      if (params.id != null) {
        this.transactionModel.statementId = parseInt(params.id);
      }
      if (params.payer != null) {
        this.transactionModel.payer = parseInt(params.payer);
      }
      if (params.fromDate != null) {
        const fromDate = moment(params.fromDate, 'YYYY-MM-DD').toDate();
        this.transactionModel.fromDate = fromDate;
        this.previousFromdate = fromDate;
      }
      if (params.toDate != null) {
        const toDate = moment(params.toDate, 'YYYY-MM-DD').toDate();
        this.transactionModel.toDate = toDate;
        this.previousToDate = toDate;
      }
      if (params.page != null) {
        this.transactionModel.page = params.page;
      }
      if (params.pageSize != null) {
        this.transactionModel.pageSize = params.pageSize;
      }
      if (this.transactionModel.toDate != null && this.transactionModel.fromDate != null && this.transactionModel.payer != null && this.transactionModel.statementId != null) {
        this.getTransactionsSOAData();
      }
    });
  }

  ngOnInit() {
    this.payersList = this.commen.getPayersList();
  }
  getTransactionsSOAData() {
    const body: PayerStatementModel = {
      fromDate: moment(this.transactionModel.fromDate).format('YYYY-MM-DD'),
      toDate: moment(this.transactionModel.toDate).format('YYYY-MM-DD'),
      payer: this.transactionModel.payer,
      page: this.transactionModel.page,
      pageSize: this.transactionModel.pageSize,
      totalPages: this.transactionModel.totalPages,
      statementId: this.transactionModel.statementId
    };
    this.commen.loadingChanged.next(true);
    this.editURL(body.fromDate, body.toDate);
    this.reportService.getPaymentStatmentSOA(this.commen.providerId, body).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200 && event.statusText.toLowerCase() === 'ok') {
          const body = event['body'];
          const data = JSON.parse(body);
          data.content.map((ele) => {
            const payerData = this.payersList.find(sele => sele.id === parseInt(ele.payerId));
            ele.payerName = payerData !== undefined ? payerData.name + ' ' + payerData.arName : '';
            return ele;
          })
          this.transactionData = data.content;
          this.transactionModel.totalPages = data.totalPages;
        }
        else {
          this.transactionData = [];
        }
        this.commen.loadingChanged.next(false);
      }
    }, err => {
      this.commen.loadingChanged.next(false);
      this.transactionData = [];
      console.log(err);
    });
  }

  submit() {
    this.getTransactionsSOAData();
  }

  goToFirstPage() {
    if (this.transactionModel.page != 0) {
      this.transactionModel.page = 0;
    }
    this.getTransactionsSOAData();
  }
  goToPrePage() {
    if (this.transactionModel.page != 0) {
      this.transactionModel.page = this.transactionModel.page - 1;
    }
    this.getTransactionsSOAData();
  }
  goToNextPage() {
    if ((this.transactionModel.page + 1) < this.transactionModel.totalPages) {
      this.transactionModel.page = this.transactionModel.page + 1;
    }
    this.getTransactionsSOAData();
  }
  goToLastPage() {
    if (this.transactionModel.page != (this.transactionModel.totalPages - 1)) {
      this.transactionModel.page = this.transactionModel.totalPages - 1;
    }
    this.getTransactionsSOAData();
  }
  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.transactionModel.toDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.transactionModel.toDate = '';
      }
    }
    this.minDate = new Date(event);

  }

  editURL(fromDate?: string, toDate?: string) {
    let path = '/collection-management/statement-of-accounts-details?';
    if (this.transactionModel.statementId != null) {
      path += `id=${this.transactionModel.statementId}&`;
    }
    if (this.transactionModel.payer != null) {
      path += `payer=${this.transactionModel.payer}&`;
    }
    // if (fromDate != null) {
    //   path += `fromDate=${fromDate}&`;
    // }
    // if (toDate != null) {
    //   path += `toDate=${toDate}`;
    // }
    path += `fromDate=${moment(this.previousFromdate).format('YYYY-MM-DD')}&`;
    path += `toDate=${moment(this.previousToDate).format('YYYY-MM-DD')}&`;
    if (this.transactionModel.page != null) {
      path += `page=${this.transactionModel.page}`;
    }
    if (this.transactionModel.pageSize != null) {
      path += `pageSize=${this.transactionModel.pageSize}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }
  get isLoading() {
    return this.commen.loading;
  }
  openAddEditPaymentDialog() {
    const dialogRef = this.dialog.open(AddEditPaymentDialogComponent,
      {
        panelClass: ['primary-dialog', 'dialog-sm'],
        data: {
          statementId: this.transactionModel.statementId
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.status) {
        this.getTransactionsSOAData();
      }
    }, error => {

    });
  }
}
