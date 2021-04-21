import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { CreditReportUploadModel } from 'src/app/models/creditReportUpload';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { SharedServices } from 'src/app/services/shared.services';
import { CreditReportUploadModalComponent } from '../credit-report-upload-modal/credit-report-upload-modal.component';
import { Router } from '@angular/router';


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
  currentStatus = 'All';


  creditReportSearchModel: {
    payerId: number,
    batchId: string,
    receivedFromDate: Date,
    receivedToDate: Date,
    status: 'All' | 'SUBMITTED' | 'UNDERSUBMISSION' | 'UNDERREVIEW' | 'NEW'|'INVALID'|'FAILED',
    pageNo: number,
    pageSize: number,
    totalPages: number
  };
  isFileUploadVisible: boolean = false;
  isBupaRecord: boolean = false;
  // paginationControl: any;

  constructor(private dialog: MatDialog, private creditReportService: CreditReportService, private sharedServices: SharedServices, private datePipe: DatePipe, private router: Router) { }


  ngOnInit() {
    this.creditReportSearchModel = {
      payerId: 102,
      batchId: null,
      receivedFromDate: null,
      receivedToDate: null,
      status: 'All',
      pageNo: 0,
      pageSize: 2,
      totalPages: 0
    };
    this.searchCreditReports();
  }

  searchCreditReports() {
    this.isBupaRecord = this.creditReportSearchModel.payerId === 102 ? false : true;
    if (!this.isBupaRecord) {
      this.tawuniyaCreditReports();
    } else if (this.isBupaRecord) {
      this.bupaCreditReports();
    }
  }

  bupaCreditReports() {
    this.sharedServices.loadingChanged.next(true);

    this.creditReportService.listBupaCreditReports(
      this.sharedServices.providerId, {...this.creditReportSearchModel, status: null}
    ).subscribe((res: any) => {
      if (res.body !== undefined) {
        this.creditReportData = res.body.content;
        if (res.body.content.length == 0) {
          this.creditReportSearchModel.totalPages = 0;
        } else {
          this.creditReportSearchModel.totalPages = res.body.totalPages;
          this.sharedServices.loadingChanged.next(false);
        }
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
      fromDate = this.datePipe.transform(this.creditReportSearchModel.receivedFromDate, 'yyyy-MM-dd');

    }
    if (this.creditReportSearchModel.receivedToDate != null) {
      toDate = this.datePipe.transform(this.creditReportSearchModel.receivedToDate, 'yyyy-MM-dd');

    }

    this.subscription.add(this.creditReportService.listTawuniyaCreditReports(
      this.sharedServices.providerId,
      this.creditReportSearchModel.status,
      fromDate,
      toDate,
      this.creditReportSearchModel.batchId,
      this.creditReportSearchModel.pageNo,
      10
    ).subscribe((res: any) => {
      if (res.body !== undefined) {
        this.creditReportData = res.body.content;

        this.creditReportSearchModel.totalPages = res.body.totalPages;
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
    if ((this.creditReportSearchModel.pageNo + 1) < this.creditReportSearchModel.totalPages) {
      this.creditReportSearchModel.pageNo = this.creditReportSearchModel.pageNo + 1;


      if (this.creditReportSearchModel.payerId == 102) {
        this.tawuniyaCreditReports();
      } else {
        this.bupaCreditReports();
      }
    }
  }
  goToLastPage() {
    if (this.creditReportSearchModel.pageNo != (this.creditReportSearchModel.totalPages - 1)) {
      this.creditReportSearchModel.pageNo = this.creditReportSearchModel.totalPages - 1;
      if (this.creditReportSearchModel.payerId == 102) {
        this.tawuniyaCreditReports();
      } else {
        this.bupaCreditReports();
      }

    }
  }
  checkFileUploadVisible() {
    this.isFileUploadVisible = this.creditReportSearchModel.payerId === 102 ? false : true;
    this.creditReportData = [];
    this.creditReportSearchModel.totalPages = 0;
  }
  goToSummaryPage(item) {
    this.isFileUploadVisible ? this.router.navigate(['/reports/creditReportSummary'], { queryParams: { batchId: item.batchId, payerId: item.payerId } }) : this.router.navigateByUrl(`/reports/creditReports/tawuniya/batch/${item.batchId}`);
  }

  changeTab(e, status) {
    e.preventDefault();
    this.currentStatus = status;
    this.creditReportSearchModel = {
      payerId: 102,
      batchId: null,
      receivedFromDate: null,
      receivedToDate: null,
      status,
      pageNo: 0,
      pageSize: 2,
      totalPages: 0
    };
    this.tawuniyaCreditReports();
  }

}
