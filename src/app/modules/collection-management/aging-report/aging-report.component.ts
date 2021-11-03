import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-aging-report',
  templateUrl: './aging-report.component.html',
  styles: []
})
export class AgingReportComponent implements OnInit {
  currentDetailsOpen = -1;
  formatDate(date:Date){

    return this.datePipe.transform(date, 'yyyy-MM-dd') ;
  }
  today = this.formatDate(new Date())
  errorMessage="No payment contract exists to show Aging Report";
  
  date = new FormControl(this.today);
  public chartFontFamily = '"Poppins", sans-serif';
  public chartFontColor = '#2d2d2d';
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor
        }
      }],
      yAxes: [{
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          beginAtZero: true
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily
    },
  };
  public barChartLabels: Label[] = ['1-30', '31-60', '61-90', '91-120', '121-150', '151-180', '181-365', '> 365'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    {
      data: [65, 59, 80, 81, 56, 55, 40, 30],
      backgroundColor: '#3060AA',
      hoverBackgroundColor: '#3060AA',
      datalabels: {
        display: false
      }
    },
  ];
  report = [
    {
      className: 'semibold', payer: 'All', amountOutStanding: 500, totalAmoount: 1000, aged1to30: 0, aged31to60: 0, aged61to90: 0,
      aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 500
    },
    {
      className: '', payer: 'Tawuniya', amountOutStanding: 500, totalAmoount: 1000, aged1to30: 0, aged31to60: 0, aged61to90: 0,
      aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 500
    },
    {
      className: '', payer: 'Bupa', amountOutStanding: 100, totalAmoount: 100, aged1to30: 0, aged31to60: 0, aged61to90: 0,
      aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 0
    },
    {
      className: '', payer: 'Medgulf', amountOutStanding: 645.75, totalAmoount: 645.75, aged1to30: 0, aged31to60: 0, aged61to90: 0,
      aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 645.75
    },
    {
      className: '', payer: 'Sagar', amountOutStanding: 35.40, totalAmoount: 35.40, aged1to30: 0, aged31to60: 0, aged61to90: 0,
      aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 35.40
    },
    {
      className: '', payer: 'Allianz', amountOutStanding: 0, totalAmoount: 605, aged1to30: 0, aged31to60: 0, aged61to90: 0,
      aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 0
    },
  ];
  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
  }

  toggleRow(index) {
    this.currentDetailsOpen = (this.currentDetailsOpen == index) ? -1 : index;

  }

}
