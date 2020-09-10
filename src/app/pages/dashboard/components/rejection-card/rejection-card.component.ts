import { getDepartments } from './../../store/dashboard.reducer';
import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import { MemoizedSelector, DefaultProjectorFn, Store } from '@ngrx/store';
import { getRejectedClaims } from '../../store/dashboard.reducer';
import { RejectionCardData } from './rejectionCardData';

@Component({
  selector: 'dashboard-rejection-card',
  templateUrl: './rejection-card.component.html',
  styleUrls: ['./rejection-card.component.css']
})
export class RejectionCardComponent implements OnInit {

  @Input()
  storeSelector: MemoizedSelector<object, { loading: boolean; data: RejectionCardData; error?: string; }, DefaultProjectorFn<{ loading: boolean; data: RejectionCardData; error?: string; }>>;
  @Input()
  unit: string = 'Claims';

  rejectionByPayerTotalClaims;

  data: RejectionCardData = new RejectionCardData();

  loading: boolean = false;
  departments: any;
  error: any;

  doughnutChartLabels: Label[] = [];
  doughnutChartData: MultiDataSet = [];
  doughnutChartType: ChartType = 'doughnut';
  options: ChartOptions = {
    legend: { display: false }
  };
  colors: Color[] = [
    { backgroundColor: [] }
  ];

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.select(getDepartments).subscribe(departments => this.departments = departments);
    this.store.select(this.storeSelector).subscribe(rejectionData => {
      this.data = rejectionData.data;
      this.loading = rejectionData.loading;
      this.error = rejectionData.error;

      /*if (this.data.rejectionBy == 'Department' && this.departments != null) {

        this.data.topFive = 
          this.data.topFive.map(value => this.departments.find(department => department.departmentId == value.label))
      }*/
      this.updateValues();
    });

    let colors: string[] = [];
    for (var i = 0; i < 5; i++) {
      colors.push(this.generateRandomColor(this.hue, this.sat, this.light));
    }
    colors.push('gray');
    this.colors[0].backgroundColor = colors;
  }

  updateValues() {
    if (this.data == null) return;
    this.doughnutChartData = [];
    this.doughnutChartLabels = this.data.topFive.map(item =>this.getDepartmentName(item.label));
    this.doughnutChartData.push(this.data.topFive.map(item => item.total));
    if (this.data.total != null && this.data.total > 0) {
      const othersValue = this.data.total - this.data.topFive.map(item => item.total).reduce((item1, item2) => item1 + item2);
      if (othersValue > 0) {
        this.doughnutChartLabels.push('Others');
        this.doughnutChartData[0].push(othersValue);
      }
    }
    if (this.data.rejectionBy != 'Service') {
      this.store.select(getRejectedClaims).subscribe(summary => {
        this.rejectionByPayerTotalClaims = summary.data['totalClaims'];
        const othersValue = this.rejectionByPayerTotalClaims - this.data.topFive.map(item => item.total).reduce((item1, item2) => item1 + item2);
        if (othersValue > 0) {
          this.doughnutChartLabels.push('Others');
          this.doughnutChartData[0].push(othersValue);
        }
      }).unsubscribe();
    }
  }

  hue: number;
  sat: number;
  light: number;

  generateRandomColor(hue?, sat?, light?) {
    if (hue == null) hue = this.randomNum(0, 360);
    if (hue > 288 && hue < 316) {
      hue = this.randomNum(316, 360);
    } else if (hue > 280 && hue < 288) {
      hue = this.randomNum(260, 280);
    }
    if (sat == null) sat = this.randomNum(75, 100);
    if (light == null) light = this.randomNum(40, 65);
    this.hue = hue + 25 > 360 ? (hue + 25) - 360 : hue + 25;
    this.sat = sat;
    this.light = light + 15 > 65 ? 65 : light + 15;
    return `hsl(${hue}, ${sat}%, ${light}%)`;
  }

  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  getDepartmentName(code:string){
  if (this.departments != null){
    const index = this.departments.findIndex(department => department.departmentId  + '' == code);
    if (index != -1) {
      return this.departments[index].name;
    }
  }
  return code;
  }

}

