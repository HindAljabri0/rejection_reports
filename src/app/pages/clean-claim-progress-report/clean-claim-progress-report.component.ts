import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-clean-claim-progress-report',
  templateUrl: './clean-claim-progress-report.component.html',
  styles: []
})
export class CleanClaimProgressReportComponent implements OnInit {
  public chartFontFamily = '"Poppins", sans-serif';
  public chartFontColor = '#2d2d2d';
  public barChartOptions: ChartOptions = {
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
      }], yAxes: [{
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor
        },
        scaleLabel: {
          display: true,
          labelString: 'Claims',
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
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
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
      footerFontFamily: this.chartFontFamily
    },
    title: {
      display: true,
      text: 'Total Net Amount Tracking Report',
      fontFamily: this.chartFontFamily,
      fontColor: this.chartFontColor,
      fullWidth: true,
      fontSize: 16
    }
  };
  public barChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    {
      data: [10000, 26000, 35000, 8000, 63000, 5000, 26000, 35000, 7000, 62000, 5000, 28000],
      label: 'Year 2018',
      categoryPercentage: 0.85,
      barPercentage: 0.85,
      backgroundColor: '#ff9900',
      hoverBackgroundColor: '#ff9900',
      datalabels: {
        color: this.chartFontColor,
        padding: {
          bottom: -5
        },
        font: {
          weight: 600,
          size: 11,
          family: this.chartFontFamily
        }
      }
    },
    {
      data: [20000, 27000, 50000, 41236, 50000, 20000, 4000, 50000, 41236, 50000, 20000, 6000],
      label: 'Year 2019',
      categoryPercentage: 0.85,
      barPercentage: 0.85,
      backgroundColor: '#3366cc',
      hoverBackgroundColor: '#3366cc',
      datalabels: {
        color: this.chartFontColor,
        padding: {
          bottom: 10
        },
        font: {
          weight: 600,
          size: 11,
          family: this.chartFontFamily
        }
      }
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  onOpenCalendar(container) {
    // For year picker
    // container.yearSelectHandler = (event: any): void => {
    //   container._store.dispatch(container._actions.select(event.date));
    // };
    // container.setViewMode('year');

    // For month picker
    // container.monthSelectHandler = (event: any): void => {
    //   container._store.dispatch(container._actions.select(event.date));
    // };
    // container.setViewMode('month');
  }

}
