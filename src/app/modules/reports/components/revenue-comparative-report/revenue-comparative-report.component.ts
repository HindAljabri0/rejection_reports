import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-revenue-comparative-report',
  templateUrl: './revenue-comparative-report.component.html',
  styles: []
})
export class RevenueComparativeReportComponent implements OnInit {

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
    }
  ];
  public lineChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 1.6 / 1,
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
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  constructor() { }

  ngOnInit() {
  }

}
