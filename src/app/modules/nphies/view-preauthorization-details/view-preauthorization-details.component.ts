import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { AddCommunicationDialogComponent } from '../add-communication-dialog/add-communication-dialog.component';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse } from '@angular/common/http';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';

@Component({
  selector: 'app-view-preauthorization-details',
  templateUrl: './view-preauthorization-details.component.html',
  styles: []
})
export class ViewPreauthorizationDetailsComponent implements OnInit {

  communications = [];
  constructor(
    private dialogRef: MatDialogRef<ViewPreauthorizationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private providerNphiesSearchService: ProviderNphiesSearchService
  ) { }

  ngOnInit() {
    this.getCommunications();
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  openAddCommunicationDialog() {

    this.dialog.open(AddCommunicationDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg']
    });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-lg'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      claimResponseId: this.data.detailsModel.approvalResponseId
    };

    const dialogRef = this.dialog.open(AddCommunicationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    }, error => { });
  }

  getCommunications() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.getCommunications(this.sharedServices.providerId, this.data.detailsModel.approvalResponseId).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        this.communications = event.body.communicationList;
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      console.log(err);
    });
  }

  getFilename(str) {
    if (str.indexOf('pdf') > -1) {
      return 'pdf';
    } else {
      return 'image';
    }
  }

}
