import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, BaseChartDirective } from 'ng2-charts';
import { SharedServices } from 'src/app/services/shared.services';
import { generateCleanClaimProgressReport, GrowthRate } from 'src/app/models/generateCleanClaimProgressReport';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { DatePipe } from '@angular/common';

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
          labelString: '',
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          fontSize: 18,
          lineHeight: '24px',
          padding: {
            top: 8
          }
        }
      }],
      yAxes: [{
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
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [
    {
      data: [],
      label: '',
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
      data: [],
      label: '',
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
  payersList: { id: number, name: string, arName: string }[] = [];
  generateReport: generateCleanClaimProgressReport = new generateCleanClaimProgressReport();
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'YYYY' };
  beforeDatePickerTitle = 'before year';
  afterDatePickerTitle = 'after year'
  percenatgeChartData: any = [];
  months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  normalDays = ['DAY 1', 'DAY 2'];
  percentageConfig = [{
    key: 'Year', value: this.months,
  },
  {
    key: 'Month', value: [],
  },
  {
    key: 'Week', value: this.days,
  },
  {
    key: 'Day', value: this.normalDays,
  }
  ];
  get providerId(): string {
    return this.sharedService.providerId;
  }
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  constructor(private sharedService: SharedServices, private reportSerice: ReportsService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.payersList = this.sharedService.getPayersList();
  }

  onOpenCalendar(container) {
    // For year picker
    if (this.generateReport.comparisionCriteria === 'Year') {
      container.yearSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
      };
      container.setViewMode('year');
    }
    // For month picker
    if (this.generateReport.comparisionCriteria === 'Month') {
      container.monthSelectHandler = (event: any): void => {
        container._store.dispatch(container._actions.select(event.date));
      };
      container.setViewMode('month');
    }
  }

  comparisionCriteriaChange(event) {
    this.generateReport.comparisionCriteria = event.value;
    if (event.value === 'Month') {
      this.datePickerConfig = { dateInputFormat: 'MMM YYYY' };
    } else if (event.value === 'Week') {
      this.datePickerConfig = { selectWeek: true, selectFromOtherMonth: true, dateInputFormat: 'DD/MM/YYYY' };
    } else if (event.value) {
      this.datePickerConfig = { dateInputFormat: 'DD/MM/YYYY' };
    } else {
      this.datePickerConfig = { dateInputFormat: 'YYYY' }
    }
  }

  generate() {
    let body = { ...this.generateReport };
    body.beforeDate = this.setDate(body.beforeDate);
    body.afterDate = this.setDate(body.afterDate);
    this.reportSerice.generateCleanClaimProgressReport(this.providerId, body).subscribe(event => {
      if (event.body !== undefined) {
        this.barChartOptions.scales.xAxes[0].scaleLabel.labelString = this.generateReport.comparisionCriteria;
        const data = JSON.parse(event.body);
        this.barChartData[0].label = data[0].label;
        this.barChartData[1].label = data[1].label;
        this.barChartData[0].data = data[0].totalNetAmount;
        this.barChartData[1].data = data[1].totalNetAmount;

        this.percenatgeChartData = [];
        const firstYearData = data[0].totalNetAmount;
        const secondYearData = data[1].totalNetAmount;
        const percentageLabelData = this.percentageConfig.find(ele => ele.key === this.generateReport.comparisionCriteria).value;
        firstYearData.map((ele, index) => {
          let value = 0;
          if (ele === 0 && secondYearData[index] > ele)
            value = 100;
          else if (secondYearData[index] === 0 && ele > secondYearData[index])
            value = 100;
          const finalValue = ele !== 0 && secondYearData[index] !== 0 ? ele > secondYearData[index] ? (100 - (secondYearData[index] * 100) / ele) : (100 - (ele * 100) / secondYearData[index]) : value;
          if (this.generateReport.comparisionCriteria === "Month")
            percentageLabelData[index] = 'WEEK ' + (index + 1);

          const obj = {
            label: percentageLabelData[index],
            value: ele === 0 && secondYearData[index] === 0 ? this.Rate.Equal : ele > secondYearData[index] ? this.Rate.Down : this.Rate.Up,
            data: Number(finalValue.toFixed(2))
          };
          this.percenatgeChartData.push(obj);
        });
        this.barChartLabels = this.percenatgeChartData.map(ele => ele.label);
        this.chart.ngOnChanges({});
      }

    });
  }

  get Rate() {
    return GrowthRate;
  }

  private setDate(date) {
    if (this.generateReport.comparisionCriteria === 'Week') {
      const diff = date.getDate() - date.getDay();
      return this.datePipe.transform(new Date(date.setDate(diff)), 'yyyy-MM-dd');
    } else {
      return this.datePipe.transform(date, 'yyyy-MM-dd');
    }
  }
}


