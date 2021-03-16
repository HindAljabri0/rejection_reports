import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { getPaginationControl } from 'src/app/claim-module-components/store/claim.reducer';
import { CreditReportModel } from 'src/app/models/creditReportModel';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { Router } from '@angular/router';
import { SummaryType } from 'src/app/models/allCreditSummaryDetailsModels/summaryType';

@Component({
  selector: 'app-bupa-rejection-upload-summary',
  templateUrl: './credit-report-summary.component.html',
  styles: []
})
export class CreditReportSummaryComponent implements OnInit {
  public chartOneLabels: Label[] = ['Rejection Medical Reasons Breakdown', 'Rejection Medical Reasons Breakdown'];
  public chartOneData: ChartDataSets[] = [
    {
      data: [66, 34],
      borderWidth: 0,
      backgroundColor: ['#DB53D1', '#2D47D6'],
      hoverBackgroundColor: ['#DB53D1', '#2D47D6']
    }
  ];
  public chartOneType: ChartType = 'doughnut';
  public chartOneOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    aspectRatio: 1,
    cutoutPercentage: 75,
    plugins: {
      datalabels: {
        display: false
      }
    },
    tooltips: {
      enabled: false
    }
  };

  public chartTwoLabels: Label[] = ['Rejection Medical Reasons Breakdown', 'Rejection Medical Reasons Breakdown'];
  public chartTwoData: ChartDataSets[] = [
    {
      data: [59, 30, 11],
      backgroundColor: ['#1F78B4', '#9765C9', '#B2DF8A'],
      hoverBackgroundColor: ['#1F78B4', '#9765C9', '#B2DF8A']
    }
  ];
  public chartTwoType: ChartType = 'doughnut';
  public chartTwoOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    aspectRatio: 1,
    cutoutPercentage: 75,
    plugins: {
      datalabels: {
        display: false
      }
    },
    tooltips: {
      enabled: false
    }
  };

  paginationControl: {
    currentIndex: number;
    size: number;
  };
  summayData: CreditReportModel = new CreditReportModel();
  private subscription = new Subscription();
  constructor(private store: Store, private creditReportService: CreditReportService, private router: Router) { }

  ngOnInit() {
    this.store.select(getPaginationControl).subscribe(control => {
      this.paginationControl = control;
    });
    this.getCreditReportSummaryData();
  }
  getCreditReportSummaryData() {
    const batchId = "0";
    this.subscription.add(this.creditReportService.getCreditReportsList(batchId).subscribe((res: any) => {
      if (res.body !== undefined) {
        const data: any = JSON.stringify(res.body);
        this.summayData = data;
      }
    }, err => {
      console.log(err);
    }))
  }

  goToFirstPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {


      if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {

      }
    }
  }
  goToNextPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex + 1 < this.paginationControl.size) {

    }
  }
  goToLastPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != this.paginationControl.size - 1) {
    }
  }
  goToPrePage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  goToSummaryDetailsPage(summaryType) {
    this.router.navigate(['/reports/creditReportSummaryDetails'], { queryParams: { batchId: 0, summaryType: summaryType } })
  }

  get summType() {
    return SummaryType;
  }

}
