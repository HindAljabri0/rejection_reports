import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { InitiateResponse } from '../models/InitiateResponse.model';
import { TawuniyaGssService } from '../Services/tawuniya-gss.service';

@Component({
  selector: 'app-tawuniya-gss-generate-report-dialog',
  templateUrl: './tawuniya-gss-generate-report-dialog.component.html',
  styles: []
})
export class TawuniyaGssGenerateReportDialogComponent implements OnInit {

  data : InitiateResponse[];
  lossMonth : FormControl = new FormControl();
  constructor(private dialogRef: MatDialogRef<TawuniyaGssGenerateReportDialogComponent>, private store : Store) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  generateReport() {
    let date = new Date(this.lossMonth.value);
    let newDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    if(Date.parse(newDate)) {
      this.dialogRef.close(date.getFullYear() + "/" + (date.getMonth() + 1));
    } else {
      return this.store.dispatch(showSnackBarMessage({ message: "Please select Loss Month." }));
    }
  }

}