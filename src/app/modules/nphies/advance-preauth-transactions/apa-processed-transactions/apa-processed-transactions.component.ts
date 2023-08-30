import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { ApaProcessedTransaction } from 'src/app/models/apa-processed-transaction-model';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-apa-processed-transactions',
  templateUrl: './apa-processed-transactions.component.html',
  styles: []
})
export class ApaProcessedTransactionsComponent implements OnInit {

  @Input() payersList: any;
  @Output() openDetailsDialogEvent = new EventEmitter<any>();
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;

  apaProcessedTransactionModel: PaginatedResult<ApaProcessedTransaction>;
  apaProcessedTransactions = [];

  constructor(
    private sharedServices: SharedServices,
    private dialogService: DialogService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
  ) { }

  ngOnInit() {
  }

  getApaProcessedTransactions() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.getApaProcessedTransaction(this.sharedServices.providerId, 'approval', this.page, this.pageSize).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          // this.sharedServices.unReadProcessedApaCount = 0;
          // this.sharedServices.markAsRead();
          this.apaProcessedTransactionModel = new PaginatedResult(body, ApaProcessedTransaction);
          this.apaProcessedTransactions = this.apaProcessedTransactionModel.content;
          this.apaProcessedTransactions.forEach(x => {
            // tslint:disable-next-line:max-line-length
            x.payerName = this.payersList.find(y => y.nphiesId === x.payerNphiesId) ? this.payersList.filter(y => y.nphiesId === x.payerNphiesId)[0].englistName : '';
          });
          if (this.paginator) {
            const pages = Math.ceil((this.apaProcessedTransactionModel.totalElements / this.paginator.pageSize));
            this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
            this.manualPage = this.apaProcessedTransactionModel.number;
            this.paginator.pageIndex = this.apaProcessedTransactionModel.number;
            this.paginator.pageSize = this.apaProcessedTransactionModel.size;
          }
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK', error.error.errors);
        } else if (error.status === 404) {
          this.dialogService.showMessage('Error', error.error.message ? error.error.message : error.error.error, 'alert', true, 'OK');
        } else if (error.status === 500) {
          this.dialogService.showMessage('Error', error.error.message, 'alert', true, 'OK');
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  readAllNotification() {
    this.apaProcessedTransactions.forEach(x=>x.notificationStatus = 'read');
    this.sharedServices.unReadProcessedApaCount = 0;
    this.sharedServices.markAllAsRead(this.sharedServices.providerId, "advanced-approval-notifications");
  }

  updateManualPage(index) {
    this.manualPage = index;
    this.paginator.pageIndex = index;
    this.paginatorAction({
      previousPageIndex: this.paginator.pageIndex,
      pageIndex: index,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }

  paginatorAction(event) {
    this.manualPage = event.pageIndex;
    this.paginationChange(event);
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getApaProcessedTransactions();
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openDetailsDialog(requestId, responseId, notificationId, notificationStatus) {
    if (this.apaProcessedTransactions.filter(x => x.notificationId === notificationId)[0]) {
      this.apaProcessedTransactions.filter(x => x.notificationId === notificationId)[0].notificationStatus = 'read';
    }
    this.openDetailsDialogEvent.emit({ 'requestId': requestId, 'responseId': responseId, 'notificationId': notificationId, 'notificationStatus': notificationStatus });
  }

  get paginatorLength() {
    if (this.apaProcessedTransactionModel != null) {
      return this.apaProcessedTransactionModel.totalElements;
    } else {
      return 0;
    }
  }
}
