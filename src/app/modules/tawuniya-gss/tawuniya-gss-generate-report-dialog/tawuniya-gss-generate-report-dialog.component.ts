import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter, MatDatepicker, MatDialogRef, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Store } from '@ngrx/store';
import { Moment } from 'moment';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { InitiateResponse } from '../models/InitiateResponse.model';

import * as _moment from 'moment';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



@Component({
  selector: 'app-tawuniya-gss-generate-report-dialog',
  templateUrl: './tawuniya-gss-generate-report-dialog.component.html',
  styles: [],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})

export class TawuniyaGssGenerateReportDialogComponent implements OnInit {
  today = new Date();

  data : InitiateResponse[];
  lossMonth = new FormControl(null, Validators.required);
  constructor(private dialogRef: MatDialogRef<TawuniyaGssGenerateReportDialogComponent>, private store : Store) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  generateReport() {
    this.lossMonth.markAllAsTouched()
    if(this.lossMonth.invalid){
      return;
    }

    let date = new Date(this.lossMonth.value);
    let newDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    if(Date.parse(newDate)) {
      this.dialogRef.close(date.getFullYear() + "/" + (date.getMonth() + 1));
    } else {
      return this.store.dispatch(showSnackBarMessage({ message: "Please select Loss Month." }));
    }
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.lossMonth.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.lossMonth.setValue(ctrlValue);
    datepicker.close();
  }

}