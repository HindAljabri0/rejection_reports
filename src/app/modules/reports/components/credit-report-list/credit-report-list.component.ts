import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { CreditReportUploadModel } from 'src/app/models/creditReportUpload';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
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
  constructor(private dialog: MatDialog, private creditReportService: CreditReportService) { }

  ngOnInit() {
    this.getCreditReportListData();
    const data = [{
      payerName: 'Bupa',
      receivedDate: new Date('03/04/2020'),
      batchId: 'B1DD',
      totalrejectionAmount: '1,596,900.00 SR',
      totalRejectionRatio: '1,596,900.00 SR',
      medicalRejectionRatio: '39.5%',
      technicalRejectionRatio: '47%',
      routerLink: '/reports/creditReportSummary/0'
    },
    {
      payerName: 'Tawuniya',
      receivedDate: new Date('03/04/2020'),
      batchId: 'B1DD',
      totalrejectionAmount: '1,596,900.00 SR',
      totalRejectionRatio: '1,596,900.00 SR',
      medicalRejectionRatio: '39.5%',
      technicalRejectionRatio: '47%',
      routerLink: '/reports/tawuniya-credit-report-details'
    }];
    this.creditReportData = data;
  }
  getCreditReportListData() {
    const batchId = "0";
    this.subscription.add(this.creditReportService.getCreditReportsList(batchId).subscribe((res: any) => {
      if (res.body !== undefined) {
        const data: any = JSON.stringify(res.body);
        this.creditReportData = data;
      }
    }, err => {
      console.log(err);
    }))
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
