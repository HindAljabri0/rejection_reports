import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { AddCommunicationDialogComponent } from '../add-communication-dialog/add-communication-dialog.component';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse } from '@angular/common/http';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { AttachmentViewDialogComponent } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { AttachmentViewData } from 'src/app/components/dialogs/attachment-view-dialog/attachment-view-data';
import { ViewPrintPreviewDialogComponent } from '../view-print-preview-dialog/view-print-preview-dialog.component';
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-view-preauthorization-details',
  templateUrl: './view-preauthorization-details.component.html',
  styles: []
})
export class ViewPreauthorizationDetailsComponent implements OnInit {

  communications = [];
  selectedTab = 0;

  constructor(
    private dialogRef: MatDialogRef<ViewPreauthorizationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,
    private sharedServices: SharedServices,
    private providerNphiesSearchService: ProviderNphiesSearchService
  ) { }

  ngOnInit() {
    if (this.data.detailsModel.communicationId) {
      this.selectedTab = 1;
    }
    this.data.detailsModel.isApproval=true;
    this.getCommunications();
  }

  openAddCommunicationDialog(commRequestId = null) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-lg'];
    dialogConfig.data = {
      // tslint:disable-next-line:max-line-length
      claimResponseId: this.data.detailsModel.approvalResponseId,
      // tslint:disable-next-line:radix
      communicationRequestId: commRequestId ? parseInt(commRequestId) : '',
      items: this.data.detailsModel.items,
      isApproval:true
    };

    const dialogRef = this.dialog.open(AddCommunicationDialogComponent, dialogConfig);

    const sub = dialogRef.componentInstance.fetchCommunications.subscribe((result) => {
      if (result) {
        this.getCommunications();
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCommunications();
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

  viewCommunicationAttachment(e, attachmentName, byteArray) {
    e.preventDefault();
    this.dialog.open<AttachmentViewDialogComponent, AttachmentViewData, any>(AttachmentViewDialogComponent, {
      data: {
        filename: attachmentName, attachment: byteArray
      }, panelClass: ['primary-dialog', 'dialog-xl']
    });
  }

  OpenReuseModal() {
    this.dialogRef.close({ openReUse: true });
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  openPreviewDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'dialog-xl'];
    dialogConfig.data = {
      preAuthId: this.data.detailsModel.approvalRequestId,
      type: this.data.detailsModel.preAuthorizationInfo.type,
      printFor:"preAuth"
    };
    const dialogRef = this.dialog.open(ViewPrintPreviewDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    }, error => { });
  }

  getType(){
    const {type} = this.data.detailsModel.preAuthorizationInfo;
    if( type === 'oral') return "DCAF Form"
    else if (type === 'vision') return "OCAF Form"
    else return "UCAF Form"
  } 
}
