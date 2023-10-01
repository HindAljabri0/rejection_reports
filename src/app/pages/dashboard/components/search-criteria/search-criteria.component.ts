import { getDepartmentNames } from './../../store/dashboard.actions';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SharedServices } from 'src/app/services/shared.services';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { updateSearchCriteria } from '../../store/dashboard.actions';
import { AuthService } from 'src/app/services/authService/authService.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-search-criteria',
  templateUrl: './search-criteria.component.html',
  styles: []
})
export class SearchCriteriaComponent implements OnInit {

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  currentMonthName: string;
  lastMonthName: string;
  searchByLastMonth = true;
  fromDateControl: FormControl = new FormControl();
  fromDateInvalid = false;
  toDateControl: FormControl = new FormControl();
  toDateInvalid = false;
  selectedPayer: number;
  payersList: { id: number, name: string, arName: string }[] = [];

  constructor(private sharedServices: SharedServices, private store: Store, private authService: AuthService) { }

  ngOnInit() {
    this.store.dispatch(getDepartmentNames());

    this.setLastMonthName();
    if (this.sharedServices.getPayersList().length == 0) {
      this.authService.isUserNameUpdated.pipe(
        filter(isUpdated => isUpdated)
      ).subscribe(() => {
        this.init();
      }).unsubscribe;
    } else {
      this.init();
    }
  }

  init() {
    this.payersList = this.sharedServices.getPayersList();
    if (this.payersList.findIndex(payer => payer.id == 102) != -1) {
      this.selectedPayer = 102;
    } else {
      this.selectedPayer = this.payersList.length>0 ?this.payersList[0].id:0;
    }
    const defaultPayer = Number.parseInt(localStorage.getItem('defaultDashboardPayer'), 10);
    if (Number.isInteger(defaultPayer) && this.payersList.findIndex(payer => payer.id == defaultPayer) != -1) {
      this.selectedPayer = defaultPayer;
    }
    this.search();
  }

  setLastMonthName() {
    const thisMonth = moment();
    const lastMonth = moment().subtract('month', 5);
    this.lastMonthName = this.monthNames[lastMonth.month()]+"'"+lastMonth.year(); 
    this.currentMonthName = this.monthNames[thisMonth.month()]+"'"+thisMonth.year();
    
  }


  resetDates() {
    this.fromDateControl = new FormControl();
    this.toDateControl = new FormControl();
  }

  search() {
    if (this.searchByLastMonth) {
      const now = moment();
      const lastMonth = moment().subtract( 5,'month');
      this.store.dispatch(updateSearchCriteria({
        fromDate: `${lastMonth.weekYear()}-${lastMonth.month() + 1}-01`,
        toDate: `${now.weekYear()}-${now.month() + 1}-01`,
        payerId: this.selectedPayer
      }));
    } else {
      const fromDate = new Date(this.fromDateControl.value);
      const toDate = new Date(this.toDateControl.value);
      this.fromDateInvalid = this._isInvalidDate(fromDate) || this.fromDateControl.value == null;
      this.toDateInvalid = this._isInvalidDate(toDate) || this.toDateControl.value == null;
      if (this.fromDateInvalid || this.toDateInvalid) {
        return;
      }
      this.store.dispatch(updateSearchCriteria({
        fromDate: `${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-${fromDate.getDate()}`,
        toDate: `${toDate.getFullYear()}-${toDate.getMonth() + 1}-${toDate.getDate()}`,
        payerId: this.selectedPayer
      }));
    }
    localStorage.setItem('defaultDashboardPayer', `${this.selectedPayer}`);
  }

  updateSelectedPayer(payerId: number) {
    this.selectedPayer = payerId;
  }

  _isInvalidDate(date: Date) {
    return date == null ||
      Number.isNaN(date.getTime()) ||
      Number.isNaN(date.getFullYear()) ||
      Number.isNaN(date.getMonth()) ||
      Number.isNaN(date.getDay()) ||
      date.getTime() > Date.now();
  }
}
