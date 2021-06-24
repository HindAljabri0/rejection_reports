import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { SharedServices } from 'src/app/services/shared.services';
import { AccountReceivableAddBatchComponent } from '../account-receivable-add-batch/account-receivable-add-batch.component';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';

@Component({
  selector: 'app-account-receivable-details',
  templateUrl: './account-receivable-details.component.html',
  styles: []
})
export class AccountReceivableDetailsComponent implements OnInit {
  recordOneOpen = false;
  recordTwoOpen = false;
  chartColors = this.sharedService.getAnalogousColor(8);
  public doughnutChartLabels: Label[] = ['Payment 1', 'Payment 2', 'Payment 3', 'Payment 4', 'Payment 5', 'Payment 6', 'Payment 7', 'Payment 8'];
  public doughnutChartOptions: ChartOptions = {
    legend: {
      display: false
    },
    plugins: {
      datalabels: {
        display: false
      }
    },
  };
  public doughnutChartData: ChartDataSets[] = [
    {
      data: [56, 5, 94, 94, 82, 49, 47, 26],
      borderWidth: 1,
      backgroundColor: this.chartColors,
      hoverBackgroundColor: this.chartColors
    }
  ];
  public doughnutChartType: ChartType = 'doughnut';

  constructor(public dialog: MatDialog, public sharedService: SharedServices) { }

  ngOnInit() {
  }

  openAddBatchDialog() {
    let dialogRef = this.dialog.open(AccountReceivableAddBatchComponent, { panelClass: ['primary-dialog'], autoFocus: false });
  }

  openAddPaymentDialog(event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(AccountReceivableAddPaymentComponent,
      {
        panelClass: ['primary-dialog']
      });
  }

}
