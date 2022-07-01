import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
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
  constructor(private dialogRef: MatDialogRef<TawuniyaGssGenerateReportDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  generateReport() {
    let date = new Date(this.lossMonth.value);
    console.log(date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate());
    this.dialogRef.close(date.getFullYear() + "/" + date.getMonth());
  }

}