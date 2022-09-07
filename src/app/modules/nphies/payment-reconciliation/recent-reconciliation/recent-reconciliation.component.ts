import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { SharedServices } from 'src/app/services/shared.services';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { HttpResponse } from '@angular/common/http';
import { PaginatedResult } from 'src/app/models/paginatedResult';
import { PaymentReconciliation } from 'src/app/models/payment-reconciliation';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { NphiesPollManagementService } from 'src/app/services/nphiesPollManagement/nphies-poll-management.service';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recent-reconciliation',
  templateUrl: './recent-reconciliation.component.html',
  styles: []
})
export class RecentReconciliationComponent implements OnInit {

  @Input() searchModel: any;
  @Input() payersList: any;

  @ViewChild('paginator', { static: false }) paginator: MatPaginator;
  paginatorPagesNumbers: number[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  manualPage = null;
  page: number;
  pageSize: number;
  paymentReconciliationModel: PaginatedResult<PaymentReconciliation>;
  paymentReconciliations = [];

  constructor(
    private dialog: MatDialog,
    public sharedServices: SharedServices,
    private dialogService: DialogService,
    private router: Router,
    private nphiesPollManagementService: NphiesPollManagementService,
    private providerNphiesSearchService: ProviderNphiesSearchService,
  ) { }

  ngOnInit() {
    this.page = 0;
    this.pageSize = 10;
  }

  getRecentReconciliation() {
    this.sharedServices.loadingChanged.next(true);
    const model: any = {};
    model.fromDate = this.searchModel.fromDate;
    model.toDate = this.searchModel.toDate;

    if (this.searchModel.issuerId) {
      model.issuerId = this.searchModel.issuerId;
    }

    model.page = this.page;
    model.pageSize = this.pageSize;

    this.providerNphiesSearchService.getProcessedPaymentReconciliation(this.sharedServices.providerId, model).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        this.paymentReconciliationModel = new PaginatedResult(body, PaymentReconciliation);
        this.paymentReconciliations = this.paymentReconciliationModel.content;
        this.paymentReconciliations.forEach(x => {
          // tslint:disable-next-line:max-line-length
          x.issuerName = this.payersList.find(y => y.nphiesId === x.issuerNphiesId) ? this.payersList.filter(y => y.nphiesId === x.issuerNphiesId)[0].englistName : '';
        });
        // console.log(this.paymentReconciliations);
        const pages = Math.ceil((this.paymentReconciliationModel.totalElements / this.pageSize));
        this.paginatorPagesNumbers = Array(pages).fill(pages).map((x, i) => i);
        this.manualPage = this.paymentReconciliationModel.number;
        this.page = this.paymentReconciliationModel.number;
        this.pageSize = this.paymentReconciliationModel.size;
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      console.log(err);
    });
  }

  openSendPaymentNoticeConfimationDialog(reconciliationId, paymentAmount) {
    // tslint:disable-next-line:max-line-length
    const subMsg = '<span class="semibold">Amount:</span> ' + paymentAmount + ' SR<br><span class="semibold">Payment Status:</span> ' + (paymentAmount < 0 ? 'Paid' : 'Cleared');
    const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, {
      panelClass: ['primary-dialog'],
      disableClose: true,
      autoFocus: false,
      data: {
        mainMessage: 'Payment Notice',
        subMessage: subMsg,
        mode: 'warning',
        yesButtonText: 'Send',
        noButtonText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendPaymentNotice(reconciliationId);
      }
    });
  }

  sendPaymentNotice(reconciliationId) {
    const model: any = {};
    model.reconciliationId = reconciliationId;
    this.sharedServices.loadingChanged.next(true);
    this.nphiesPollManagementService.senPaymentNotice(this.sharedServices.providerId, model).subscribe(event => {
      if (event instanceof HttpResponse) {
        const body: any = event.body;
        if (body.status === 'OK') {
          const errors = [];

          if (body.disposition) {
            errors.push(body.disposition);
          }

          if (body.outcome.toLowerCase() === 'error') {
            if (body.errors && body.errors.length > 0) {
              body.errors.forEach(err => {
                errors.push(err);
              });
            }

            this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors);
          } else {
            if (errors.length > 0) {
              this.dialogService.showMessage('Success', body.message, 'success', true, 'OK', errors);
            } else {
              this.dialogService.showMessage('Success', body.message, 'success', true, 'OK');
            }
            this.getRecentReconciliation();
          }
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
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
    this.getRecentReconciliation();
  }

  paginationChange(event) {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  RedirectToDetails(reconciliationId: number, notificationStatus: string, notificationId: string) {
    this.readNotification(notificationStatus, notificationId);
    this.router.navigate(['/nphies/payment-reconciliation-details', reconciliationId]);
  }

  readNotification(notificationStatus: string, notificationId: string) {
    if (notificationStatus === 'unread') {
      this.sharedServices.unReadRecentCount = this.sharedServices.unReadRecentCount - 1;
      if (notificationId) {
        this.sharedServices.markAsRead(notificationId, this.sharedServices.providerId);
      }
    }
  }

  readAllNotification() {
    this.paymentReconciliations.forEach(x=>x.notificationStatus = 'read');
    this.sharedServices.unReadRecentCount = 0;
    this.sharedServices.markAllAsRead(this.sharedServices.providerId, "payment-reconciliation");
  }

  get paginatorLength() {
    if (this.paymentReconciliationModel != null) {
      return this.paymentReconciliationModel.totalElements;
    } else {
      return 0;
    }
  }
}
