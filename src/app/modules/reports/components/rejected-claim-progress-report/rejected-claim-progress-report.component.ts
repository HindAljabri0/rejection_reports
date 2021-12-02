import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective, Label } from 'ng2-charts';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { rejectedClaimComparisionType, rejectedClaimProgressReport } from 'src/app/models/rejectedClaimProgressReport';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { GrowthRate } from 'src/app/models/generateCleanClaimProgressReport';

@Component({
  selector: 'app-rejected-claim-progress-report',
  templateUrl: './rejected-claim-progress-report.component.html',
  styles: []
})
export class RejectedClaimProgressReportComponent implements OnInit {
  public chartFontFamily = '"Poppins", sans-serif';
  public chartFontColor = '#2d2d2d';
  public barChartOptions: ChartOptions = {
    maintainAspectRatio: false,
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
          labelString: 'Year',
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
          fontColor: this.chartFontColor,
          beginAtZero: true
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
  public barChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [
    {
      data: [10000, 26000, 35000, 8000, 63000, 5000, 26000, 35000, 7000, 62000, 5000, 28000],
      label: 'Year 2019',
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
      data: [20000, 27000, 50000, 41236, 50000, 20000, 4000, 50000, 41236, 50000, 20000, 6000],
      label: 'Year 2021',
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

  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'YYYY' };
  generateReport: rejectedClaimProgressReport = new rejectedClaimProgressReport();




  // public chartFontFamily = '"Poppins", sans-serif';
  // public chartFontColor = '#2d2d2d';
  // public barChartOptions: ChartOptions = {
  //   responsive: true,
  //   aspectRatio: 1.6 / 1,
  //   scales: {
  //     xAxes: [{
  //       gridLines: {
  //         display: false
  //       },
  //       ticks: {
  //         fontFamily: this.chartFontFamily,
  //         fontColor: this.chartFontColor
  //       },
  //       scaleLabel: {
  //         display: true,
  //         labelString: '',
  //         fontFamily: this.chartFontFamily,
  //         fontColor: this.chartFontColor,
  //         fontSize: 18,
  //         lineHeight: '24px',
  //         padding: {
  //           top: 8
  //         }
  //       }
  //     }],
  //     yAxes: [{
  //       ticks: {
  //         fontFamily: this.chartFontFamily,
  //         fontColor: this.chartFontColor,
  //         beginAtZero: true
  //       },
  //       scaleLabel: {
  //         display: true,
  //         labelString: 'Claims',
  //         fontFamily: this.chartFontFamily,
  //         fontColor: this.chartFontColor,
  //         fontSize: 18,
  //         lineHeight: '24px',
  //         padding: {
  //           bottom: 8
  //         }
  //       }
  //     }]
  //   },
  //   plugins: {
  //     datalabels: {
  //       formatter: (value, ctx) => {
  //         return this.generateReport.rejectedClaimComparisionType === rejectedClaimComparisionType.CleanClaims
  // || this.generateReport.rejectedClaimComparisionType === rejectedClaimComparisionType.UncleanClaims ? value + "%" : value;
  //       },
  //       anchor: 'end',
  //       align: 'end',
  //     },
  //   },
  //   legend: {
  //     labels: {
  //       fontFamily: this.chartFontFamily,
  //       fontColor: this.chartFontColor
  //     }
  //   },
  //   tooltips: {
  //     bodyFontFamily: this.chartFontFamily,
  //     titleFontFamily: this.chartFontFamily,
  //     footerFontFamily: this.chartFontFamily,
  //     callbacks: {
  //       label: (tooltipItem, data) => {
  //         let allData = data.datasets[tooltipItem.datasetIndex].data;
  //         let tooltipLabel = data.labels[tooltipItem.index];
  //         let tooltipData = allData[tooltipItem.index];
  //         return this.generateReport.rejectedClaimComparisionType === rejectedClaimComparisionType.CleanClaims
  // || this.generateReport.rejectedClaimComparisionType === rejectedClaimComparisionType.UncleanClaims
  // ? tooltipLabel + " : " + tooltipData + "%" : tooltipLabel + " : " + tooltipData;
  //       }
  //     }
  //   },
  //   title: {
  //     display: true,
  //     text: 'Total Net Amount Tracking Report',
  //     fontFamily: this.chartFontFamily,
  //     fontColor: this.chartFontColor,
  //     fullWidth: true,
  //     fontSize: 16
  //   },

  // };
  // public barChartLabels: Label[] = [];
  // public barChartType: ChartType = 'bar';
  // public barChartLegend = true;
  // public barChartPlugins = [{
  //   beforeInit: (chart, options) => {
  //     chart.legend.afterFit = function () {
  //       this.height += 10;
  //     };
  //   }
  // }, pluginDataLabels];
  // public barChartData: ChartDataSets[] = [
  //   {
  //     data: [],
  //     label: '',
  //     categoryPercentage: 0.85,
  //     barPercentage: 0.85,
  //     backgroundColor: '#ff9900',
  //     hoverBackgroundColor: '#ff9900',
  //     datalabels: {
  //       color: this.chartFontColor,
  //       padding: {
  //         bottom: -5
  //       },
  //       font: {
  //         weight: 600,
  //         size: 11,
  //         family: this.chartFontFamily
  //       }
  //     }
  //   },
  //   {
  //     data: [],
  //     label: '',
  //     categoryPercentage: 0.85,
  //     barPercentage: 0.85,
  //     backgroundColor: '#3366cc',
  //     hoverBackgroundColor: '#3366cc',
  //     datalabels: {
  //       color: this.chartFontColor,
  //       padding: {
  //         bottom: 10
  //       },
  //       font: {
  //         weight: 600,
  //         size: 11,
  //         family: this.chartFontFamily
  //       }
  //     }
  //   }
  // ];
  payersList: { id: number, name: string, arName: string }[] = [];
  // generateReport: rejectedClaimProgressReport = new rejectedClaimProgressReport();
  // datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'YYYY' };
  beforeDatePickerTitle = 'before year';
  afterDatePickerTitle = 'after year';
  percenatgeChartData: any = [];
  months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  normalDays = ['DAY'];
  percentageConfig = [{
    key: 'Year', value: this.months, label: 'Months'
  },
  {
    key: 'Month', value: [], label: 'Weeks'
  },
  {
    key: 'Week', value: this.days, label: 'Days'
  },
  {
    key: 'Day', value: this.normalDays, label: 'Date'
  }
  ];
  diffrenceLableName = 'Year';
  labelConfig = [
    { type: rejectedClaimComparisionType.TotalNetAmount, value: 'Total Net Amount Tracking Report' },
    { type: rejectedClaimComparisionType.VATAmount, value: 'VAT Amount Tracking Report' },
    { type: rejectedClaimComparisionType.SUMOfTopTenRejectedService, value: 'Sum of Top 10 Rejected Services' },
  ];
  get providerId(): string {
    return this.sharedService.providerId;
  }
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  currentDate = new Date();
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
    } else if (event.value === 'Day') {
      this.datePickerConfig = { dateInputFormat: 'DD/MM/YYYY' };
    } else {
      this.datePickerConfig = { dateInputFormat: 'YYYY' };
    }
    this.generateReport.beforeDate = '';
    this.generateReport.afterDate = '';
  }

  generate() {
    const body = { ...this.generateReport };
    body.beforeDate = this.setDate(body.beforeDate);
    body.afterDate = this.setDate(body.afterDate);
    // this.reportSerice.rejectedClaimProgressReport(this.providerId, body).subscribe(event => {
    //   if (event.body !== undefined) {
    //     this.barChartOptions.scales.xAxes[0].scaleLabel.labelString = this.generateReport.comparisionCriteria;
    //     const data = JSON.parse(event.body);
    //     this.barChartData[0].label = data[0].label;
    //     this.barChartData[1].label = data[1].label;
    //     this.barChartData[0].data = data[0].totalNetAmount;
    //     this.barChartData[1].data = data[1].totalNetAmount;

    //     this.percenatgeChartData = [];
    //     const firstYearData = data[0].totalNetAmount;
    //     const secondYearData = data[1].totalNetAmount;
    //     const percentageConfig = this.percentageConfig.find(ele => ele.key === this.generateReport.comparisionCriteria);
    //     const percentageLabelData = percentageConfig.value;
    //     this.diffrenceLableName = percentageConfig.label;
    //     firstYearData.map((ele, index) => {
    //       let value = 0;
    //       if (ele === 0 && secondYearData[index] > ele)
    //         value = 100;
    //       else if (secondYearData[index] === 0 && ele > secondYearData[index])
    //         value = 100;
    //       const finalValue = ele !== 0 && secondYearData[index] !== 0 ? ele > secondYearData[index]
    // ? (100 - (secondYearData[index] * 100) / ele) : (100 - (ele * 100) / secondYearData[index]) : value;
    //       if (this.generateReport.comparisionCriteria === "Month")
    //         percentageLabelData[index] = 'WEEK ' + (index + 1);

    //       const obj = {
    //         label: percentageLabelData[index],
    //         value: ele === 0 && secondYearData[index] === 0 ? this.Rate.Equal : ele > secondYearData[index]
    // ? this.Rate.Down : this.Rate.Up,
    //         data: Number(finalValue.toFixed(2))
    //       };
    //       this.percenatgeChartData.push(obj);
    //     });
    //     this.barChartLabels = this.percenatgeChartData.map(ele => ele.label);
    //     const chartLableName = this.labelConfig.find(ele => ele.type === this.generateReport.rejectedClaimComparisionType).value;
    //     this.barChartOptions.title.text = chartLableName;

    //     if (this.chart)
    //       this.chart.ngOnChanges({});
    //   }

    // });
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
  get cptype() {
    return rejectedClaimComparisionType;
  }

  selectComparisionType(type, form) {
    if (form.invalid) {
      form.submitted = true;
      return;
    }
    this.generateReport.comparisionType = type;
    this.generate();
  }



}
