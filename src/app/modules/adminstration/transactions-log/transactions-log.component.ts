import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { JsonViewDialogComponent } from 'src/app/components/dialogs/json-view-dialog/json-view-dialog.component';
import { Payer } from 'src/app/models/nphies/payer';
import { TransactionLog } from 'src/app/models/nphies/transactionLog';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-transactions-log',
  templateUrl: './transactions-log.component.html',
  styles: []
})
export class TransactionsLogComponent implements OnInit, AfterContentInit {

  payers: Payer[] = [];
  transactionTypes: { code: string, display: string }[] = [];

  transactions: TransactionLog[] = [];

  transactionIdControl: FormControl = new FormControl();
  providerIdControl: FormControl = new FormControl();
  fromDateControl: FormControl = new FormControl();
  toDateControl: FormControl = new FormControl();

  selectedPayer: string = 'none';
  selectedType: string = 'none';

  page: number = 0;
  size: number = 10;
  totalPages: number;

  constructor(
    private searchService: ProviderNphiesSearchService,
    private sharedServices: SharedServices,
    private dialog: MatDialog
  ) { }


  async ngOnInit() {
    this.sharedServices.loadingChanged.next(true);

    await this.loadPayers();
    await this.loadTransactionTypes();

    this.sharedServices.loadingChanged.next(false);
    this.searchTransactions();

  }

  ngAfterContentInit() {
  }

  async loadPayers() {
    const event = await this.searchService.getPayers().toPromise();
    if (event instanceof HttpResponse) {
      const body = event.body;
      if (body instanceof Array) {
        this.payers = body;
      }
    } else if (event instanceof HttpErrorResponse) {

    }
  }

  async loadTransactionTypes() {
    const event = await this.searchService.getTransactionTypes().toPromise();
    if (event instanceof HttpResponse) {
      const body = event.body;
      if (body instanceof Array) {
        this.transactionTypes = body;
      }
    } else if (event instanceof HttpErrorResponse) {

    }
  }

  searchTransactions() {
    if (this.sharedServices.loading) {
      return;
    }
    const transactionId: string = this.transactionIdControl.value != null && this.transactionIdControl.value.trim().length > 0 ? this.transactionIdControl.value : null;
    const providerId: string = this.providerIdControl.value != null && this.providerIdControl.value.trim().length > 0 ? this.providerIdControl.value : null;
    const payer: string = this.selectedPayer != 'none' ? this.selectedPayer : null;
    const type: string = this.selectedType != 'none' ? this.selectedType : null;
    const fromDate: string = this._isValidDate(this.fromDateControl.value) ? moment(this.fromDateControl.value).format('YYYY-MM-DD') : null;
    const toDate: string = this._isValidDate(this.toDateControl.value) ? moment(this.toDateControl.value).format('YYYY-MM-DD') : null;
    this.sharedServices.loadingChanged.next(true);
    this.transactions = [];
    this.searchService.searchTransactionsLog(transactionId, providerId, payer, type, fromDate, toDate, this.page, this.size).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        const content = event.body['content'];
        if (content instanceof Array) {
          this.transactions = content;
        }
        this.totalPages = event.body['totalPages'];
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status == 404) {

        } else {

        }
      }
    });
  }

  goToFirstPage() {
    this.page = 0;
    this.searchTransactions();
  }

  goToPrePage() {
    this.page -= 1;
    this.searchTransactions();
  }

  goToNextPage() {
    this.page += 1;
    this.searchTransactions();
  }

  goToLastPage() {
    this.page = this.totalPages - 1;
    this.searchTransactions();
  }

  getPayerName(id) {
    const index = this.payers.findIndex(payer => payer.nphiesId == `${id}`);
    if (index != -1) {
      return this.payers[index].englistName;
    }
    return id;
  }

  getTypeName(code: string) {
    if (code != null) {
      const index = this.transactionTypes.findIndex(type => type.code.toLowerCase() == code.toLowerCase());
      if (index != -1) {
        return this.transactionTypes[index].display;
      }
    }
    return code;
  }

  viewJSONs(transaction: TransactionLog) {
    this.dialog.open(JsonViewDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg', 'json-dialog'],
      data: {
        title: `JSONs of Transaction [${transaction.providerTransactionId}]`,
        tabs: [
          {
            title: `Provider Request`,
            json: transaction.providerRequest
          },
          {
            title: `Waseel Request`,
            json: transaction.waseelRequest
          },
          {
            title: `NPHIES Response`,
            json: transaction.nphiesResponse
          },
          {
            title: `Waseel Response`,
            json: transaction.waseelResponse
          }
        ]
      }
    });
  }


  _isValidDate(date): boolean {
    return date != null && !Number.isNaN(new Date(moment(date).format('YYYY-MM-DD')).getTime());
  }

  get isLoading() {
    return this.sharedServices.loading;
  }

}
