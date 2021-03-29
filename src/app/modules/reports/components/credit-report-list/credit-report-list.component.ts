import { Component, OnInit } from '@angular/core';
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
export class CreditReportListComponent implements OnInit {
  private subscription = new Subscription();
  creditReportData: CreditReportUploadModel[] = [];
  currentFileUpload: File;
  constructor(private dialog: MatDialog, private creditReportService: CreditReportService, private sharedServices: SharedServices ) { }

  ngOnInit() {
    this.getCreditReportListData();
    const data = [{
      payerName: 'Bupa',
      receivedDate: new Date('03/04/2020'),
      batchId: 'B1DD',
      totalRejectionsAmount: '1,596,900.00 SR',
      medicalRejectionRatio: '39.5%',
      technicalRejectionRatio: '47%'
    }];
    this.creditReportData = data;
  }
  getCreditReportListData() {
    this.subscription.add(this.creditReportService.listTawuniyaCreditReports(this.sharedServices.providerId, 0, 10).subscribe((res: any) => {
      if (res.body !== undefined) {
        this.creditReportData = res.body.content;
      }
    }, err => {
      console.log(err);
    }));
  }

  openPdf(event) {
    const dialogRef = this.dialog.open(CreditReportUploadModalComponent, { panelClass: ['primary-dialog'], autoFocus: false, data: event.target.files[0] });
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
    event.target.value = "";
  }

}
