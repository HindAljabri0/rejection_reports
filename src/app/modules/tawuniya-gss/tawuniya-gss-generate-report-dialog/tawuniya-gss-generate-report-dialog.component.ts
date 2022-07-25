import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter, MatDatepicker, MatDialogRef, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Store } from '@ngrx/store';
import { Moment } from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { InitiateResponse } from '../models/InitiateResponse.model';

@Component({
  selector: 'app-tawuniya-gss-generate-report-dialog',
  templateUrl: './tawuniya-gss-generate-report-dialog.component.html',
  styles: []
})

export class TawuniyaGssGenerateReportDialogComponent implements OnInit {
  today = new Date();
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'MMM YYYY' };
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

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }
}