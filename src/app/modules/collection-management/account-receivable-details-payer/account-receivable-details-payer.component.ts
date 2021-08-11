import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { CollectionManagementService } from 'src/app/services/collection-management/collection-management.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';
import { AddIntialRejectionDialogComponent } from '../add-intial-rejection-dialog/add-intial-rejection-dialog.component';

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
  sumOfTotalReceivableObj: any;
  payerName: string;
  constructor(public dialog: MatDialog, private collectionManagementService: CollectionManagementService, private sharedService: SharedServices, private dialogService: DialogService, private routeActive: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeActive.queryParams.subscribe(params => {
      if (params.year != null) {
        this.year = params.year;
      }
      if (params.payerId != null) {
        this.payersList = this.sharedService.getPayersList();
        this.payerId = params.payerId;
        const payerData = this.payersList.find(sele => sele.id === parseInt(this.payerId));
        this.payerName = payerData !== undefined ? payerData.name + ' ' + payerData.arName : this.payerId;
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
          let sumTotalSubmitted = 0, sumTotalReceivedAmount = 0, sumTotalReceivedAmountPerc = 0, initRejectionAmount = 0, initRejectionAmountPerc = 0, avgTat = 0, sumTotalOutstandingAmount = 0;
          this.receivableDetailsData.map(ele => {
            const payerData = this.payersList.find(sele => sele.id === parseInt(ele.payerId));
            ele.payerName = payerData !== undefined ? payerData.name + ' ' + payerData.arName : ele.payerId;
            if (ele.initRejectionPerc !== null)
              ele.initRejectionPerc = ele.initRejectionPerc + '%';

            if (ele.totalReceivedPerc !== null)
              ele.totalReceivedPerc = ele.totalReceivedPerc + '%';

            let allMonthsAvgTat = 0;

            if (ele.payments !== null) {
              ele.payments.map((subele) => {
                subele.paymentRatio = subele.paymentRatio !== null ? subele.paymentRatio + '%' : subele.paymentRatio;
                allMonthsAvgTat += subele.tat === undefined && subele.tat === undefined ? 0 : subele.tat;
                return subele
              });
            }


            sumTotalSubmitted += ele.totalSubmitted;
            sumTotalReceivedAmount += ele.totalReceivedAmount;
            initRejectionAmount += ele.initRejectionAmount;
            ele.avgTat = allMonthsAvgTat;
            avgTat += ele.avgTat;
            sumTotalOutstandingAmount += ele.outstandingAmount;
            return ele;
          });

          sumTotalReceivedAmountPerc = (sumTotalReceivedAmount / sumTotalSubmitted) * 100;
          initRejectionAmountPerc = (initRejectionAmount / sumTotalSubmitted) * 100;

          this.sumOfTotalReceivableObj = {
            sumTotalSubmitted: sumTotalSubmitted.toFixed(2),
            sumTotalReceivedAmount: sumTotalReceivedAmount.toFixed(2),
            sumTotalReceivedAmountPerc: sumTotalReceivedAmountPerc !== null && !isNaN(sumTotalReceivedAmountPerc) ? sumTotalReceivedAmountPerc.toFixed(2) + '%' : '0%',
            initRejectionAmountPerc: initRejectionAmountPerc !== null && !isNaN(initRejectionAmountPerc) ? initRejectionAmountPerc.toFixed(2) + '%' : '0%',
            initRejectionAmount: initRejectionAmount.toFixed(2),
            sumAvgTat: avgTat.toFixed(2),
            sumTotalOutstandingAmount: sumTotalOutstandingAmount.toFixed(2)
          }
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

  deletePayment(id) {
    this.sharedService.loadingChanged.next(true);
    this.dialogService.openMessageDialog(
      new MessageDialogData('Delete Record?',
        `Are you sure you want to delete it?`,
        false,
        true)).subscribe(result => {
          if (result === true) {
            this.collectionManagementService.deletePayment(
              this.sharedService.providerId,
              id
            ).subscribe(event => {
              if (event instanceof HttpResponse) {
                if (event.status === 200) {
                  this.sharedService.loadingChanged.next(false);
                  this.dialogService.openMessageDialog(new MessageDialogData('',
                    `Payment was deleted successfully.`,
                    false));
                  this.getAccountReceivableData();
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
        });
  }
  setSelcetedPayerAndDate(item) {
    this.selectedPayerAndDate = {
      rejectionDate: new Date(item.month),
      payerId: this.payerId
    }
  }

}
