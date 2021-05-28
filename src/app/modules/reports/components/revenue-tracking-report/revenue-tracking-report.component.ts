import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { RevenuTrackingReport } from 'src/app/models/revenuReportTrackingReport';
import { SharedServices } from 'src/app/services/shared.services';
import { RevenuTrackingReportChart } from 'src/app/claim-module-components/models/revenuTrackingCategoryChart';
import { RevenuReportService } from 'src/app/services/revenuReportService/revenu-report.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import * as moment from 'moment';
import { from } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-revenue-tracking-report',
  templateUrl: './revenue-tracking-report.component.html',
  styles: []
})
export class RevenueTrackingReportComponent implements OnInit {
  public chartFontFamily = '"Poppins", sans-serif';
  public chartFontColor = '#2d2d2d';
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
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
          labelString: 'Amount',
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
    legend: {
      labels: {
        fontFamily: this.chartFontFamily,
        fontColor: this.chartFontColor
      }
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily,
    },
  };
  public lineChartColors: Color[] = [];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';


  public barChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        stacked: true,
        gridLines: {
          display: false
        },
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor
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
        stacked: true,
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          beginAtZero: true
        },
        scaleLabel: {
          display: true,
          labelString: 'Amount',
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
    legend: {
      labels: {
        fontFamily: this.chartFontFamily,
        fontColor: this.chartFontColor
      }
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily,
    },
  };
  allChart = true;
  revenuTrackingReport: RevenuTrackingReport = new RevenuTrackingReport();
  payersList: { id: number, name: string, arName: string }[] = [];
  selectedPayerName = 'All';
  isServiceVisible = false;
  serviceOrPayerType: string;
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
  minDate: any;
  error: string;
  isGenerateData: boolean = false;
  constructor(private sharedService: SharedServices, private reportSerice: RevenuReportService) {
  }

  ngOnInit(): void {
    this.payersList = this.sharedService.getPayersList();
  }

  showAllChart(form) {
    form.submitted = true;
    if (form.invalid)
      return
    this.allChart = true;
    this.serviceOrPayerType = RevenuTrackingReportChart.All;
    this.revenuTrackingReport.subcategory = RevenuTrackingReportChart.All;
    this.generate();
  }
  showServiceChart(categoryType, form) {
    form.submitted = true;
    if (form.invalid)
      return

    this.allChart = false;
    this.serviceOrPayerType = categoryType;
    this.revenuTrackingReport.subcategory = categoryType;
    this.generate();
  }
  selectRevenu(event) {
    if (event.value !== '0') {
      const data = this.payersList.find(ele => ele.id === parseInt(this.revenuTrackingReport.payerId, 10));
      this.selectedPayerName = data.name + ' ' + data.arName;
      this.isServiceVisible = true;
      this.revenuTrackingReport.subcategory = RevenuTrackingReportChart.Service;
      this.serviceOrPayerType = RevenuTrackingReportChart.Service;
      this.allChart = false;
    } else {
      this.selectedPayerName = 'All';
      this.isServiceVisible = false;
      this.serviceOrPayerType = RevenuTrackingReportChart.All;
      this.revenuTrackingReport.subcategory = RevenuTrackingReportChart.All;
      this.allChart = true;
    }
  }
  get revenuTrackingEnum() {
    return RevenuTrackingReportChart;
  }
  isActiveService(categoryType: string) {
    return this.serviceOrPayerType === categoryType ? true : false;
  }
  get providerId(): string {
    return this.sharedService.providerId;
  }
  generate() {
    this.isGenerateData = true;
    const fromDate = moment(this.revenuTrackingReport.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.revenuTrackingReport.toDate).format('YYYY-MM-DD');
    const obj: RevenuTrackingReport = {
      payerId: this.revenuTrackingReport.payerId,
      fromDate: fromDate,
      toDate: toDate,
      subcategory: this.revenuTrackingReport.subcategory,
    };

    this.sharedService.loadingChanged.next(true);
    this.reportSerice.generateRevenuTrackingReport(this.providerId, obj).subscribe(event => {

      if (event.body !== undefined && event.body !== '' && event.body !== null) {
        this.error = null;
        const data = JSON.parse(event.body);

        // this.lineChartLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        // this.lineChartData = [
        //   {
        //     data: [200000, 200000, 75000, 500000, 350000, 75000, 200000, 200000, 75000, 500000, 350000, 75000],
        //     label: 'ED-o1',
        //   },
        //   {
        //     data: [100000, 150000, 225000, 100000, 150000, 600000, 100000, 150000, 225000, 100000, 150000, 600000],
        //     label: 'Cons'
        //   },
        //   {
        //     data: [200000, 400000, 425000, 225000, 225000, 200000, 175000, 400000, 425000, 225000, 225000, 200000],
        //     label: 'Ed-01'
        //   },
        //   {
        //     data: [200000, 400000, 425000, 225000, 225000, 200000, 175000, 400000, 425000, 225000, 225000, 200000],
        //     label: 'Bd-01'
        //   },
        // ];
        this.lineChartLabels = data.labels;
        this.lineChartData = data.values;
        this.lineChartData.forEach((l) => {
          l.lineTension = 0;
          l.borderWidth = 2;
          l.datalabels = {
            display: false
          };
        });
        const colors = this.sharedService.getAnalogousColor(this.lineChartData.length);
        for (let i = 0; i < this.lineChartData.length; i++) {
          this.lineChartColors.push({
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: colors[i],
            pointBackgroundColor: 'rgba(0,0,0,0)',
            pointBorderColor: 'rgba(0,0,0,0)',
            pointHoverBackgroundColor: 'rgba(0,0,0,0)',
            pointHoverBorderColor: 'rgba(0,0,0,0)',
          });
        }
      }
      this.sharedService.loadingChanged.next(false);


    }, err => {
      this.sharedService.loadingChanged.next(false);
      this.lineChartLabels = [];
      this.lineChartData = [];
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
  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.revenuTrackingReport.toDate).format('YYYY-MM-DD');
      if (startDate > endDate)
        this.revenuTrackingReport.toDate = '';
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
}


