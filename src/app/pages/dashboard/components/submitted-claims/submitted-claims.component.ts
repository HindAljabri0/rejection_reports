import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import {
  getSubmittedClaims,
  getPaidClaims,
  getPartiallyPaidClaims,
  getUnderProcessingClaims,
  getRejectedClaims,
  DashboardCardData
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
  public doughnutChartData: ChartDataSets[] = [
    {
      data: [10, 55, 10, 25],
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
    // this.store.select(getSubmittedClaims).subscribe(data => this.summaries[0] = { ...data, title: 'All Claims After Submission' });
    // this.store.select(getPaidClaims).subscribe(data => this.summaries[1] = data);
    // this.store.select(getPartiallyPaidClaims).subscribe(data => this.summaries[2] = data);
    // this.store.select(getRejectedClaims).subscribe(data => this.summaries[3] = data);
    // this.store.select(getUnderProcessingClaims).subscribe(data => this.summaries[4] = data);
    this.store.select(getSubmittedClaims).pipe(
      withLatestFrom(this.store.select(getPaidClaims)),
      map(values => ({ submittedClaims: values[0], paidClaims: values[1] })),
      withLatestFrom(this.store.select(getPartiallyPaidClaims)),
      map(values => ({ ...values[0], partiallyPaidClaims: values[1] })),
      withLatestFrom(this.store.select(getRejectedClaims)),
      map(values => ({ ...values[0], rejectedClaims: values[1] })),
      withLatestFrom(this.store.select(getUnderProcessingClaims)),
      map(values => ({ ...values[0], processingClaims: values[1] }))
    ).subscribe(summaries => {
      this.summaries = summaries;
      console.log(summaries);
    });
  }

  getCardName(status: string) {
    return this.sharedServices.statusToName(status);
  }

  getCardColor(status: string) {
    return this.sharedServices.getCardAccentColor(status);
  }

}
