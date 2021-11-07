import { D, V, X } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { AgingReportResponseModel } from 'src/app/models/agingReportResponseModel';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { SharedServices } from 'src/app/services/shared.services';



@Component({
  selector: 'app-aging-report',
  templateUrl: './aging-report.component.html',
  styles: []
})
export class AgingReportComponent implements OnInit {
  currentDetailsOpen = -1;
  data: AgingReportResponseModel = null;
  payerName: string;
  agingReportResponseModel: AgingReportResponseModel[] = [];
  selectedDate: Date;

  getPreviousDate() {
    this.selectedDate = new Date(this.date.value)

    return this.datePipe.transform(new Date(this.selectedDate.getFullYear() - 1, this.selectedDate.getMonth(), this.selectedDate.getDate()), 'yyyy-MM-dd');
  }


  formatDate(date: Date) {

    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  today = this.formatDate(new Date())
  errorMessage = null;


  date = new FormControl(this.today);
  public chartFontFamily = '"Poppins", sans-serif';
  public chartFontColor = '#2d2d2d';
  public barChartOptions: ChartOptions = {
    
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          
          display: false
        },
        ticks: {
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor
        }
      }],
      yAxes: [{
        ticks: {
          
          fontFamily: this.chartFontFamily,
          fontColor: this.chartFontColor,
          beginAtZero: true
        }
      }],
    },
    legend: {
      
      display: false
    },
    tooltips: {
      bodyFontFamily: this.chartFontFamily,
      titleFontFamily: this.chartFontFamily,
      footerFontFamily: this.chartFontFamily
    },
    
  };
  public barChartLabels: Label[] = ['1-30', '31-60', '61-90', '91-120', '121-150', '151-180', '181-365', '> 365'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;


  public barChartData: ChartDataSets[] = [];



  constructor(public commen: SharedServices, private datePipe: DatePipe, public superAdminService: SuperAdminService) { }


  getPayerName(payerId: number) {

    this.commen.getPayersList().forEach(data => {

      if (data.id == payerId) {

        this.payerName = data.name;
      }
    });
    return this.payerName;
  }
  ngOnInit() {
    this.search();

  }

  toggleRow(index) {
    this.currentDetailsOpen = (this.currentDetailsOpen == index) ? -1 : index;

  }
  search() {
    this.errorMessage = null;
    this.commen.loadingChanged.next(true);
    this.agingReportResponseModel = [];
    this.superAdminService.searchByCriteriaForAgingReport(this.commen.providerId, this.formatDate(this.date.value)).subscribe((data => {

      if (data instanceof HttpResponse) {
        if (data.status == 204) {

          this.errorMessage = "No payment contract exists to show Aging Report";;
          this.commen.loadingChanged.next(false)
          return
        }
        this.agingReportResponseModel = data.body as AgingReportResponseModel[];

        this.commen.loadingChanged.next(false);
      }

    }), error => {
      if (error instanceof HttpErrorResponse) {
        if ((error.status / 100).toFixed() == '4') {
          this.errorMessage = 'Access Denied.';
        } else if ((error.status / 100).toFixed() == '5') {
          this.errorMessage = 'Server couldatanot handle the request. Please try again later.';
        } else {
          this.errorMessage = 'Somthing went wrong.';
        }

        this.commen.loadingChanged.next(false);
      }
    });


  }

  getDetails(index: any) {
    this.barChartData = [];
    this.errorMessage = null;
    this.commen.loadingChanged.next(true);
    this.data = this.agingReportResponseModel[index];


    this.superAdminService.getAgedDetailsForAgingReport(this.commen.providerId, this.data.payerId.toString(), this.formatDate(this.date.value)).subscribe((data => {


      if (data instanceof HttpResponse) {
        this.data.aged1to30 = data.body["1-30"];
        this.data.aged31to60 = data.body["31-60"];
        this.data.aged61to90 = data.body["61-90"];
        this.data.aged91to120 = data.body["91-120"];
        this.data.aged121to150 = data.body["121-150"];
        this.data.aged151to180 = data.body["151-180"];
        this.data.aged181to365 = data.body["181-365"];
        this.data.aged365 = data.body["> 365"];


        this.data.sum = this.data.aged1to30 + this.data.aged31to60 + this.data.aged61to90 + this.data.aged91to120 + this.data.aged121to150 +
          this.data.aged151to180 + this.data.aged181to365 + this.data.aged365;
        console.log(this.data.aged181to365)
        this.barChartData = [
          {
            data: [Number(((this.data.aged1to30 / this.data.sum) * 100).toFixed()), Number(((this.data.aged31to60 / this.data.sum) * 100).toFixed()), Number(((this.data.aged61to90 / this.data.sum) * 100).toFixed()), Number(((this.data.aged91to120 / this.data.sum) * 100).toFixed()), Number(((this.data.aged121to150 / this.data.sum) * 100).toFixed()),
            Number(((this.data.aged151to180 / this.data.sum) * 100).toFixed()), Number(((this.data.aged181to365 / this.data.sum) * 100).toFixed()), Number(((this.data.aged365 / this.data.sum) * 100).toFixed())],
            backgroundColor: '#3060AA',
            label:'%',    

            hoverBackgroundColor: '#3060AA',
            datalabels: {
              display: true
            }
          },
        ];

        this.commen.loadingChanged.next(false);
      }

    }), error => {
      if (error instanceof HttpErrorResponse) {
        if ((error.status / 100).toFixed() == '4') {
          this.errorMessage = 'Access Denied.';
        } else if ((error.status / 100).toFixed() == '5') {
          this.errorMessage = 'Server couldatanot handle the request. Pleadata.data.se try again later.';
        }

        else {
          this.errorMessage = 'Somthing went wrong.';
        }

        this.commen.loadingChanged.next(false);
      }
    });









  }

}
