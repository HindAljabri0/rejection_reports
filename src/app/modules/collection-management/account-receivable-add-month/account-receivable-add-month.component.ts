import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-account-receivable-add-month',
  templateUrl: './account-receivable-add-month.component.html',
  styles: []
})
export class AccountReceivableAddMonthComponent implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'YYYY' };
  constructor(private dialogRef: MatDialogRef<AccountReceivableAddMonthComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
