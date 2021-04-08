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

  paginationControl = {
    currentIndex: 0,
    totalPages: 0
  };

  creditReportSearchModel: any;

  constructor(private dialog: MatDialog, private creditReportService: CreditReportService, private sharedServices: SharedServices) { }


  ngOnInit() {
    this.creditReportSearchModel = {
      "payerId": 102,
      "batchId": null,
      "receivedFromDate": null,
      "receivedToDate": null,
      "pageNo": 0,
      "pageSize": 2,
    }
    this.getCreditReportListData();
  }
  getCreditReportListData() {
    this.bupaCreditReports();
  }

  searchCreditReports() {
    this.paginationControl.currentIndex = 0;
    if (this.creditReportSearchModel.payerId == 102) {
      this.tawuniyaCreditReports();
    } else if (this.creditReportSearchModel.payerId = 319) {
      this.bupaCreditReports();
    }
  }

  bupaCreditReports() {
    this.sharedServices.loadingChanged.next(true);

    this.creditReportSearchModel.pageNo = this.paginationControl.currentIndex;
    this.creditReportService.listBupaCreditReports(
      this.sharedServices.providerId, this.creditReportSearchModel
    ).subscribe((res: any) => {
      if (res.body !== undefined) {
        console.log(res.body);
        this.creditReportData = res.body.content;
        if (res.body.content.length == 0) {
          this.paginationControl.totalPages = 0;
        }
        this.paginationControl.totalPages = res.body.totalPages;
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      console.log(err);
      this.sharedServices.loadingChanged.next(false);
    });
  }

  tawuniyaCreditReports() {
    this.sharedServices.loadingChanged.next(true);

    this.subscription.add(this.creditReportService.listTawuniyaCreditReports(
      this.sharedServices.providerId, 0, 10
    ).subscribe((res: any) => {
      if (res.body !== undefined) {
        this.creditReportData = res.body.content;

        if (res.body.content.length == 0) {
          this.paginationControl.totalPages = 0;
        }

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
    if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {
      this.paginationControl.currentIndex = 0;
      if (this.creditReportSearchModel.payerId == 102) {
        this.tawuniyaCreditReports();
      } else {
        this.bupaCreditReports();
      }
    }
  }
  goToPrePage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != 0) {
      this.paginationControl.currentIndex = this.paginationControl.currentIndex - 1;
      if (this.creditReportSearchModel.payerId == 102) {
        this.tawuniyaCreditReports();
      } else {
        this.bupaCreditReports();
      }
    }
  }
  goToNextPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex + 1 < this.paginationControl.totalPages) {
      this.paginationControl.currentIndex = this.paginationControl.currentIndex + 1;


      if (this.creditReportSearchModel.payerId == 102) {
        this.tawuniyaCreditReports();
      } else {
        this.bupaCreditReports();
      }
    }
  }
  goToLastPage() {
    if (this.paginationControl != null && this.paginationControl.currentIndex != this.paginationControl.totalPages - 1) {
      this.paginationControl.currentIndex = this.paginationControl.totalPages - 1;
      if (this.creditReportSearchModel.payerId == 102) {
        this.tawuniyaCreditReports();
      } else {
        this.bupaCreditReports();
      }

    }
  }

}
