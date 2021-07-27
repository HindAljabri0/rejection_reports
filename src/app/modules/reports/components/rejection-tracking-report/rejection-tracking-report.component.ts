import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { RevenuTrackingReportChart } from 'src/app/claim-module-components/models/revenuTrackingCategoryChart';
import { RevenuTrackingReport } from 'src/app/models/revenuReportTrackingReport';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { SharedServices } from 'src/app/services/shared.services';
import { RevenuReportService } from 'src/app/services/revenuReportService/revenu-report.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CurrencyPipe } from '@angular/common';
import { getDepartmentNames } from 'src/app/pages/dashboard/store/dashboard.actions';
import { getDepartments } from 'src/app/pages/dashboard/store/dashboard.reducer';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-rejection-tracking-report',
  templateUrl: './rejection-tracking-report.component.html',
  styleUrls: ['./rejection-tracking-report.component.css']
})
export class RejectionTrackingReportComponent implements OnInit {
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
          fontColor: this.chartFontColor,

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
          beginAtZero: true,
          callback: (value, index, values) => {
            if (this.yaxisMaxValue === null) {
              this.yaxisMaxValue = value;
            }
            return value;
          }
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
      },
      onClick(e, legendItem) {
        const isAvgCost = document.getElementById('avgCost');
        const chartName = document.getElementById('chartName');
        if ((chartName.textContent.toLowerCase() === 'all' && chartName.classList.contains('active')) || (isAvgCost !== null &&
          isAvgCost.classList.contains('active'))) {
          return;
        }

        const index = legendItem.datasetIndex;
        const ci = this.chart;
        const alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

        ci.data.datasets.forEach(function (e, i) {
          const meta = ci.getDatasetMeta(i);

          if (i !== index) {
            if (!alreadyHidden) {
              meta.hidden = meta.hidden === null ? !meta.hidden : null;
            } else if (meta.hidden === null) {
              meta.hidden = true;
            }
          } else if (i === index) {
            meta.hidden = null;
          }
        });
        const maxValue: any = document.getElementById('yaxisMaxValue');
        // let multipleData = [];
        // ci.data.datasets.map((ele) => {
        //   multipleData.push(ele.data);
        // });
        // var maxValue = Math.max(...[].concat(...multipleData));

        ci.options.scales.yAxes[0].ticks.max = parseInt(maxValue.value, 10);

        ci.update();
      }
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily,
      callbacks: {
        label: (data, values) => {
          if (this.revenuTrackingReport.subcategory === RevenuTrackingReportChart.All) {
            const payerId = parseInt(values.datasets[data.datasetIndex].label, 10);
            if (payerId !== undefined && !isNaN(payerId)) {
              const payerData = this.payersList.find(ele => ele.id === payerId);
              data.value = payerData.name + ' ' + payerData.arName;
            }
          } else if (this.revenuTrackingReport.subcategory === RevenuTrackingReportChart.Department) {
            const departmentId = parseInt(values.datasets[data.datasetIndex].label, 10);
            if (departmentId !== undefined && !isNaN(departmentId)) {
              data.value = this.departments.find((ele) => ele.departmentId === departmentId).name;
            }
          } else {
            data.value = values.datasets[data.datasetIndex].label;
          }
          return data.value;
        },
        afterLabel: (data, values) => {
          data.value = this.currencyPipe.transform(
            data.yLabel.toString(),
            'number',
            '',
            '1.2-2'
          );
          return 'Amount - ' + data.value + ' SR';
        }
      }
    },
  };

  public lineChartColors: Color[] = [];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  allChart = true;
  revenuTrackingReport: RevenuTrackingReport = new RevenuTrackingReport();
  payersList: { id: number, name: string, arName: string }[] = [];
  selectedPayerName = 'All';
  isServiceVisible = false;
  serviceOrPayerType: string;
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
  minDate: any;
  error: string;
  isGenerateData = false;
  public lineChartPlugins = [{
    afterInit: (chart, options) => {
      chart.legend.afterFit = () => {
        chart.legend.legendItems.map((label) => {
          if (this.payersList.length > 0 && this.allChart) {
            const value = this.payersList.find(ele => ele.id === parseInt(label.text, 10));
            label.text = value.name + ' ' + value.arName;
          }
          if (this.revenuTrackingReport.subcategory.toLowerCase() === RevenuTrackingReportChart.Department.toLowerCase()) {

            if (this.departments != null && this.departments.length > 0) {
              const value = this.departments.find(ele => ele.departmentId === parseInt(label.text, 10));
              label.text = value.name;
            }
          }

          return label;
        });
      };
    },
  }, pluginDataLabels];
  departments: any;
  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  yaxisMaxValue: any = null;
  constructor(
    private sharedService: SharedServices,
    private reportSerice: RevenuReportService,
    private routeActive: ActivatedRoute,
    private location: Location,
    private store: Store,
    private currencyPipe: CurrencyPipe
  ) {
  }

  ngOnInit(): void {
    this.payersList = this.sharedService.getPayersList();


    this.store.dispatch(getDepartmentNames());
    this.store.select(getDepartments).subscribe(departments => this.departments = departments);
    this.routeActive.queryParams.subscribe(params => {
      if (params.category != null) {
        this.revenuTrackingReport.subcategory = params.category;
        this.serviceOrPayerType = params.category;
        this.allChart = RevenuTrackingReportChart.All === params.category ? true : false;
      }
      if (params.fromDate != null) {
        const fromDate = moment(params.fromDate, 'YYYY-MM-DD').toDate();
        this.revenuTrackingReport.fromDate = params.fromDate;
      }
      if (params.toDate != null) {
        const toDate = moment(params.toDate, 'YYYY-MM-DD').toDate();
        this.revenuTrackingReport.toDate = toDate;
      }
      if (params.payerId != null) {
        this.revenuTrackingReport.payerId = params.payerId === '0' ? '0' : parseInt(params.payerId, 10);
        if (this.revenuTrackingReport.payerId !== '0') {
          const data = this.payersList.find(ele => ele.id === parseInt(this.revenuTrackingReport.payerId, 10));
          this.selectedPayerName = data.name + ' ' + data.arName;
          this.isServiceVisible = true;
        } else {
          this.selectedPayerName = 'All';
          this.isServiceVisible = false;
        }
      }
      if (params.fromDate != null && params.toDate != null) {
        this.generate();
      }
    });
  }

  showAllChart(form) {
    form.submitted = true;
    if (form.invalid) {
      return;
    }
    this.allChart = true;
    this.serviceOrPayerType = RevenuTrackingReportChart.All;
    this.revenuTrackingReport.subcategory = RevenuTrackingReportChart.All;
    this.generate();
  }
  showServiceChart(categoryType, form) {
    form.submitted = true;
    if (form.invalid) {
      return;
    }

    this.allChart = false;
    this.serviceOrPayerType = categoryType;
    this.revenuTrackingReport.subcategory = categoryType;
    this.generate();
  }
  selectRevenu(event, form: NgForm) {

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
    if (!form.invalid) {
      this.generate();
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
    if (this.chart !== undefined && this.chart !== null) {
      this.chart.chart.options.scales.yAxes[0].ticks.max = undefined;
    }

    const fromDate = moment(this.revenuTrackingReport.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.revenuTrackingReport.toDate).format('YYYY-MM-DD');
    this.editURL(fromDate, toDate);
    const obj: RevenuTrackingReport = {
      payerId: this.revenuTrackingReport.payerId,
      fromDate,
      toDate,
      subcategory: this.revenuTrackingReport.subcategory,
    };


    this.sharedService.loadingChanged.next(true);

    this.reportSerice.generateRejectionTrackingReport(this.providerId, obj).subscribe(event => {

      if (event.body !== undefined && event.body !== '' && event.body !== null) {
        this.error = null;


        this.yaxisMaxValue = null;
        const data = JSON.parse(event.body);
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
        /*this.router.navigateByUrl('/reports/revenue-report-breakdown', { queryParams: { payerId: this.revenuTrackingReport.payerId,
        fromDate: this.revenuTrackingReport.fromDate, toDate: this.revenuTrackingReport.toDate,
        category: this.revenuTrackingReport.subcategory } });*/
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
      if (startDate > endDate) {
        this.revenuTrackingReport.toDate = '';
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
  editURL(fromDate?: string, toDate?: string) {
    let path = '/reports/revenue-tracking-report?';
    if (this.revenuTrackingReport.subcategory != null) {
      path += `payerId=${this.revenuTrackingReport.payerId}&`;
    }
    if (this.revenuTrackingReport.subcategory != null) {
      path += `category=${this.revenuTrackingReport.subcategory}&`;
    }
    if (fromDate != null) {
      path += `fromDate=${fromDate}&`;
    }
    if (toDate != null) {
      path += `toDate=${toDate}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 2);
    }
    this.location.go(path);
  }
}
