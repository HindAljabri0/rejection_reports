import { DatePipe } from '@angular/common';
import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { CreditReportUploadModel } from 'src/app/models/creditReportUpload';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { SharedServices } from 'src/app/services/shared.services';
import { CreditReportUploadModalComponent } from '../credit-report-upload-modal/credit-report-upload-modal.component';


@Component({
  selector: 'app-bupa-rejection-list',
  templateUrl: './credit-report-list.component.html',
  styles: []
})
export class CreditReportListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  creditReportData: CreditReportUploadModel[] = [];
  currentFileUpload: File;
  isLoading = false;


  creditReportSearchModel:{
    payerId: number,
    batchId: string,
    receivedFromDate: Date,
    receivedToDate: Date,
    status: 'All' | 'SUBMITTED' | 'UNDERSUBMISSION' | 'UNDERREVIEW' | 'NEW',
    pageNo: number,
    pageSize: number
  };

  constructor(private dialog: MatDialog, private creditReportService: CreditReportService, private sharedServices: SharedServices, private datePipe: DatePipe) { }


  ngOnInit() {
    this.creditReportSearchModel = {
      payerId: 102,
      batchId: null,
      receivedFromDate: null,
      receivedToDate: null,
      status: "All",
      pageNo: 0,
      pageSize: 2
    }
    this.getCreditReportListData();
  }
  getCreditReportListData() {
    this.bupaCreditReports();
  }

  searchCreditReports() {

    if (this.creditReportSearchModel.payerId == 102) {
      this.tawuniyaCreditReports();
    } else if (this.creditReportSearchModel.payerId = 319) {
      this.bupaCreditReports();
    }
  }

  bupaCreditReports() {
    this.sharedServices.loadingChanged.next(true);

    this.creditReportService.listBupaCreditReports(
      this.sharedServices.providerId, this.creditReportSearchModel
    ).subscribe((res: any) => {
      if (res.body !== undefined) {
        console.log(res.body);
        this.creditReportData = res.body.content;
        if (res.body.content.length == 0) {
          this.creditReportSearchModel.pageSize = 0;
        }
        this.creditReportSearchModel.pageSize = res.body.totalPages;
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      console.log(err);
      this.sharedServices.loadingChanged.next(false);
    });
  }

  tawuniyaCreditReports() {
    this.sharedServices.loadingChanged.next(true);
    let fromDate;
    let toDate;
    if (this.creditReportSearchModel.receivedFromDate != null) {
      fromDate = this.datePipe.transform(this.creditReportSearchModel.receivedFromDate, "yyyy-MM-dd");

    }
    if (this.creditReportSearchModel.receivedToDate != null) {
      toDate = this.datePipe.transform(this.creditReportSearchModel.receivedToDate, "yyyy-MM-dd");

    }

    this.subscription.add(this.creditReportService.listTawuniyaCreditReports(
      this.sharedServices.providerId, this.creditReportSearchModel.status, fromDate, toDate, this.creditReportSearchModel.batchId, this.creditReportSearchModel.pageNo, 10
    ).subscribe((res: any) => {
      if (res.body !== undefined) {
        this.creditReportData = res.body.content;

        this.creditReportSearchModel.pageSize = res.body.totalPages;
        this.creditReportSearchModel.pageNo = res.body.number;

        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      console.log(err);
      this.sharedServices.loadingChanged.next(false);
    }));
  }

  openPdf(event) {
    const dialogRef = this.dialog.open(CreditReportUploadModalComponent,
      { panelClass: ['primary-dialog'], autoFocus: false, data: event.target.files[0] });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    }, error => {

    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  clearFiles(event) {
    event.target.value = '';
  }

  goToFirstPage() {
    if (this.creditReportSearchModel.pageNo != 0) {
      this.creditReportSearchModel.pageNo = 0;
      if (this.creditReportSearchModel.payerId == 102) {
        this.tawuniyaCreditReports();
      } else {
        this.bupaCreditReports();
      }
    }
  }
  goToPrePage() {
    if (this.creditReportSearchModel.pageNo != 0) {
      this.creditReportSearchModel.pageNo = this.creditReportSearchModel.pageNo - 1;
      if (this.creditReportSearchModel.payerId == 102) {
        this.tawuniyaCreditReports();
      } else {
        this.bupaCreditReports();
      }
    }
  }
  goToNextPage() {
    if (this.creditReportSearchModel.pageNo + 1 < this.creditReportSearchModel.pageSize) {
      this.creditReportSearchModel.pageNo = this.creditReportSearchModel.pageNo + 1;


      if (this.creditReportSearchModel.payerId == 102) {
        this.tawuniyaCreditReports();
      } else {
        this.bupaCreditReports();
      }
    }
  }
  goToLastPage() {
    if (this.creditReportSearchModel.pageNo != this.creditReportSearchModel.pageSize - 1) {
      this.creditReportSearchModel.pageNo = this.creditReportSearchModel.pageSize - 1;
      if (this.creditReportSearchModel.payerId == 102) {
        this.tawuniyaCreditReports();
      } else {
        this.bupaCreditReports();
      }

    }
  }

}
