import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-revenue-report',
  templateUrl: './revenue-report.component.html',
  styles: []
})
export class RevenueReportComponent implements OnInit {

  public doughnutChartLabels: Label[] = ['Tawuniya', 'Malath', 'AXA', 'SAICO', 'Rajhi'];
  public doughnutChartData: ChartDataSets[] = [
    {
      data: [3, 3, 2, 1, 1],
      backgroundColor: ['#5fec8c', '#5fecc7', '#5fd7ec', '#5f9cec', '#5f62ec'],
      hoverBackgroundColor: ['#5fec8c', '#5fecc7', '#5fd7ec', '#5f9cec', '#5f62ec'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 2,
      datalabels: {
        display: false
      }
    }
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 1.7 / 1,
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    cutoutPercentage: 75
  };

  constructor() { }

  ngOnInit() {
  }

}
