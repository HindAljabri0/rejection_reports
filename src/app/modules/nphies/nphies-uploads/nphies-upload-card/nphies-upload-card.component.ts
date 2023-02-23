import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-nphies-upload-card',
  templateUrl: './nphies-upload-card.component.html',
  styles: []
})
export class NphiesUploadCardComponent implements OnInit {

  @Input() data: any;

  constructor(private sharedServices: SharedServices
    , private dialogService: DialogService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService) { }

  ngOnInit() {

  }
  deleteUpload() {
    if (this.sharedServices.loading) {
      return;
    }
    this.dialogService.openMessageDialog(
      new MessageDialogData(`Delete ${this.data.uploadName}?`,
        `This will delete all not submitted claims inside this upload. Are you sure you want to delete them? This cannot be undone.`,
        false,
        true))
      .subscribe(result => {
        if (result === true) {
          this.sharedServices.loadingChanged.next(true);
          // tslint:disable-next-line:max-line-length
          this.providerNphiesApprovalService.deleteClaimByCriteria(this.sharedServices.providerId, null, this.data.uploadId, null, null, null,
            null, null, null, null, null, null, null, null, null)
            .subscribe(event => {
              if (event instanceof HttpResponse) {
                this.dialogService.openMessageDialog(new MessageDialogData('',
                  `upload ${this.data.uploadName} Deleted Successfully`,
                  false)).subscribe(afterColse => location.reload());


                if (this.totalClaims == 0) {
                  this.data.uploadName += ' [DELETED]';
                }
                this.sharedServices.loadingChanged.next(false);
              }
            }, errorEvent => {
              this.sharedServices.loadingChanged.next(false);
              if (errorEvent instanceof HttpErrorResponse) {
                
                if (errorEvent.status == 404) {
                  this.dialogService.openMessageDialog({
                    title: '',
                    message: 'It appears that the claims have been already deleted for this upload.',
                    isError: true
                  });
                } else if (errorEvent.status == 500 && errorEvent.error['status']=='NotDeleted'){
                  this.dialogService.openMessageDialog({
                    title: '',
                    message: errorEvent.error['message'],
                    isError: true
                  });

                } else {
                  this.dialogService.openMessageDialog({
                    title: '',
                    message: 'Cloud not handle the request at the moment. Please try again later.',
                    isError: true
                  });
                }
              }
            });
        }
      });
  }
  get totalClaims() {
    return this.activeClaims + this.inactiveClaim;
  }

  get activeClaims() {
    return this.data.readyForSubmission + this.data.rejectedByWaseel + this.data.underSubmission
    + this.data.cancelled + this.data.paid + this.data.partiallyPaid + this.data.rejectedByPayer
    + this.data.rejectedByNphies + this.data.approved + this.data.partialApproved
    + this.data.queuedByNphies + this.data.pended + this.data.failed + this.data.invalid + this.data.failedNphies;
  }

  get inactiveClaim(){
    return this.data.inactiveCount;
  }


  get canBeDeleted() {
    return ((this.sharedServices.userPrivileges.ProviderPrivileges.NPHIES.isAdmin
      || this.sharedServices.userPrivileges.ProviderPrivileges.NPHIES.canAccessClaim))
      && (this.data.readyForSubmission + this.data.rejectedByWaseel + this.data.cancelled) > 0;
  }

}
