import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Store } from '@ngrx/store';
import { getPaginationControl } from 'src/app/claim-module-components/store/claim.reducer';

@Component({
  selector: 'app-bupa-rejection-upload-details',
  templateUrl: './bupa-rejection-upload-details.component.html',
  styles: []
})
export class BupaRejectionUploadDetailsComponent implements OnInit {

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
  paginationControl: {
    currentIndex: number;
    size: number;
  };
  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getPaginationControl).subscribe(control => {
      this.paginationControl = control;
    });
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
}

