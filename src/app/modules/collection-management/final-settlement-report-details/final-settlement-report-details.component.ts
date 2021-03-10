import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-final-settlement-report-details',
  templateUrl: './final-settlement-report-details.component.html',
  styles: []
})
export class FinalSettlementReportDetailsComponent implements OnInit {
  public chartLabels: Label[] = ['Payment Amount', 'Billed Amounts'];
  public chartData: ChartDataSets[] = [
    {
      data: [1615365.32, 765301.29, 336781.30, 1952146.62, 428519.99],
      borderWidth: 1,
      backgroundColor: ['#1F78B4', '#A6CEE3', '#B2DF8A', '#33A02C', '#FB9A99'],
      hoverBackgroundColor: ['#1F78B4', '#A6CEE3', '#B2DF8A', '#33A02C', '#FB9A99']
    }
  ];
  public chartType: ChartType = 'doughnut';
  public chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    aspectRatio: 1,
    cutoutPercentage: 80,
    plugins: {
      datalabels: {
        display: false
      }
    },
    tooltips: {
      enabled: false
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
