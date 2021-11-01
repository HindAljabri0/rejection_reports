import {  Component, OnInit } from '@angular/core';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-general-summary-statement-report',
  templateUrl: './general-summary-statement-report.component.html',
  styles:[]
})
export class GeneralSummaryStatementReportComponent implements OnInit {
  detailTopActionIcon = 'ic-download.svg';
  payers: { id: string[] | string, name: string }[]=[];
  paginatorPageSizeOptions = [10, 20, 50, 100];
  paginatorPagesNumbers: number[]=[0,1,2,3,4];
  paginatorLength=50;
  
  manualPage = 0;
  constructor( public commen: SharedServices,) { }

  ngOnInit() {

    //this.payers = [];
  
    this.commen.getPayersList().map(value => {
      this.payers.push({
        id: `${value.id}`,
        name: value.name
      });
     
    });
   
  }

}
