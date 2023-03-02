import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// tslint:disable-next-line:max-line-length
import { ProvidersNphiesEligibilityService } from 'src/app/services/providersNphiesEligibilitiyService/providers-nphies-eligibility.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { SharedServices } from 'src/app/services/shared.services';
import { ViewPrintPreviewDialogComponent } from '../view-print-preview-dialog/view-print-preview-dialog.component';
import { DbMappingService } from 'src/app/services/administration/dbMappingService/db-mapping.service';

@Component({
  selector: 'app-view-eligibility-details',
  templateUrl: './view-eligibility-details.component.html',
  styles: []
})
export class ViewEligibilityDetailsComponent implements OnInit {

  detailsModel: any;
  isPrint = false;
  providerType="";
  constructor(
    private dialogRef: MatDialogRef<ViewEligibilityDetailsComponent>, private sharedServices: SharedServices,private dialog: MatDialog,private dbMapping: DbMappingService,
    @Inject(MAT_DIALOG_DATA) public data, private providersNphiesEligibilityService: ProvidersNphiesEligibilityService) { }

  ngOnInit() {
    this.getDetails();
    this.getProviderTypeConfiguration();
  }
  getProviderTypeConfiguration() {

    this.dbMapping.getProviderTypeConfiguration(this.sharedServices.providerId).subscribe(event => {
      if (event instanceof HttpResponse) {
        const data:any = event.body;
        if (data.details != null) {
          this.providerType = data.details.claimType ? data.details.claimType : null;
        } else {
          this.providerType = null
        }
      }
     
    }, error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status == 404) {
          this.providerType = null;
        } 
      }
    });
  }
  getDetails() {
    this.sharedServices.loadingChanged.next(true);
    this.providersNphiesEligibilityService.getEligibilityTransactionDetails(this.data.providerId, this.data.responseId).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.detailsModel = event.body;
        }
        this.sharedServices.loadingChanged.next(false);
      }
    }, error => {
      if (error instanceof HttpErrorResponse) {
        console.log(error.error.message);
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  print() {
    this.isPrint = true;
    document.body.classList.add('print-eligibility');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('print-eligibility');
      this.isPrint = false;
    }, 2000);
  }

  closeDialog() {
    this.dialogRef.close();
  }
  openPreviewDialog(){
    this.dialogRef.close();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      preAuthId: this.detailsModel.eligibilityRequestId,
      type: this.providerType,
      printFor:"eligibility"
    };
    const dialogRef = this.dialog.open(ViewPrintPreviewDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    }, error => { });
  }

  getType(){
    const type = this.providerType;
    if( type === 'oral') return "DCAF Form"
    else if (type === 'vision') return "OCAF Form"
    else return "UCAF Form"
  } 
}
