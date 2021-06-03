import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { RevenuTrackingReport } from 'src/app/models/revenuReportTrackingReport';
import { SharedServices } from 'src/app/services/shared.services';
import { RevenuTrackingReportChart } from 'src/app/claim-module-components/models/revenuTrackingCategoryChart';
import { RevenuReportService } from 'src/app/services/revenuReportService/revenu-report.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';


@Component({
  selector: 'app-revenue-tracking-report',
  templateUrl: './revenue-tracking-report.component.html',
  styles: []
})
export class RevenueTrackingReportComponent implements OnInit {
  public chartFontFamily = '"Poppins", sans-serif';
  public chartFontColor = '#2d2d2d';
  public lineChartData: ChartDataSets[] = [
    {
      data: [200000, 300000, 400000, 600000, 500000, 500000, 400000, 600000, 300000, 400000, 800000, 500000],
      label: 'Medgulf',
      lineTension: 0,
      borderWidth: 2,
      datalabels: {
        display: false
      }
    },
    {
      data: [300000, 400000, 450000, 500000, 450000, 450000, 400000, 500000, 400000, 450000, 600000, 500000],
      label: 'Rajhi',
      lineTension: 0,
      borderWidth: 2,
      datalabels: {
        display: false
      }
    },
  ];
  public lineChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public lineChartOptions: ChartOptions = {
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
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: '#39E6BE',
      pointBackgroundColor: 'rgba(0,0,0,0)',
      pointBorderColor: 'rgba(0,0,0,0)',
      pointHoverBackgroundColor: 'rgba(0,0,0,0)',
      pointHoverBorderColor: 'rgba(0,0,0,0)',
    },
    {
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: '#6495E2',
      pointBackgroundColor: 'rgba(0,0,0,0)',
      pointBorderColor: 'rgba(0,0,0,0)',
      pointHoverBackgroundColor: 'rgba(0,0,0,0)',
      pointHoverBorderColor: 'rgba(0,0,0,0)',
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';


  public barChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 1.6 / 1,
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
  public barChartLabels: Label[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    {
      data: [200000, 200000, 75000, 500000, 350000, 75000, 200000, 200000, 75000, 500000, 350000, 75000],
      label: 'ED-o1',
      datalabels: {
        display: false
      },
      barPercentage: 0.65,
      backgroundColor: '#3060AA',
      hoverBackgroundColor: '#3060AA',
      borderWidth: 0
    },
    {
      data: [100000, 150000, 225000, 100000, 150000, 600000, 100000, 150000, 225000, 100000, 150000, 600000],
      label: 'Cons',
      datalabels: {
        display: false
      },
      barPercentage: 0.65,
      backgroundColor: '#6495E2',
      hoverBackgroundColor: '#6495E2',
      borderWidth: 0
    },
    {
      data: [200000, 400000, 425000, 225000, 225000, 200000, 175000, 400000, 425000, 225000, 225000, 200000],
      label: 'Ed-01',
      datalabels: {
        display: false
      },
      barPercentage: 0.65,
      backgroundColor: '#ADCDFF',
      hoverBackgroundColor: '#ADCDFF',
      borderWidth: 0
    }
  ];
  allChart = true;
  serviceChart = false;
  revenuTrackingReport: RevenuTrackingReport = new RevenuTrackingReport();
  payersList: { id: number, name: string, arName: string }[] = [];
  selectedPayerName: string = "All";
  isServiceVisible: boolean = false;
  serviceOrPayerType: string;
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'YYYY' };
  constructor(private sharedService: SharedServices, private reportSerice: RevenuReportService) { }

  ngOnInit(): void {
    this.payersList = this.sharedService.getPayersList();
  }

  showAllChart() {
    this.allChart = true;
    this.serviceChart = false;
    this.serviceOrPayerType = RevenuTrackingReportChart.All;
  }
  showServiceChart(categoryType) {
    this.allChart = false;
    this.serviceChart = true;
    this.serviceOrPayerType = categoryType;
    this.revenuTrackingReport.subcategory = categoryType;
  }
  selectRevenu(event) {
    if (event.value !== '0') {
      const data = this.payersList.find(ele => ele.id === parseInt(this.revenuTrackingReport.payer));
      this.selectedPayerName = data.name + ' ' + data.arName;
      this.isServiceVisible = true;
    }
    else {
      this.selectedPayerName = "All";
      this.isServiceVisible = false;
      this.serviceOrPayerType = RevenuTrackingReportChart.All;
    }
    this.allChart = true;
    this.serviceOrPayerType = RevenuTrackingReportChart.All;
    this.revenuTrackingReport.subcategory = '';
  }
  get revenuTrackingEnum() {
    return RevenuTrackingReportChart;
  }
  isActiveService(categoryType: string) {
    return this.serviceOrPayerType === categoryType ? true : false
  }
  get providerId(): string {
    return this.sharedService.providerId;
  }
  generate() {

    this.reportSerice.generateRevenuTrackingReport(this.providerId, this.revenuTrackingReport).subscribe(event => {
      // if (event.body !== undefined) {

      //   this.barChartOptions.scales.xAxes[0].scaleLabel.labelString = this.generateReport.comparisionCriteria;
      //   const data = JSON.parse(event.body);
      //   this.barChartData[0].label = data[0].label;
      //   this.barChartData[1].label = data[1].label;
      //   this.barChartData[0].data = data[0].totalNetAmount;
      //   this.barChartData[1].data = data[1].totalNetAmount;

      //   this.percenatgeChartData = [];
      //   const firstYearData = data[0].totalNetAmount;
      //   const secondYearData = data[1].totalNetAmount;
      //   const percentageConfig = this.percentageConfig.find(ele => ele.key === this.generateReport.comparisionCriteria);
      //   const percentageLabelData = percentageConfig.value;
      //   this.diffrenceLableName = percentageConfig.label;
      //   firstYearData.map((ele, index) => {
      //     let value = 0;
      //     if (ele === 0 && secondYearData[index] > ele) {
      //       value = 100;
      //     } else if (secondYearData[index] === 0 && ele > secondYearData[index]) {
      //       value = 100;
      //     }
      //     const finalValue = ele !== 0 && secondYearData[index] !== 0
      //       ? ele > secondYearData[index]
      //         ? (100 - (secondYearData[index] * 100) / ele) : (100 - (ele * 100) / secondYearData[index])
      //       : value;
      //     if (this.generateReport.comparisionCriteria === 'Month') {
      //       percentageLabelData[index] = 'WEEK ' + (index + 1);
      //     }

      //     const obj = {
      //       label: percentageLabelData[index],
      //       value: ele === 0 && secondYearData[index] === 0 ? this.Rate.Equal : ele > secondYearData[index] ? this.Rate.Down : this.Rate.Up,
      //       data: Number(finalValue.toFixed(2))
      //     };
      //     this.percenatgeChartData.push(obj);
      //   });
      //   this.barChartLabels = this.percenatgeChartData.map(ele => ele.label);
      //   const chartLableName = this.labelConfig.find(ele => ele.type === this.generateReport.comparisionType).value;
      //   this.barChartOptions.title.text = chartLableName;

      //   if (this.chart) {
      //     this.chart.ngOnChanges({});
      //   }

      // }

    });
  }
  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }


}
