import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';

import * as moment from 'moment';
import { BaseChartDirective, Label } from 'ng2-charts';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { GrowthRate } from 'src/app/models/generateCleanClaimProgressReport';
import { RejectionComparisonReport } from 'src/app/models/RejectionComparisonReport';
import { RevenuReportService } from 'src/app/services/revenuReportService/revenu-report.service'

import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-rejection-comparison-report',
  templateUrl: './rejection-comparison-report.component.html',
  styles: []
})
export class RejectionComparisonReportComponent implements OnInit {
  check=false;
  public chartFontFamily = '"Poppins", sans-serif';
  public chartFontColor = '#2d2d2d';
  public barChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          // callback: function (value, index, values) {
          //   return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
          // }
        },
        scaleLabel: {
          display: true,
          labelString: 'Months',
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
          beginAtZero: true,
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
        formatter: (context) => {
          const amount = this.currencyPipe.transform(
            context.toString(),
            'number',
            '',
            '1.2-2'
          );
          return amount + ' SR';
        },
      },
    },
    legend: {
      labels: {
        fontFamily: this.chartFontFamily,
        fontColor: this.chartFontColor
      },

    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily,
      callbacks: {
        // label: (tooltipItem, data) => {
        //   return tooltipItem.label;
        // },
        label: (data) => {
          data.value = this.currencyPipe.transform(
            data.value,
            'number',
            '',
            '1.2-2'
          );
          return data.value + ' SR';
        },
        // afterLabel: (data) => {
        //   return data.label;
        // }
      }
    }
  };
  public barChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [{
    beforeInit: (chart, options) => {
      chart.legend.afterFit = function () {
        this.height += 10;
      };
    }
  }, null];
  public barChartData: ChartDataSets[] = [
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
        },
      }
    }, {
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
    }
  ];
  payersList: { id: number, name: string, arName: string }[] = [];
  rejectionComparisonReport: RejectionComparisonReport = new RejectionComparisonReport();
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'YYYY' };
  minDate: any;
  error: string;
  isGenerateData = false;
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  diffrenceLableName: any;
  percenatgeChartData: any = [];
  quarterData: { firstQuarter: any[]; firstQuaterSumOfTotal: any; secondQuarter: any[], secondQuaterSumOfTotal: any; };
  firstYear: string;
  secondYear: string;
  constructor(
    private sharedService: SharedServices,
    private reportSerice: RevenuReportService,
    private routeActive: ActivatedRoute,
    private currencyPipe: CurrencyPipe
  ) { }

  ngOnInit() {
    this.payersList = this.sharedService.getPayersList();
    this.routeActive.queryParams.subscribe(params => {
      if (params.payerId != null) {
        this.rejectionComparisonReport.payerId = params.payerId;
      }
      if (params.fromDate != null) {
        this.rejectionComparisonReport.fromDate = params.fromDate;
        this.firstYear = moment(this.rejectionComparisonReport.fromDate).format('YYYY');
      }
      if (params.toDate != null) {
        this.rejectionComparisonReport.toDate = params.toDate;
        this.secondYear = moment(this.rejectionComparisonReport.toDate).format('YYYY');
      }
      if (params.fromDate != null && params.toDate != null) {
        this.generate();
      }
    });
  }
  onOpenCalendar(container) {
    container.yearSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('year');
  }
  get providerId(): string {
    return this.sharedService.providerId;
  }
  generate() {
    this.isGenerateData = true;
    this.sharedService.loadingChanged.next(true);
    const fromDate = moment(this.rejectionComparisonReport.fromDate).format('YYYY-MM-DD');
    this.firstYear = moment(this.rejectionComparisonReport.fromDate).format('YYYY');
    this.secondYear = moment(this.rejectionComparisonReport.toDate).format('YYYY');
    const toDate = moment(this.rejectionComparisonReport.toDate).format('YYYY-MM-DD');
    this.editURL(fromDate, toDate);
    const obj: RejectionComparisonReport = {
      payerId: this.rejectionComparisonReport.payerId,
      fromDate,
      toDate
    };

    this.reportSerice.generateRejectionComparativeProgressReport(this.providerId, obj).subscribe(event => {
      if (event.body !== undefined) {
        this.error = null;
        const datas = JSON.parse(event.body);

        this.barChartOptions.scales.xAxes[0].scaleLabel.labelString = 'Year';
        this.barChartData[0].label = datas[0].label;
        this.barChartData[1].label = datas[1].label;
        this.barChartData[0].data = datas[0].data;
        this.barChartData[1].data = datas[1].data;

        this.percenatgeChartData = [];
        const firstYearData = datas[0].data;
        const secondYearData = datas[1].data;
        const percentageLabelData = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        this.diffrenceLableName = 'Months';
        this.quarterData = {
          firstQuarter: [],
          firstQuaterSumOfTotal: 0,
          secondQuarter: [],
          secondQuaterSumOfTotal: 0
        };
        // let firstQuarterTotal = 0, secondQuarterTotal = 0;
        firstYearData.map((ele, index) => {
          let value = 0;
          if (ele === 0 && secondYearData[index] > ele) {
            value = 100;
          } else if (secondYearData[index] === 0 && ele > secondYearData[index]) {
            value = 100;
          }
          const finalValue = ele !== 0 && secondYearData[index] !== 0
            ? ele > secondYearData[index]
              ? (100 - (secondYearData[index] * 100) / ele) : (100 - (ele * 100) / secondYearData[index])
            : value;

          const obj = {
            label: percentageLabelData[index],
            value: ele === 0 && secondYearData[index] === 0 ? this.Rate.Equal : ele > secondYearData[index] ? this.Rate.Down : this.Rate.Up,
            data: Number(finalValue.toFixed(2))
          };
          this.percenatgeChartData.push(obj);
          this.quarterData.firstQuaterSumOfTotal += ele;
          this.quarterData.secondQuaterSumOfTotal += secondYearData[index];
        });

        const firstQuarterTotal = firstYearData.reduce((acc, n, i) => {
          const curr = acc.pop();
          return i && i % 3 === 0 ? [...acc, curr, n] : [...acc, curr + n];
        }, [0]);
        const secondQuarterTotal = secondYearData.reduce((acc, n, i) => {
          const curr = acc.pop();
          return i && i % 3 === 0 ? [...acc, curr, n] : [...acc, curr + n];
        }, [0]);
        this.quarterData.secondQuarter = secondQuarterTotal.map((ele) => this.currencyPipe.transform(
          ele.toString(),
          'number',
          '',
          '1.2-2'
        ));
        this.quarterData.firstQuarter = firstQuarterTotal.map((ele) => this.currencyPipe.transform(
          ele.toString(),
          'number',
          '',
          '1.2-2'
        ));

        this.quarterData.firstQuaterSumOfTotal = this.currencyPipe.transform(
          this.quarterData.firstQuaterSumOfTotal.toString(),
          'number',
          '',
          '1.2-2'
        );
        this.quarterData.secondQuaterSumOfTotal = this.currencyPipe.transform(
          this.quarterData.secondQuaterSumOfTotal.toString(),
          'number',
          '',
          '1.2-2'
        );
        this.barChartLabels = this.percenatgeChartData.map(ele => ele.label);
        // this.barChartOptions.title.text = 'All';

        if (this.chart) {
          this.chart.ngOnChanges({});
        }

      }
      this.sharedService.loadingChanged.next(false);

    }, err => {
      this.sharedService.loadingChanged.next(false);
      this.barChartData.map((ele) => {
        ele.data = [];
        ele.label = '';
        return ele;
      });
      this.percenatgeChartData = [];
      if (err instanceof HttpErrorResponse) {
        if (err.status == 404) {
          this.error = 'No data found.';
        }
      } else {
        console.log(err);
        this.error = 'Could not load data at the moment. Please try again later.';
      }
    });
  }
  editURL(fromDate?: string, toDate?: string) {
    let path = '/reports/rejection-comparison-report?';
    if (this.rejectionComparisonReport.payerId != null) {
      path += `payerId=${this.rejectionComparisonReport.payerId}&`;
    }
   
    if (fromDate != null) {
      path += `fromDate=${fromDate}&`;
    }
    if (toDate != null) {
      path += `toDate=${toDate}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
  //  this.location.go(path);
  }
   
  
  
  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.rejectionComparisonReport.toDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.rejectionComparisonReport.toDate = '';
      }
    }
    this.minDate = new Date(event);

  }
  getEmptyStateMessage() {
    if (!this.isGenerateData && (this.error == null || this.error === undefined)) {
      return 'Please apply the filter and generate the report.';
    } else {
      return this.error;
    }
  }
  get Rate() {
    return GrowthRate;
  }
}