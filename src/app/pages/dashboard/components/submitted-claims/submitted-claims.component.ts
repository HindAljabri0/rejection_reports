import { Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';
import { Store } from '@ngrx/store';
import {
  DashboardCardData, getSubmittedClaims,

} from '../../store/dashboard.reducer';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-submitted-claims',
  templateUrl: './submitted-claims.component.html',
  styles: []
})
export class SubmittedClaimsComponent implements OnInit {
  currencyCode="SAR";
  public doughnutChartLabels: Label[] = ['Under Processing', 'Paid', 'Partially Paid', 'Rejected by Payer'];
  public claimsChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1,
      data: []
    }
  ];

  public grossChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1,
      data: []
    }
  ];

  public discountChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1,
      data: []
    }
  ];

  public patientShareChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1,
      data: []
    }
  ];

  public netChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1,
      data: []
    }
  ];

  public vatChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1,
      data: []
    }
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartOptions: ChartOptions = {
    aspectRatio: 1 / 1,
    responsive: true,
    tooltips: {
      enabled: false
    },
    legend: {
      display: false
    },
    cutoutPercentage: 75
  };
  summaries: DashboardCardData;

  constructor(public sharedServices: SharedServices, private store: Store) { }

  ngOnInit() {
    this.currencyCode = localStorage.getItem('currencyCode') != null && localStorage.getItem('currencyCode') != undefined ? localStorage.getItem('currencyCode') : "SAR"
    this.store.select(getSubmittedClaims).subscribe(summaries => {
      this.summaries = summaries;

      // tslint:disable-next-line:radix
      if (parseInt(this.summaries.data.all_total) > 0) {
        // tslint:disable-next-line:max-line-length
        this.claimsChartData[0].data = this.generateChartData(
          this.summaries.data.outstanding_total,
          this.summaries.data.under_process_total,
          this.summaries.data.paid_total,
          this.summaries.data.partially_paid_total,
          this.summaries.data.returend_Total,
          this.summaries.data.invalid_Total,
          this.summaries.data.rejected_Total
        );
      }

      // tslint:disable-next-line:radix
      if (parseFloat(this.summaries.data.all_gross) > 0) {
        // tslint:disable-next-line:max-line-length
        this.grossChartData[0].data = this.generateChartData(
          this.summaries.data.outstanding_gross,
          this.summaries.data.under_process_gross,
          this.summaries.data.paid_gross,
          this.summaries.data.partially_paid_gross,
          this.summaries.data.returend_gross,
          this.summaries.data.invalid_gross,
          this.summaries.data.rejected_gross
        );
      }

      // tslint:disable-next-line:radix
      if (parseFloat(this.summaries.data.all_disCount) > 0) {
        // tslint:disable-next-line:max-line-length
        this.discountChartData[0].data = this.generateChartData(
          this.summaries.data.outstanding_disCount,
          this.summaries.data.under_process_disCount,
          this.summaries.data.paid_disCount,
          this.summaries.data.partially_paid_disCount,
          this.summaries.data.returend_disCount,
          this.summaries.data.invalid_disCount,
          this.summaries.data.rejected_disCount
        );
      }


      // tslint:disable-next-line:radix
      if (parseFloat(this.summaries.data.all_Patientshar) > 0) {
        // tslint:disable-next-line:max-line-length
        this.patientShareChartData[0].data = this.generateChartData(
          this.summaries.data.outstanding_Patientshare,
          this.summaries.data.under_process_Patientshare,
          this.summaries.data.paid_Patientshare,
          this.summaries.data.partially_paid_Patientshare,
          this.summaries.data.returend_Patientshare,
          this.summaries.data.invalid_Patientshare,
          this.summaries.data.rejected_Patientshare
        );
      }


      // tslint:disable-next-line:radix
      if (parseFloat(this.summaries.data.all_netAmount) > 0) {
        // tslint:disable-next-line:max-line-length
        this.netChartData[0].data = this.generateChartData(
          this.summaries.data.outstanding_netAmount,
          this.summaries.data.under_process_netAmount,
          this.summaries.data.paid_netAmount,
          this.summaries.data.partially_paid_netAmount,
          this.summaries.data.returend_netAmount,
          this.summaries.data.invalid_netAmount,
          this.summaries.data.rejected_netAmount
        );
      }


      // tslint:disable-next-line:radix
      if (parseFloat(this.summaries.data.all_VatAmount) > 0) {
        // tslint:disable-next-line:max-line-length
        this.vatChartData[0].data = this.generateChartData(
          this.summaries.data.outstanding_VatAmount,
          this.summaries.data.under_process_VatAmount,
          this.summaries.data.paid_VatAmount,
          this.summaries.data.partially_paid_VatAmount,
          this.summaries.data.returend_VatAmount,
          this.summaries.data.invalid_VatAmount,
          this.summaries.data.rejected_VatAmount
        );
      }


    });
  }


  generateChartData(outstanding, underProcess, paid, partiallyPaid, returned, invalid, rejected) {
    const dataValue = [];

    const d1 = this.checkValue(outstanding) + this.checkValue(underProcess);
    const d2 = this.checkValue(paid);
    const d3 = this.checkValue(partiallyPaid);
    const d4 = this.checkValue(returned) + this.checkValue(invalid) + this.checkValue(rejected);
    dataValue.push(d1);
    dataValue.push(d2);
    dataValue.push(d3);
    dataValue.push(d4);

    return dataValue;
  }

  checkValue(value) {
    if (value) {
      return parseFloat(value);
    } else {
      return 0;
    }
  }



  getCardName(status: string) {
    return this.sharedServices.statusToName(status);
  }

  getCardColor(status: string) {
    return this.sharedServices.getCardAccentColor(status);
  }

  calculatePercetage(first: number, second: number, roundValue: number = 4) {
    const retval = parseFloat(((first / second) * 100).toFixed(roundValue));
    return isNaN(retval) ? 0 : retval.toString();
  }

  getConvertfromStringToNumber(value: string) {

    if (value != null || value != '') {
      return (Number(value));
    } else {
      return 0;
    }



  }
  PercentageCalculator(value_1: string, value_2: string, value_3: string, total: number) {

    let result = (this.getConvertfromStringToNumber(value_1) + this.getConvertfromStringToNumber(value_2)
      + this.getConvertfromStringToNumber(value_3)) / total * 100;
    if (isNaN(result)) {
      result = 0;
    }
    if (result == 100 || result == 0) {
      return result;
    } else {

      return result.toFixed(2);
    }
  }


}
