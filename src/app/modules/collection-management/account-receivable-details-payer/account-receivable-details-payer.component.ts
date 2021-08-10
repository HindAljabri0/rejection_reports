import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';
import { AddIntialRejectionDialogComponent } from '../add-intial-rejection-dialog/add-intial-rejection-dialog.component';
import { CollectionManagementService } from 'src/app/services/collection-management/collection-management.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-receivable-details-payer',
  templateUrl: './account-receivable-details-payer.component.html',
  styles: []
})
export class AccountReceivableDetailsPayerComponent implements OnInit {

  currentOpenRecord = -1;
  year: string;
  payersList: { id: number, name: string, arName: string }[] = [];
  payerId: string;
  receivableDetailsData: any = [];
  selectedPayerAndDate: any;
  constructor(public dialog: MatDialog, private collectionManagementService: CollectionManagementService, private sharedService: SharedServices, private dialogService: DialogService, private routeActive: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeActive.queryParams.subscribe(params => {
      if (params.year != null) {
        this.year = params.year;
      }
      if (params.payerId != null) {
        this.payerId = params.payerId;
      }
      if (params.year != null && params.payerId != null)
        this.getAccountReceivableData();
    });
  }

  openAddPaymentDialog() {
    const dialogRef = this.dialog.open(AccountReceivableAddPaymentComponent,
      {
        panelClass: ['primary-dialog'],
        data: this.selectedPayerAndDate
      });
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.status) {
        this.getAccountReceivableData();
      }
    }, error => {

    });
  }

  toggleRow(index) {
    this.currentOpenRecord = (index == this.currentOpenRecord) ? -1 : index;
  }
  getAccountReceivableData() {
    this.sharedService.loadingChanged.next(true);
    this.collectionManagementService.getAccountReceivableMonthly(
      this.sharedService.providerId,
      this.payerId,
      this.year
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          let body: any = event['body'];
          this.receivableDetailsData = JSON.parse(body);
          this.receivableDetailsData.map(ele => {
            const payerData = this.payersList.find(sele => sele.id === parseInt(ele.payerId));
            ele.payerName = payerData !== undefined ? payerData.name + ' ' + payerData.arName : ele.payerId;
            if (ele.initRejectionPerc !== null)
              ele.initRejectionPerc = ele.initRejectionPerc + '%';

            if (ele.totalReceivedPerc !== null)
              ele.totalReceivedPerc = ele.totalReceivedPerc + '%';
            return ele;
          });
          this.sharedService.loadingChanged.next(false);
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.sharedService.loadingChanged.next(false);
        console.log(err);
      }
    });
  }

  openAddInitialRejectionDialog() {
    const dialogRef = this.dialog.open(AddIntialRejectionDialogComponent,
      {
        panelClass: ['primary-dialog', 'dialog-sm'],
        data: this.selectedPayerAndDate
      });
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.status) {
        this.getAccountReceivableData();
      }
    }, error => {

    });
  }

  deletePayment() {
    this.sharedService.loadingChanged.next(true);
    this.collectionManagementService.deletePayment(
      this.sharedService.providerId,
      1
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.sharedService.loadingChanged.next(false);
          this.dialogService.openMessageDialog(new MessageDialogData('',
            `Payment was deleted successfully.`,
            false))
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.sharedService.loadingChanged.next(false);
        this.dialogService.openMessageDialog(new MessageDialogData('', err.message, true));
        console.log(err);
      }
    });
  }
  setSelcetedPayerAndDate(item) {
    this.selectedPayerAndDate = {
      rejectionDate: new Date(item.month),
      payerId: this.payerId
    }
  }

}
