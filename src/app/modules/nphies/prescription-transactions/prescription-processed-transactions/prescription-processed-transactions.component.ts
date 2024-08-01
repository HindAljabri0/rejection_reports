import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { ProcessedTransaction } from 'src/app/models/processed-transaction';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatPaginator } from '@angular/material';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';

@Component({
  selector: 'app-prescription-processed-transactions',
  templateUrl: './prescription-processed-transactions.component.html',
  styles: []
})
export class PrescriptionProcessedTransactionsComponent implements OnInit {

  @Input() payersList: any;
  @Output() openDetailsDialogEvent = new EventEmitter<any>();
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;

  processedTransactionModel: PaginatedResult<ProcessedTransaction>;
  processedTransactions = [];

  constructor(
    private sharedServices: SharedServices,
    private dialogService: DialogService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
  ) { }

  ngOnInit() {
  }

  getProcessedTransactions() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.getPrescriptionProcessedTransaction(this.sharedServices.providerId).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          // this.sharedServices.unReadProcessedTotalCount = 0;
          // this.sharedServices.markAsRead();
          this.processedTransactionModel = new PaginatedResult(body, ProcessedTransaction);
          this.processedTransactions = this.processedTransactionModel.content;
          this.processedTransactions.forEach(x => {
            // tslint:disable-next-line:max-line-length
            x.payerName = this.payersList.find(y => y.nphiesId === x.payerNphiesId) ? this.payersList.filter(y => y.nphiesId === x.payerNphiesId)[0].englistName : '';
          });
          if (this.paginator) {
            const pages = Math.ceil((this.processedTransactionModel.totalElements / this.paginator.pageSize));
            this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
            this.manualPage = this.processedTransactionModel.number;
            this.paginator.pageIndex = this.processedTransactionModel.number;
            this.paginator.pageSize = this.processedTransactionModel.size;
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
    this.processedTransactions.forEach(x=>x.notificationStatus = 'read');
    this.sharedServices.unReadPrescriberProcessedTotalCount = 0;
    this.sharedServices.markAllAsRead(this.sharedServices.providerId, "prescriberprocessed-notifications");
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
    this.getProcessedTransactions();
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openDetailsDialog(requestId, responseId, notificationId, notificationStatus) {
    if (this.processedTransactions.filter(x => x.notificationId === notificationId)[0]) {
      this.processedTransactions.filter(x => x.notificationId === notificationId)[0].notificationStatus = 'read';
    }
    this.openDetailsDialogEvent.emit({ 'requestId': requestId, 'responseId': responseId, 'notificationId': notificationId, 'notificationStatus': notificationStatus });
  }

  get paginatorLength() {
    if (this.processedTransactionModel != null) {
      return this.processedTransactionModel.totalElements;
    } else {
      return 0;
    }
  }
}
