import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-regular-payment-details',
  templateUrl: './regular-payment-details.component.html',
  styles: []
})
export class RegularPaymentDetailsComponent implements OnInit {
  public chartLabels: Label[] = ['Payment Amount', 'Billed Amounts'];
  public chartData: ChartDataSets[] = [
    {
      data: [1615365.32, 765301.29],
      borderWidth: 0,
      backgroundColor: ['#29bf24', '#CC2F2F'],
      hoverBackgroundColor: ['#29bf24', '#CC2F2F']
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
