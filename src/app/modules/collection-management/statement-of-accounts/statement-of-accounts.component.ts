import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { StatementAccountSummary } from 'src/app/models/statementAccountModel';
import { ReportsService } from 'src/app/services/reportsService/reports.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AddStatementOfAccountsDialogComponent } from '../add-statement-of-accounts-dialog/add-statement-of-accounts-dialog.component';
@Component({
  selector: 'app-statement-of-accounts',
  templateUrl: './statement-of-accounts.component.html',
  styles: []
})
export class StatementOfAccountsComponent implements OnInit {
  stamentAccountModel = new StatementAccountSummary();
  minDate: any;
  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' };
  sOAData: any[] = [];
  constructor(public dialog: MatDialog, private reportService: ReportsService, private commen: SharedServices, private location: Location, private routeActive: ActivatedRoute, private router: Router) {
    this.routeActive.queryParams.subscribe(params => {

      if (params.searchCriteria != null) {
        this.stamentAccountModel.searchCriteria = params.searchCriteria;
      }
      if (params.fromDate != null) {
        const fromDate = moment(params.fromDate, 'YYYY-MM-DD').toDate();
        this.stamentAccountModel.fromDate = fromDate;
      }
      else {
        let todayDate = new Date();
        this.stamentAccountModel.fromDate = new Date(todayDate.setMonth(todayDate.getMonth() - 1));
      }
      if (params.toDate != null) {
        const toDate = moment(params.toDate, 'YYYY-MM-DD').toDate();
        this.stamentAccountModel.toDate = toDate;
      }
      else {
        this.stamentAccountModel.toDate = new Date();
      }
      if (params.page != null) {
        this.stamentAccountModel.page = params.page;
      }
      if (params.size != null) {
        this.stamentAccountModel.size = params.size;
      }
      if (this.stamentAccountModel.toDate != null && this.stamentAccountModel.fromDate != null && this.stamentAccountModel.searchCriteria != null) {
        this.getPayerSOAData();
      }
    });
  }

  ngOnInit() {
  }
  getPayerSOAData() {
    const body: StatementAccountSummary = {
      fromDate: moment(this.stamentAccountModel.fromDate).format('YYYY-MM-DD'),
      toDate: moment(this.stamentAccountModel.toDate).format('YYYY-MM-DD'),
      searchCriteria: this.stamentAccountModel.searchCriteria,
      page: this.stamentAccountModel.page,
      size: this.stamentAccountModel.size,
      totalPages: this.stamentAccountModel.totalPages
    };
    this.commen.loadingChanged.next(true);
    this.editURL(body.fromDate, body.toDate);
    this.reportService.getPayerSOAData(this.commen.providerId, body).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        if (event.status === 200 && event.statusText.toLowerCase() === 'ok') {
          const body = event['body'];
          const data = JSON.parse(body);
          this.sOAData = data.content;
          this.stamentAccountModel.totalPages = data.totalPages;
        }
        else {
          this.sOAData = [];
        }
        this.commen.loadingChanged.next(false);
      }
    }, err => {
      this.commen.loadingChanged.next(false);
      this.sOAData = [];
      console.log(err);
    });
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
    this.getPayerSOAData();
  }

  goToFirstPage() {
    if (this.stamentAccountModel.page != 0) {
      this.stamentAccountModel.page = 0;
    }
    this.getPayerSOAData();
  }
  goToPrePage() {
    if (this.stamentAccountModel.page != 0) {
      this.stamentAccountModel.page = this.stamentAccountModel.page - 1;
    }
    this.getPayerSOAData();
  }
  goToNextPage() {
    if ((this.stamentAccountModel.page + 1) < this.stamentAccountModel.totalPages) {
      this.stamentAccountModel.page = this.stamentAccountModel.page + 1;
    }
    this.getPayerSOAData();
  }
  goToLastPage() {
    if (this.stamentAccountModel.page != (this.stamentAccountModel.totalPages - 1)) {
      this.stamentAccountModel.page = this.stamentAccountModel.totalPages - 1;
    }
    this.getPayerSOAData();
  }
  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.stamentAccountModel.toDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.stamentAccountModel.toDate = '';
      }
    }
    this.minDate = new Date(event);

  }

  editURL(fromDate?: string, toDate?: string) {
    let path = '/collection-management/statement-of-accounts?';

    if (this.stamentAccountModel.searchCriteria != null) {
      path += `searchCriteria=${this.stamentAccountModel.searchCriteria}&`;
    }
    if (fromDate != null) {
      path += `fromDate=${fromDate}&`;
    }
    if (toDate != null) {
      path += `toDate=${toDate}`;
    }
    if (this.stamentAccountModel.page != null) {
      path += `page=${this.stamentAccountModel.page}`;
    }
    if (this.stamentAccountModel.size != null) {
      path += `size=${this.stamentAccountModel.size}`;
    }
    if (path.endsWith('?') || path.endsWith('&')) {
      path = path.substr(0, path.length - 1);
    }
    this.location.go(path);
  }
  get isLoading() {
    return this.commen.loading;
  }
  goToStatmentDetails(item) {
    this.router.navigate(['/collection-management/statement-of-accounts-details'], { queryParams: { flag: 1, id: item.statementId, fromDate: moment(this.stamentAccountModel.fromDate).format('YYYY-MM-DD'), toDate: moment(this.stamentAccountModel.toDate).format('YYYY-MM-DD') } });
  }
}
