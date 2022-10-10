import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MessageDialogComponent } from 'src/app/components/dialogs/message-dialog/message-dialog.component';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { Observable, Subject } from 'rxjs';
import { ClaimDialogComponent } from 'src/app/components/dialogs/claim-dialog/claim-dialog.component';
import { ViewedClaim } from 'src/app/models/viewedClaim';
import { PaymentClaimDetail } from 'src/app/models/paymentClaimDetail';
import {
  PaymentClaimDetailDailogComponent
} from 'src/app/components/dialogs/payment-claim-detail-dailog/payment-claim-detail-dailog.component';
import { SharedServices } from '../shared.services';
import { SearchService } from '../serchService/search.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ReportsService } from '../reportsService/reports.service';
import { RejectionReportClaimDialogData } from 'src/app/models/dialogData/rejectionReportClaimDialogData';
import {
  RejectionReportClaimDialogComponent
} from 'src/app/components/dialogs/rejection-report-claim-dialog/rejection-report-claim-dialog.component';
import {
  ConfirmAdminDeleteDialogComponent
} from 'src/app/components/dialogs/confirm-admin-delete-dialog/confirm-admin-delete-dialog.component';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { AlertDialogComponent } from 'src/app/components/dialogs/alert-dialog/alert-dialog.component';
import { UpcomingFeatureDialogComponent } from 'src/app/components/dialogs/upcoming-feature-dialog/upcoming-feature-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  onClaimDialogClose: Subject<any> = new Subject();

  constructor(
    private commenServices: SharedServices,
    private dialog: MatDialog,
    private searchService: SearchService,
    private reportService: ReportsService) { }

  openMessageDialog(dialogData: MessageDialogData): Observable<any> {
    this.closeAll();
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      panelClass: ['primary-dialog', dialogData.isError ? 'error-dialog' : (!dialogData.withButtons ? 'success-dialog' : '')],
      data: dialogData,
    });
    return dialogRef.afterClosed();
  }
  openConfirmAdminDeleteDialog(): Observable<any> {
    this.closeAll();
    const dialogRef = this.dialog.open(ConfirmAdminDeleteDialogComponent);
    return dialogRef.afterClosed();
  }
  getClaimAndViewIt(providerId: string, payerId: string, status: string, claimId: string, maxNumberOfAttachment, edit?: boolean) {
    if (this.loading) {
      return;
    }
    this.commenServices.loadingChanged.next(true);
    this.searchService.getClaim(providerId, claimId).subscribe(event => {
      if (event instanceof HttpResponse) {
        const claim: ViewedClaim = JSON.parse(JSON.stringify(event.body));
        this.commenServices.loadingChanged.next(false);
        if (payerId == null) {
          payerId = claim.payerid;
        }
        this.openClaimDialog(providerId, payerId, status, claim, maxNumberOfAttachment, edit);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status == 404) {
          this.openMessageDialog(new MessageDialogData('', 'Claim was not found!', true));
        } else {
          this.openMessageDialog(new MessageDialogData('',
            'Could not reach the server at the moment. Please try again later.', true));
        }
      }
      this.commenServices.loadingChanged.next(false);
    });
  }

  openClaimDialog(providerId: string, payerId: string, status: string, claim: ViewedClaim, maxNumberOfAttachment, edit?: boolean) {
    claim.providerId = providerId;
    claim.payerid = payerId;
    claim.status = status;
    this.closeAll();
    const dialogRef = this.dialog.open(ClaimDialogComponent, {
      width: '50%',
      height: '70%',
      panelClass: 'claimDialog',
      data: { claim, edit: (edit || false), maxNumberOfAttachment },
    });
    dialogRef.afterClosed().subscribe(value => {
      this.onClaimDialogClose.next(value);
    });
  }

  getPaymentClaimDetailAndViewIt(claimId: number) {
    this.closeAll();
    this.reportService.getPaymentClaimDetail(this.providerId, claimId).subscribe(event => {
      if (event instanceof HttpResponse) {
        const claim: PaymentClaimDetail = JSON.parse(JSON.stringify(event.body));
        this.openPaymentClaimDetailDialog(claim);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.openMessageDialog(new MessageDialogData('', errorEvent.message, true));
      }
    });
  }
  openPaymentClaimDetailDialog(claim: PaymentClaimDetail) {
    this.closeAll();
    const dialogRef = this.dialog.open(PaymentClaimDetailDailogComponent, {
      width: '80%',
      height: '90%',
      panelClass: 'claimDialog',
      data: claim,
    });
    dialogRef.afterClosed().subscribe(value => {
      this.onClaimDialogClose.next(value);
    });
  }

  openRejectionReportClaimDialog(claim: RejectionReportClaimDialogData) {
    this.closeAll();
    const dialogRef = this.dialog.open(RejectionReportClaimDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-xl'],
      data: claim
    });
    dialogRef.afterClosed().subscribe(value => {
      this.onClaimDialogClose.next(value);
    });
  }

  showMessage(_mainMessage, _subMessage, _mode, _hideNoButton, _yesButtonText, _errors = null, dontCloseAll = null, closeOnOk = null, _transactionId = null, preventClose = false) {
    if (!dontCloseAll) {
      this.closeAll();
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = preventClose;
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      transactionId: _transactionId ? _transactionId : '',
      mainMessage: _mainMessage,
      subMessage: _subMessage,
      mode: _mode,
      hideNoButton: _hideNoButton,
      yesButtonText: _yesButtonText,
      errors: _errors
    };
    const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);
    if (closeOnOk) {
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          location.reload();
          // this.getClaimTransactions(this.params.status, this.params.page);
        }
      });
    }
  }

  // tslint:disable-next-line:max-line-length
  showMessageObservable(_mainMessage, _subMessage, _mode, _hideNoButton, _yesButtonText, _errors = null, dontCloseAll = null, _transactionId = null): Observable<any> {
    if (!dontCloseAll) {
      this.closeAll();
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      transactionId: _transactionId ? _transactionId : '',
      mainMessage: _mainMessage,
      subMessage: _subMessage,
      mode: _mode,
      hideNoButton: _hideNoButton,
      yesButtonText: _yesButtonText,
      errors: _errors
    };
    const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, dialogConfig);
    return dialogRef.afterClosed();
  }

  showAlerts(messages: string[]) {
    if ((messages != null && messages.length > 0) || (this.commenServices.isHasNphiesPrivileges() && !this.commenServices.isOverNphiesdwonTime)) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: messages,
        panelClass: ['primary-dialog'],
        autoFocus: false
      });
      // dialogRef.afterClosed().subscribe(() => this.showAlerts(messages));
    }
  }

  showUpcomingFeatures(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    this.dialog.open(UpcomingFeatureDialogComponent, dialogConfig);    
  }

  closeAll() {
    this.dialog.closeAll();
  }


  get loading() {
    return this.commenServices.loading;
  }

  get providerId() {
    return this.commenServices.providerId;
  }
}
