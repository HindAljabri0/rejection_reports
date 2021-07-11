import { Component, HostListener, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-account-receivable-breakdown-report',
  templateUrl: './account-receivable-breakdown-report.component.html',
  styles: []
})
export class AccountReceivableBreakdownReportComponent implements OnInit {
  chartMode = 0;
  public chartFontFamily = '"Poppins", sans-serif';
  public chartFontColor = '#2d2d2d';
  public paymentStatusChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    legend: {
      position: 'bottom',
      labels: {
        fontColor: this.chartFontColor,
        fontFamily: this.chartFontFamily
      }
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily,
    },
  };
  public paymentStatusChartLabels: Label[] = ['Paid', 'Unpaid'];
  public paymentStatusChartData: ChartDataSets[] = [
    {
      data: [60, 40],
      backgroundColor: ['#3FE04A', '#FF7171'],
      hoverBackgroundColor: ['#3FE04A', '#FF7171'],
      borderColor: ['#fff', '#fff'],
      borderWidth: 3,
      hoverBorderColor: ['#fff', '#fff']
    }
  ];
  public paymentStatusChartType: ChartType = 'pie';
  public paymentStatusChartLegend = true;

  public paymentCategoryChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    legend: {
      position: 'right',
      labels: {
        fontColor: this.chartFontColor,
        fontFamily: this.chartFontFamily
      }
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily,
    },
  };
  public paymentCategoryChartLabels: Label[] = ['Monthly', 'Reconciled Payment'];
  public paymentCategoryChartData: ChartDataSets[] = [
    {
      data: [75, 25],
      backgroundColor: ['#2394E0', '#F471FF'],
      hoverBackgroundColor: ['#2394E0', '#F471FF'],
      borderColor: ['#fff', '#fff'],
      borderWidth: 3,
      hoverBorderColor: ['#fff', '#fff']
    }
  ];
  public paymentCategoryChartType: ChartType = 'pie';
  public paymentCategoryChartLegend = true;


  public paymentTypeChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    legend: {
      position: 'right',
      labels: {
        fontColor: this.chartFontColor,
        fontFamily: this.chartFontFamily
      }
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily,
    },
  };
  public paymentTypeChartLabels: Label[] = ['Regular', 'Prompt / Early'];
  public paymentTypeChartData: ChartDataSets[] = [
    {
      data: [45, 55],
      backgroundColor: ['#006607', '#60DCFA'],
      hoverBackgroundColor: ['#006607', '#60DCFA'],
      borderColor: ['#fff', '#fff'],
      borderWidth: 3,
      hoverBorderColor: ['#fff', '#fff']
    }
  ];
  public paymentTypeChartType: ChartType = 'pie';
  public paymentTypeChartLegend = true;


  public payerBreakdownChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    legend: {
      position: 'bottom',
      labels: {
        fontColor: this.chartFontColor,
        fontFamily: this.chartFontFamily
      }
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily,
    },
  };
  public payerBreakdownChartLabels: Label[] = ['Bupa', 'AXA', 'Medgulf', 'Enayah', 'Malath'];
  public payerBreakdownChartData: ChartDataSets[] = [
    {
      data: [28, 22, 5, 20, 25],
      backgroundColor: ['#1F78B4', '#A6CEE3', '#B2DF8A', '#33A02C', '#FB9A99'],
      hoverBackgroundColor: ['#1F78B4', '#A6CEE3', '#B2DF8A', '#33A02C', '#FB9A99'],
      borderColor: ['#fff', '#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1,
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff', '#fff']
    }
  ];
  public payerBreakdownChartType: ChartType = 'pie';
  public payerBreakdownChartLegend = true;

  constructor() { }

  ngOnInit() {
  }

  public paymentStatusChartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    this.chartMode++;
    if (this.chartMode == 3) {
      this.chartMode = 0;
    }
    if (this.chartMode == 0) {
      this.paymentStatusChartData[0].backgroundColor = ['#3FE04A', '#FF7171'];
      this.paymentStatusChartData[0].hoverBackgroundColor = ['#3FE04A', '#FF7171'];
    } else if (this.chartMode == 1) {
      this.paymentStatusChartData[0].backgroundColor = ['#3FE04A', '#f2f2f2'];
      this.paymentStatusChartData[0].hoverBackgroundColor = ['#3FE04A', '#f2f2f2'];
    } else if (this.chartMode == 2) {
      this.paymentStatusChartData[0].backgroundColor = ['#f2f2f2', '#FF7171'];
      this.paymentStatusChartData[0].hoverBackgroundColor = ['#f2f2f2', '#FF7171'];
    }
  }

}
