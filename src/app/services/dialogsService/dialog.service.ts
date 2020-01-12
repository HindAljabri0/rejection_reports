import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MessageDialogComponent } from 'src/app/components/dialogs/message-dialog/message-dialog.component';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { Observable, Subject } from 'rxjs';
import { ClaimDialogComponent } from 'src/app/components/dialogs/claim-dialog/claim-dialog.component';
import { ViewedClaim } from 'src/app/models/viewedClaim';
import { PaymentClaimDetail } from 'src/app/models/paymentClaimDetail';
import { PaymentClaimDetailDailogComponent } from 'src/app/components/dialogs/payment-claim-detail-dailog/payment-claim-detail-dailog.component';
import { CommenServicesService } from '../commen-services.service';
import { SearchServiceService } from '../serchService/search-service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ReportsService } from '../reportsService/reports.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  onClaimDialogClose: Subject<any> = new Subject;

  constructor(private commenServices: CommenServicesService,
    private dialog: MatDialog,
    private searchService: SearchServiceService,
    private reportService: ReportsService) { }

  openMessageDialog(dialogData: MessageDialogData): Observable<any> {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '35%',
      height: '17%',
      panelClass: dialogData.isError ? 'dialogError' : 'dialogSuccess',
      data: dialogData,
    });
    return dialogRef.afterClosed();
  }

  getClaimAndViewIt(providerId: string, payerId: string, status: string, claimId: string) {
    if (this.loading) return;
    this.commenServices.loadingChanged.next(true);
    this.searchService.getClaim(providerId, claimId).subscribe(event => {
      if (event instanceof HttpResponse) {
        const claim: ViewedClaim = JSON.parse(JSON.stringify(event.body));
        this.commenServices.loadingChanged.next(false);
        if (payerId == null) {
          payerId = claim.payerid;
        }
        this.openClaimDialog(providerId, payerId, status, claim);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status == 404) {
          this.openMessageDialog(new MessageDialogData("", 'Claim was not found!', true));
        } else {
          this.openMessageDialog(new MessageDialogData("", 'Could not reach the server at the moment. Please try again later.', true));
        }
      }
      this.commenServices.loadingChanged.next(false);
    });
  }

  openClaimDialog(providerId: string, payerId: string, status: string, claim: ViewedClaim) {
    claim.providerId = providerId;
    claim.payerid = payerId;
    claim.status = status;
    const dialogRef = this.dialog.open(ClaimDialogComponent, {
      width: '50%',
      height: '70%',
      panelClass: 'claimDialog',
      data: claim,
    });
    dialogRef.afterClosed().subscribe(value => {
      this.onClaimDialogClose.next(value);
    });
  }

  getPaymentClaimDetailAndViewIt(claimId: number) {
    this.reportService.getPaymentClaimDetail(this.providerId, claimId).subscribe(event => {
      if (event instanceof HttpResponse) {
        const claim: PaymentClaimDetail = JSON.parse(JSON.stringify(event.body));
        this.openPaymentClaimDetailDialog(claim);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {
        this.openMessageDialog(new MessageDialogData("", errorEvent.message, true));
      }
    });
  }
  openPaymentClaimDetailDialog(claim: PaymentClaimDetail) {
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


  get loading() {
    return this.commenServices.loading;
  }

  get providerId() {
    return this.commenServices.providerId;
  }
}
