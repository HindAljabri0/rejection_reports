import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import {
  getSubmittedClaims,
  getPaidClaims,
  getPartiallyPaidClaims,
  getUnderProcessingClaims,
  getRejectedClaims,
  DashboardCardData,
  getAllClaimAfterSubmission
} from '../../store/dashboard.reducer';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { map, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-submitted-claims',
  templateUrl: './submitted-claims.component.html',
  styles: []
})
export class SubmittedClaimsComponent implements OnInit {

  public doughnutChartLabels: Label[] = ['Under Processing', 'Paid', 'Partially Paid', 'Rejected by Payer'];
  public claimsChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1
    }
  ];

  public grossChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1
    }
  ];

  public netChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1
    }
  ];

  public vatChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1
    }
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartOptions = {
    aspectRatio: 1 / 1,
    responsive: true,
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    cutoutPercentage: 75
  };
  summaries: {
    processingClaims: DashboardCardData;
    rejectedClaims: DashboardCardData;
    partiallyPaidClaims: DashboardCardData;
    submittedClaims: DashboardCardData;
    paidClaims: DashboardCardData;
  };

  constructor(private sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.store.select(getAllClaimAfterSubmission).subscribe(summaries => {
      this.summaries = summaries;
      this.modifyChartData();
    });
  }

  modifyChartData() {
    this.claimsChartData[0].data = [
      this.summaries.processingClaims.data.totalClaims,
      this.summaries.paidClaims.data.totalClaims,
      this.summaries.partiallyPaidClaims.data.totalClaims,
      this.summaries.rejectedClaims.data.totalClaims
    ];
    this.grossChartData[0].data = [
      this.summaries.processingClaims.data.gross,
      this.summaries.paidClaims.data.gross,
      this.summaries.partiallyPaidClaims.data.gross,
      this.summaries.rejectedClaims.data.gross
    ];
    this.netChartData[0].data = [
      this.summaries.processingClaims.data.totalNetAmount,
      this.summaries.paidClaims.data.totalNetAmount,
      this.summaries.partiallyPaidClaims.data.totalNetAmount,
      this.summaries.rejectedClaims.data.totalNetAmount
    ];
    this.vatChartData[0].data = [
      this.summaries.processingClaims.data.totalVatNetAmount,
      this.summaries.paidClaims.data.totalVatNetAmount,
      this.summaries.partiallyPaidClaims.data.totalVatNetAmount,
      this.summaries.rejectedClaims.data.totalVatNetAmount
    ];
  }

  getCardName(status: string) {
    return this.sharedServices.statusToName(status);
  }

  getCardColor(status: string) {
    return this.sharedServices.getCardAccentColor(status);
  }

  calculatePercetage(first: number, second: number, roundValue: number = 4) {
    const retval = parseFloat(((first / second) * 100).toFixed(roundValue));
    return isNaN(retval) ? 0 : retval.toString();
  }

}
