import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatPaginator, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { ProcessedTransaction } from 'src/app/models/processed-transaction';
import { SearchPageQueryParams } from 'src/app/models/searchPageQueryParams';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateClaimNphiesComponent } from '../../create-claim-nphies/create-claim-nphies.component';
import { CancelReasonModalComponent } from '../../preauthorization-transactions/cancel-reason-modal/cancel-reason-modal.component';

@Component({
  selector: 'app-claim-processed-transactions',
  templateUrl: './claim-processed-transactions.component.html',
  styles: []
})
export class ClaimProcessedTransactionsComponent implements OnInit {

  @Input() payersList: any;
  @Output() openDetailsDialogEvent = new EventEmitter<any>();
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number = 10;

  processedTransactionModel: PaginatedResult<ProcessedTransaction>;
  processedTransactions = [];

  params: SearchPageQueryParams = new SearchPageQueryParams();
  claimDialogRef: MatDialogRef<any, any>;

  constructor(
    public dialog: MatDialog,
    private sharedServices: SharedServices,
    private dialogService: DialogService,
    public router: Router,
    public routeActive: ActivatedRoute,
    private providerNphiesSearchService: ProviderNphiesSearchService,
  ) { }

  ngOnInit() {

  }

  getProcessedTransactions() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.getProcessedTransaction(this.sharedServices.providerId, 'claim', this.page, this.pageSize).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          const body: any = event.body;
          // this.sharedServices.unReadProcessedCount = 0;
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

  showClaim(claimId: string, uploadId: string, claimResponseId: string, notificationId: string, notificationStatus: string) {
    if (this.processedTransactions.filter(x => x.notificationId === notificationId)[0]) {
      this.processedTransactions.filter(x => x.notificationId === notificationId)[0].notificationStatus = 'read';
    }

    this.readNotification(notificationStatus, notificationId);

    this.params.claimId = claimId;
    this.params.uploadId = uploadId;
    this.params.claimResponseId = claimResponseId;
    this.resetURL();
    this.claimDialogRef = this.dialog.open(CreateClaimNphiesComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false, data: { claimId }
    });

    this.claimDialogRef.afterClosed().subscribe(result => {
      this.claimDialogRef = null;
      this.params.claimId = null;
      this.params.editMode = null;
      this.resetURL();
    });
  }

  readNotification(notificationStatus: string, notificationId: string) {
    if (notificationStatus === 'unread') {
      this.sharedServices.unReadClaimProcessedCount = this.sharedServices.unReadClaimProcessedCount - 1;
      if (notificationId) {
        this.sharedServices.markAsRead(notificationId, this.sharedServices.providerId);
      }
    }
  }

  readAllNotification() {
    this.processedTransactions.forEach(x=>x.notificationStatus = 'read');
    this.sharedServices.unReadClaimProcessedCount = 0;
    this.sharedServices.markAllAsRead(this.sharedServices.providerId, "claim-notifications");
  }

  resetURL() {
    this.router.navigate([], {
      relativeTo: this.routeActive,
      queryParams: { ...this.params, editMode: null, size: null }
    });
  }

  openReasonModal(requestId: number, responseId: number, reqType: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.data = {
      approvalRequestId: requestId,
      approvalResponseId: responseId,
      type: reqType
    };

    const dialogRef = this.dialog.open(CancelReasonModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProcessedTransactions();
      }
    });
  }

  get paginatorLength() {
    if (this.processedTransactionModel != null) {
      return this.processedTransactionModel.totalElements;
    } else {
      return 0;
    }
  }

}
