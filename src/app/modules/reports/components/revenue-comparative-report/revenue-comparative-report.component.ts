import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { SharedServices } from 'src/app/services/shared.services';
import { RevenuReportService } from 'src/app/services/revenuReportService/revenu-report.service';
import { RevenuComparativeReport } from 'src/app/models/revenuComparativeReport';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { BaseChartDirective, Label } from 'ng2-charts';
@Component({
  selector: 'app-revenue-comparative-report',
  templateUrl: './revenue-comparative-report.component.html',
  styles: []
})
export class RevenueComparativeReportComponent implements OnInit {

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
      },
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
  }, pluginDataLabels];
  public barChartData: ChartDataSets[] = [
    {
      data: [1000, 1750, 2250, 1000, 4750, 1000, 750, 1500, 3000, 1250, 1000, 250],
      label: 'Avg. Cost 2018',
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
    }, {
      data: [1500, 1500, 3000, 2750, 500, 2750, 1500, 2250, 500, 2250, 1500, 2000],
      label: 'Avg. Cost 2019',
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
  revenuComparativeReport: RevenuComparativeReport = new RevenuComparativeReport();
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
  constructor(private sharedService: SharedServices, private reportSerice: RevenuReportService) { }

  ngOnInit() {
    this.payersList = this.sharedService.getPayersList();
  }
  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
  get providerId(): string {
    return this.sharedService.providerId;
  }
  generate() {

    this.reportSerice.generateRevenuComparativeProgressReport(this.providerId, this.revenuComparativeReport).subscribe(event => {
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
}
