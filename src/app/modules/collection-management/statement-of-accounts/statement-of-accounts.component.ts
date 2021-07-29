import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddStatementOfAccountsDialogComponent } from '../add-statement-of-accounts-dialog/add-statement-of-accounts-dialog.component';
import { StatementAccountSummary } from 'src/app/models/statementAccountModel';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap';
@Component({
  selector: 'app-statement-of-accounts',
  templateUrl: './statement-of-accounts.component.html',
  styles: []
})
export class StatementOfAccountsComponent implements OnInit {
  stamentAccountModel = new StatementAccountSummary();
  minDate: any;
  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' };
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddStatementOfAccountDialog() {
    const dialogRef = this.dialog.open(AddStatementOfAccountsDialogComponent, {
      panelClass: ['primary-dialog']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.status) {
      }
    }, error => {

    });
  }
  submit() {

  }

  goToFirstPage() {
    if (this.stamentAccountModel.pageNo != 0) {
      this.stamentAccountModel.pageNo = 0;
    }
  }
  goToPrePage() {
    if (this.stamentAccountModel.pageNo != 0) {
      this.stamentAccountModel.pageNo = this.stamentAccountModel.pageNo - 1;
    }
  }
  goToNextPage() {
    if ((this.stamentAccountModel.pageNo + 1) < this.stamentAccountModel.totalPages) {
      this.stamentAccountModel.pageNo = this.stamentAccountModel.pageNo + 1;


    }
  }
  goToLastPage() {
    if (this.stamentAccountModel.pageNo != (this.stamentAccountModel.totalPages - 1)) {
      this.stamentAccountModel.pageNo = this.stamentAccountModel.totalPages - 1;

    }
  }
  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.stamentAccountModel.endDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.stamentAccountModel.endDate = '';
      }
    }
    this.minDate = new Date(event);

  }
}
