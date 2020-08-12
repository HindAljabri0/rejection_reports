import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SharedServices } from 'src/app/services/shared.services';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { updateSearchCriteria } from '../../store/dashboard.actions';

@Component({
  selector: 'app-search-criteria',
  templateUrl: './search-criteria.component.html',
  styleUrls: ['./search-criteria.component.css']
})
export class SearchCriteriaComponent implements OnInit {

  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  lastMonthName:string;
  searchByLastMonth = true;
  fromDateControl: FormControl = new FormControl();
  fromDateInvalid = false;
  toDateControl: FormControl = new FormControl();
  toDateInvalid = false;
  selectedPayer: number;
  payersList: { id: number, name: string, arName: string }[] = [];

  constructor(private sharedServices: SharedServices, private store:Store) { }

  ngOnInit() {
    this.setLastMonthName();
    this.payersList = this.sharedServices.getPayersList();
    if(this.payersList.findIndex(payer => payer.id == 102) != -1){
      this.selectedPayer = 102;
    } else {
      this.selectedPayer = this.payersList[0].id;
    }
    this.search();
  }

  setLastMonthName(){
    let thisMonth = moment();
    let lastMonth = thisMonth.subtract('month', 1);
    this.lastMonthName = this.monthNames[lastMonth.month()];
  }

  resetDates(){
    this.fromDateControl = new FormControl();
    this.toDateControl = new FormControl();
  }

  search(){
    if(this.searchByLastMonth){
      const now = moment();
      const lastMonth = moment().subtract('month', 1);
      this.store.dispatch(updateSearchCriteria({
        fromDate: `${lastMonth.weekYear()}-${lastMonth.month()+1}-01`,
        toDate: `${now.weekYear()}-${now.month()+1}-01`,
        payerId: this.selectedPayer
      }));
    } else {
      let fromDate = new Date(this.fromDateControl.value);
      let toDate = new Date(this.toDateControl.value);
      this.fromDateInvalid = this._isInvalidDate(fromDate) || this.fromDateControl.value == null;
      this.toDateInvalid = this._isInvalidDate(toDate) || this.toDateControl.value == null;
      if(this.fromDateInvalid || this.toDateInvalid) return;
      this.store.dispatch(updateSearchCriteria({
        fromDate: `${fromDate.getFullYear()}-${fromDate.getMonth()+1}-${fromDate.getDate()}`,
        toDate: `${toDate.getFullYear()}-${toDate.getMonth()+1}-${toDate.getDate()}`,
        payerId: this.selectedPayer
      }));
    }
  }

  _isInvalidDate(date: Date) {
    return date == null || Number.isNaN(date.getTime()) || Number.isNaN(date.getFullYear()) || Number.isNaN(date.getMonth()) || Number.isNaN(date.getDay()) || date.getTime() > Date.now()
  }
}
