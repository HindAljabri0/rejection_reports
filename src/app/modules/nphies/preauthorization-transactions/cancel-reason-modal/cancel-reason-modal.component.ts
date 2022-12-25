import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesApprovalService } from 'src/app/services/providerNphiesApprovalService/provider-nphies-approval.service';
import { SharedDataService } from 'src/app/services/sharedDataService/shared-data.service';

@Component({
  selector: 'app-cancel-reason-modal',
  templateUrl: './cancel-reason-modal.component.html',
  styles: []
})
export class CancelReasonModalComponent implements OnInit {

  FormCancel: FormGroup = this.formBuilder.group({
    approvalRequestId: ['', Validators.required],
    cancelReason: ['', Validators.required]
  });

  cancelReasonList = this.sharedDataService.cancelReasonList;
  isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<CancelReasonModalComponent>,
    private sharedServices: SharedServices,
    private sharedDataService: SharedDataService,
    private dialogService: DialogService,
    private providerNphiesApprovalService: ProviderNphiesApprovalService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this.data.approvalRequestId) {
      this.FormCancel.patchValue({
        approvalRequestId: this.data.approvalRequestId
      });
    } else if (this.data.cancelData) {
      this.FormCancel.controls.approvalRequestId.clearValidators();
      this.FormCancel.controls.approvalRequestId.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.data.approvalRequestId) {
      this.cancelSingle();
    } else if (this.data.cancelData) {
      this.cancelMultiple();
    }
  }

  cancelSingle() {
    this.isSubmitted = true;
    if (this.FormCancel.valid) {
      this.sharedServices.loadingChanged.next(true);

      const model: any = {};
      model.approvalRequestId = this.data.approvalRequestId;
      // model.approvalResponseId  = this.data.approvalResponseId;
      model.cancelReason = this.FormCancel.controls.cancelReason.value.value;

      let action: any;
      if (this.data.type === 'cancel') {
        action = this.providerNphiesApprovalService.cancelApprovalRequest(this.sharedServices.providerId, model);
      } else if (this.data.type === 'nullify') {
        action = this.providerNphiesApprovalService.nullifyApprovalRequest(this.sharedServices.providerId, model);
      }

      action.subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const body: any = event.body;
            if (body.status === 'OK') {
              if (body.outcome.toString().toLowerCase() === 'failed') {
                const errors: any[] = [];

                if (body.statusReason) {
                  errors.push('Outcome Reason: ' + body.statusReason);
                }

                if (body.disposition) {
                  errors.push(body.disposition);
                }

                if (body.errors && body.errors.length > 0) {
                  body.errors.forEach(err => {
                    err.coding.forEach(codex => {
                      errors.push(codex.code + ' : ' + codex.display);
                    });
                  });
                }

                this.dialogService.showMessage(body.message, '', 'alert', true, 'OK', errors);
              } else {
                const errors: any[] = [];
                if (body.statusReason) {
                  errors.push('Outcome Reason: ' + body.statusReason);
                }
                if (errors.length > 0) {
                  this.dialogService.showMessage('Success', body.message, 'success', true, 'OK', errors, null, true, null, true);
                } else {
                  this.dialogService.showMessage('Success', body.message, 'success', true, 'OK', null, null, true, null, true);
                }

                // this.dialogRef.close(true);
              }

            }
          }
          this.sharedServices.loadingChanged.next(false);
        }
      }, error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', error.error.errors);
          } else if (error.status === 404) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          } else if (error.status === 500) {
            this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
          } else if (error.status === 503) {
            const errors: any[] = [];
            if (error.error.errors) {
              error.error.errors.forEach(x => {
                errors.push(x);
              });
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK', errors);
            } else {
              this.dialogService.showMessage(error.error.message, '', 'alert', true, 'OK');
            }
          }
          this.sharedServices.loadingChanged.next(false);
        }
      });
    }
  }

  cancelMultiple() {
    this.isSubmitted = true;
    if (this.FormCancel.valid) {
      this.sharedServices.loadingChanged.next(true);

      const model: any = {};
      model.cancelReason = this.FormCancel.controls.cancelReason.value.value;

      let action: any;
      if (this.data.cancelType === 'all') {
        action = this.providerNphiesApprovalService.cancelClaims(this.data.cancelData.providerId, model.cancelReason,
          this.data.cancelData.selectedClaims, this.data.cancelData.uploadId, this.data.cancelData.claimRefNo, this.data.cancelData.to,
          this.data.cancelData.payerIds, this.data.cancelData.batchId, this.data.cancelData.memberId, this.data.cancelData.invoiceNo,
          this.data.cancelData.patientFileNo, this.data.cancelData.from,this.data.cancelData.claimTypes,this.data.cancelData.netAmount, this.data.cancelData.nationalId, this.data.cancelData.statuses,
          this.data.cancelData.organizationId, this.data.cancelData.requestBundleId);
      } else if (this.data.cancelType === 'selected') {
        action = this.providerNphiesApprovalService.cancelClaims(this.data.cancelData.providerId, model.cancelReason,
          this.data.cancelData.selectedClaims);
      }

      action.subscribe((event: any) => {
        if (event instanceof HttpResponse) {
          if (event.status === 202) {
            const body: any = event.body;
            const resModel: any = {};
            resModel.Success = true;
            resModel.queuedStatus = body.queuedStatus;
            resModel.Message = body.message;
            resModel.Errors = body.errors;
            this.dialogRef.close(resModel);
          }
          this.sharedServices.loadingChanged.next(false);
        }
      }, error => {
        this.sharedServices.loadingChanged.next(false);
        const resModel: any = {};
        resModel.Success = false;
        resModel.Error = error;
        this.dialogRef.close(resModel);
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
