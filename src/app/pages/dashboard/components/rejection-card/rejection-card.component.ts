import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'dashboard-rejection-card',
  templateUrl: './rejection-card.component.html',
  styleUrls: ['./rejection-card.component.css']
})
export class RejectionCardComponent implements OnInit {
  @Input()
  data: RejectionCardData;

  doughnutChartLabels: Label[] = [];
  doughnutChartData: MultiDataSet = [];
  doughnutChartType: ChartType = 'doughnut';
  options: ChartOptions = {
    legend: { display: false }
  };
  colors: Color[] = [
    { backgroundColor: ['#1F78B4', '#A6CEE3', '#B2DF8A', '#33A02C', '#FB9A99', 'gray'] }
  ]
  constructor() { }

  ngOnInit() {
    this.doughnutChartLabels = this.data.topFive.map(item => item.label);

    this.doughnutChartData.push(this.data.topFive.map(item => item.total));
    const othersValue = this.data.total - this.data.topFive.map(item => item.total).reduce((item1, item2) => item1 + item2);
    if (othersValue > 0) {
      this.doughnutChartLabels.push('Others');
      this.doughnutChartData[0].push(othersValue);
    }
    let colors: string[] = [];
    for (var i = 0; i < 6; i++) {
      colors.push(this.generateRandomColor(this.hue, this.sat, this.light));
    }
    this.colors[0].backgroundColor = colors;
  }

  hue:number;
  sat:number;
  light:number;

  generateRandomColor(hue?, sat?, light?) {
    if (hue == null) hue = this.randomNum(0, 360);
    if (hue > 288 && hue < 316) {
      hue = this.randomNum(316, 360);
    } else if (hue > 280 && hue < 288) {
      hue = this.randomNum(260, 280);
    }
    if (sat == null) sat = this.randomNum(75, 100);
    if (light == null) light = this.randomNum(40, 65);
    this.hue = hue + 35 > 360 ? (hue + 35) - 360 : hue + 35;
    this.sat = sat;
    this.light = light + 15 > 65 ? 65 : light + 15;
    return `hsl(${hue}, ${sat}%, ${light}%)`;
  }

  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export class RejectionCardData {
  rejectionBy: string;
  total: number;
  topFive: { label: string, total: number }[] = [];
}