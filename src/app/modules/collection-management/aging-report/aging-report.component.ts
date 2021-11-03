import { V, X } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { AgingReportResponseModel } from 'src/app/models/agingReportResponseModel';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
import { SharedServices } from 'src/app/services/shared.services';


export interface Report {
  className: string;
  payer: string;
   amountOutStanding: string; 
   totalAmoount: string;
    aged1to30: string;
    aged31to60: string; 
    aged61to90: string; 
    aged91to120: string;
    aged121to150: string;
    aged151to180: string ;
    aged181to365: string ;
    aged365: string
}
@Component({
  selector: 'app-aging-report',
  templateUrl: './aging-report.component.html',
  styles: []
})
export class AgingReportComponent implements OnInit {
  currentDetailsOpen = -1;
  payerName:string;
  agingReportResponseModel:AgingReportResponseModel[]=[];
  report:Report[]=[];
 

  getPreviousDate(){

 
    return this.datePipe.transform(new Date(this.date.value.getFullYear()-1, this.date.value.getMonth(), this.date.value.getDate()), 'yyyy-MM-dd') ;
  }


  formatDate(date:Date){
   
    return this.datePipe.transform(date, 'yyyy-MM-dd') ;
  }
  today = this.formatDate(new Date())
  errorMessage=null;

  
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


 
  //  payer: string, amountOutStanding: string, totalAmoount: string, aged1to30: string, aged31to60: string, aged61to90: string, aged91to120: string,
  //   aged121to150: string,aged151to180: string ,aged181to365: string ,aged365: string  }>;
  public barChartData: ChartDataSets[] = [
    {
      data: [65, 59, 80, 81, 56, 55, 40, 30],
      backgroundColor: '#3060AA',
      hoverBackgroundColor: '#3060AA',
      datalabels: {
        display: false
      }
    },
  ];


  // report = [
  //   {
  //     className: 'semibold', payer: 'All', amountOutStanding: 500, totalAmoount: 1000, aged1to30: 0, aged31to60: 0, aged61to90: 0,
  //     aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 500
  //   },
  //   {
  //     className: '', payer: 'Tawuniya', amountOutStanding: 500, totalAmoount: 1000, aged1to30: 0, aged31to60: 0, aged61to90: 0,
  //     aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 500
  //   },
  //   {
  //     className: '', payer: 'Bupa', amountOutStanding: 100, totalAmoount: 100, aged1to30: 0, aged31to60: 0, aged61to90: 0,
  //     aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 0
  //   },
  //   {
  //     className: '', payer: 'Medgulf', amountOutStanding: 645.75, totalAmoount: 645.75, aged1to30: 0, aged31to60: 0, aged61to90: 0,
  //     aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 645.75
  //   },
  //   {
  //     className: '', payer: 'Sagar', amountOutStanding: 35.40, totalAmoount: 35.40, aged1to30: 0, aged31to60: 0, aged61to90: 0,
  //     aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 35.40
  //   },
  //   {
  //     className: '', payer: 'Allianz', amountOutStanding: 0, totalAmoount: 605, aged1to30: 0, aged31to60: 0, aged61to90: 0,
  //     aged91to120: 0, aged121to150: 0, aged151to180: 0, aged181to365: 0, aged365: 0
  //   },
  // ];
  constructor(public commen: SharedServices,private datePipe: DatePipe ,public superAdminService:SuperAdminService) { }


  getPayerName(payerId:number){

    this.commen.getPayersList().forEach(data=>{
     
      if(data.id==payerId){
   
        this.payerName= data.name;
      }
    });
    return this.payerName;
  }
  ngOnInit() {
    this.search();
    // for(var data of this.agingReportResponseModel){
     
    //   this.report.push({
    //         className: '', payer: data.payerId, amountOutStanding:data.outstandingAmount , totalAmoount: data.totalAmount, aged1to30: '0', aged31to60: '0', aged61to90: '0',
    //         aged91to120: '0', aged121to150: '0', aged151to180: '0', aged181to365: '0', aged365: '0'
    //       },);


    // }
  }

  toggleRow(index) {
    this.currentDetailsOpen = (this.currentDetailsOpen == index) ? -1 : index;

  }
  search(){
    this.errorMessage=null;
    this.commen.loadingChanged.next(true);
    this.agingReportResponseModel=[];
  this.superAdminService.searchByCriteriaForAgingReport(this.commen.providerId,this.formatDate(this.date.value)).subscribe((data=>{

    if (data instanceof HttpResponse) {
    
      this.agingReportResponseModel=data.body as AgingReportResponseModel[];
      if( this.agingReportResponseModel.length==0){
        this.errorMessage="No payment contract exists to show Aging Report";;
       
      }
     
        this.commen.loadingChanged.next(false);}
      
  }), error => {
    if (error instanceof HttpErrorResponse) {
      if ((error.status / 100).toFixed() == '4') {
        this.errorMessage = 'Access Denied.';
      } else if ((error.status / 100).toFixed() == '5') {
        this.errorMessage = 'Server could not handle the request. Please try again later.';
      } else {
        this.errorMessage = 'Somthing went wrong.';
      }
   
        this.commen.loadingChanged.next(false);
   }});
  
  

 


  }

}
