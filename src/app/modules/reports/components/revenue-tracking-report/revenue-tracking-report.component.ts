import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-revenue-tracking-report',
  templateUrl: './revenue-tracking-report.component.html',
  styles: []
})
export class RevenueTrackingReportComponent implements OnInit {
  public chartFontFamily = '"Poppins", sans-serif';
  public chartFontColor = '#2d2d2d';
  public lineChartData: ChartDataSets[] = [
    {
      data: [200000, 300000, 400000, 600000, 500000, 500000, 400000, 600000, 300000, 400000, 800000, 500000],
      label: 'Medgulf',
      lineTension: 0,
      borderWidth: 2,
      datalabels: {
        display: false
      }
    },
    {
      data: [300000, 400000, 450000, 500000, 450000, 450000, 400000, 500000, 400000, 450000, 600000, 500000],
      label: 'Rajhi',
      lineTension: 0,
      borderWidth: 2,
      datalabels: {
        display: false
      }
    },
  ];
  public lineChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public lineChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor
        },
        scaleLabel: {
          display: true,
          labelString: 'Year',
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          fontSize: 18,
          lineHeight: '24px',
          padding: {
            top: 8
          }
        }
      }],
      yAxes: [{
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: 'Amount',
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          fontSize: 18,
          lineHeight: '24px',
          padding: {
            bottom: 8
          }
        }
      }]
    },
    legend: {
      labels: {
        fontFamily: this.chartFontFamily,
        fontColor: this.chartFontColor
      }
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily,
    },
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: '#39E6BE',
      pointBackgroundColor: 'rgba(0,0,0,0)',
      pointBorderColor: 'rgba(0,0,0,0)',
      pointHoverBackgroundColor: 'rgba(0,0,0,0)',
      pointHoverBorderColor: 'rgba(0,0,0,0)',
    },
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: '#6495E2',
      pointBackgroundColor: 'rgba(0,0,0,0)',
      pointBorderColor: 'rgba(0,0,0,0)',
      pointHoverBackgroundColor: 'rgba(0,0,0,0)',
      pointHoverBorderColor: 'rgba(0,0,0,0)',
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';


  public barChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        stacked: true,
        gridLines: {
          display: false
        },
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor
        },
        scaleLabel: {
          display: true,
          labelString: 'Months',
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          fontSize: 18,
          lineHeight: '24px',
          padding: {
            top: 8
          }
        }
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: 'Amount',
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          fontSize: 18,
          lineHeight: '24px',
          padding: {
            bottom: 8
          }
        }
      }]
    },
    legend: {
      labels: {
        fontFamily: this.chartFontFamily,
        fontColor: this.chartFontColor
      }
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily,
    },
  };
  public barChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    {
      data: [200000, 200000, 75000, 500000, 350000, 75000, 200000, 200000, 75000, 500000, 350000, 75000],
      label: 'ED-o1',
      datalabels: {
        display: false
      },
      barPercentage: 0.65,
      backgroundColor: '#3060AA',
      hoverBackgroundColor: '#3060AA',
      borderWidth: 0
    },
    {
      data: [100000, 150000, 225000, 100000, 150000, 600000, 100000, 150000, 225000, 100000, 150000, 600000],
      label: 'Cons',
      datalabels: {
        display: false
      },
      barPercentage: 0.65,
      backgroundColor: '#6495E2',
      hoverBackgroundColor: '#6495E2',
      borderWidth: 0
    },
    {
      data: [200000, 400000, 425000, 225000, 225000, 200000, 175000, 400000, 425000, 225000, 225000, 200000],
      label: 'Ed-01',
      datalabels: {
        display: false
      },
      barPercentage: 0.65,
      backgroundColor: '#ADCDFF',
      hoverBackgroundColor: '#ADCDFF',
      borderWidth: 0
    }
  ];
  allChart = true;
  serviceChart = false;

  constructor() { }

  ngOnInit(): void {
  }

  showAllChart() {
    this.allChart = true;
    this.serviceChart = false;
  }
  showServiceChart() {
    this.allChart = false;
    this.serviceChart = true;
  }

}
