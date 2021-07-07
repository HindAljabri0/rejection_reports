import { Component, Input, OnInit } from '@angular/core';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { UploadCardData } from 'src/app/models/UploadCardData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-upload-card',
  templateUrl: './upload-card.component.html',
  styles: []
})
export class UploadCardComponent implements OnInit {

  @Input()
  data: UploadCardData;

  constructor(private dialogService: DialogService, private sharedServices: SharedServices, private claimService: ClaimService) { }

  ngOnInit() {

  }

  get totalClaims() {
    return this.data.ready_for_submission + this.data.rejected_by_waseel + this.data.undersubmission
      + this.data.underprocessing + this.data.paid + this.data.partially_paid + this.data.rejected_by_payer
      + this.data.invalid + this.data.downloadable;
  }

  get canBeDeleted() {
    return (this.data.ready_for_submission + this.data.rejected_by_waseel + this.data.invalid + this.data.downloadable) > 0;
  }

  deleteUpload() {
    if (this.sharedServices.loading) {
      return;
    }

    if (this.sharedServices.isAdmin && this.sharedServices.isProvider) {
      this.dialogService.openConfirmAdminDeleteDialog().subscribe(action => {
        switch (action) {
          case "deleteAll":

            this.dialogService.openMessageDialog(
              new MessageDialogData(`Delete ${this.data.uploadName}?`,
                `This will delete all claims including submitted claims inside this upload. Are you sure you want to delete them? This cannot be undone.`,
                false,
                true))
              .subscribe(result => {
                if (result === true) {
                  this.sharedServices.loadingChanged.next(true);
                  this.claimService.deleteClaimByCriteria(this.sharedServices.providerId, null, null, this.data.uploadId + '', null, null, null, null, null, null, null, null, null, null, null, null, null)
                    .subscribe(event => {
                      if (event instanceof HttpResponse) {
                        this.data.downloadable = 0;
                        this.data.invalid = 0;
                        this.data.ready_for_submission = 0;
                        this.data.rejected_by_waseel = 0;
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
                            title: "",
                            message: "It appears that the claims have been already deleted for this upload.",
                            isError: true
                          })
                        } else {
                          this.dialogService.openMessageDialog({
                            title: "",
                            message: "Cloud not handle the request at the moment. Please try again later.",
                            isError: true
                          })
                        }
                      }
                    });
                }
              })
            break;
          case "confirm":

            this.sharedServices.loadingChanged.next(true);
            this.claimService.deleteClaimByCriteria(this.sharedServices.providerId, null, null, this.data.uploadId + '', null, null, null, null, null, ['Accepted', 'NotAccepted', 'Downloaded', 'Faield'], null, null, null, null, null, null, null)
              .subscribe(event => {
                if (event instanceof HttpResponse) {
                  this.data.downloadable = 0;
                  this.data.invalid = 0;
                  this.data.ready_for_submission = 0;
                  this.data.rejected_by_waseel = 0;
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
                      title: "",
                      message: "It appears that the claims have been already deleted for this upload.",
                      isError: true
                    })
                  } else {
                    this.dialogService.openMessageDialog({
                      title: "",
                      message: "Cloud not handle the request at the moment. Please try again later.",
                      isError: true
                    })
                  }
                }
              });

            break;

        }
      });

    }
    else {
      this.dialogService.openMessageDialog(
        new MessageDialogData(`Delete ${this.data.uploadName}?`,
          `This will delete all not submitted claims inside this upload. Are you sure you want to delete them? This cannot be undone.`,
          false,
          true))
        .subscribe(result => {
          if (result === true) {
            this.sharedServices.loadingChanged.next(true);
            this.claimService.deleteClaimByCriteria(this.sharedServices.providerId, null, null, this.data.uploadId + '', null, null, null, null, null, null, null, null, null, null, null, null, null)
              .subscribe(event => {
                if (event instanceof HttpResponse) {
                  this.data.downloadable = 0;
                  this.data.invalid = 0;
                  this.data.ready_for_submission = 0;
                  this.data.rejected_by_waseel = 0;
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
                      title: "",
                      message: "It appears that the claims have been already deleted for this upload.",
                      isError: true
                    })
                  } else {
                    this.dialogService.openMessageDialog({
                      title: "",
                      message: "Cloud not handle the request at the moment. Please try again later.",
                      isError: true
                    })
                  }
                }
              });
          }
        })
    }
  }
}
