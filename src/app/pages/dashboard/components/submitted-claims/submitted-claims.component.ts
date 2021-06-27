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

  public doughnutChartLabels: Label[] = ['Under Processing', 'Paid', 'Partially Paid', 'Rejected by Payer'];
  public claimsChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1
    }
  ];

  public grossChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1
    }
  ];

  public netChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1
    }
  ];

  public vatChartData: ChartDataSets[] = [
    {
      backgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      hoverBackgroundColor: ['#851111', '#1C7C26', '#479CC5', '#FF53A3'],
      borderColor: ['#fff', '#fff', '#fff', '#fff'],
      hoverBorderColor: ['#fff', '#fff', '#fff', '#fff'],
      borderWidth: 1
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
    this.store.select(getSubmittedClaims).subscribe(summaries => {
      this.summaries = summaries;
  
    });
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

  getConvertfromStringToNumber(value:string){
     
     if(value!=null||value!=''){
      return(Number(value))
     }else{
      return 0;
     }


    
  }
  PercentageCalculator(value_1:string,value_2:string,value_3:string,total:number){

    let result =(this.getConvertfromStringToNumber(value_1)+this.getConvertfromStringToNumber(value_2)+this.getConvertfromStringToNumber(value_3))/total *100;
    if(isNaN(result)){
      result=0;
     }
    if(result==100|| result==0){
     return result;
    }else{
      
    return result.toFixed(2);
    }
    }

}
