import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { SharedServices } from 'src/app/services/shared.services';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';

@Component({
  selector: 'app-account-receivable-details',
  templateUrl: './account-receivable-details.component.html',
  styles: []
})
export class AccountReceivableDetailsComponent implements OnInit {
  recordOneOpen = false;
  recordTwoOpen = false;
  chartColors = this.sharedService.getMonoToneColor(3);
  public doughnutChartLabels: Label[] = ['Payment 1', 'Payment 2', 'Payment 3', 'Amount Outstanding'];
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
      data: [231, 450, 437, 382],
      borderWidth: 1,
      backgroundColor: this.chartColors,
      hoverBackgroundColor: this.chartColors
    }
  ];
  public doughnutChartType: ChartType = 'doughnut';

  constructor(public dialog: MatDialog, public sharedService: SharedServices) {
    this.chartColors.push('#ececec');
  }

  ngOnInit() {
  }

  openAddPaymentDialog(event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(AccountReceivableAddPaymentComponent,
      {
        panelClass: ['primary-dialog']
      });
  }

}
