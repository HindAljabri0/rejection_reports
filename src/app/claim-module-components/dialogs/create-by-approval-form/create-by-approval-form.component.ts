import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { ApprovalFormData } from './create-by-approval-form.data';
import { FormControl, Validators } from '@angular/forms';
import { startCreatingNewClaim, getClaimDataByApproval } from '../../store/claim.actions';
import { getIsApprovalFormLoading } from '../../store/claim.reducer';

@Component({
  selector: 'app-create-by-approval-form',
  templateUrl: './create-by-approval-form.component.html',
  styles: []
})
export class CreateByApprovalFormComponent implements OnInit {

  approvalNumberController: FormControl = new FormControl('', { validators: Validators.required });
  payers;
  selectedPayer = -1;
  payersHasError = false;
  title: string;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<CreateByApprovalFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ApprovalFormData,
    private store: Store
  ) { }

  ngOnInit() {
    this.store.select(getIsApprovalFormLoading).subscribe(loading => {
      this.loading = loading;
      if (loading) {
        this.title = 'Retrieving claim data from approval...';
      }
    });
    this.payers = this.data.payers;
    this.title = 'Do you have an approval number?';
  }

  createWithOutApproval() {
    this.store.dispatch(startCreatingNewClaim({
      data: {
        claimType: this.data.claimType,
        providerClaimNumber: this.data.providerClaimNumber
      }
    }));
    this.dialogRef.close();
  }

  createWithpproval() {
    if (this.selectedPayer == -1) {
      this.payersHasError = true;
      return;
    }
    if (this.approvalNumberController.invalid) {
      return;
    }
    this.store.dispatch(getClaimDataByApproval({
      approvalNumber: this.approvalNumberController.value,
      payerId: `${this.selectedPayer}`,
      claimType: (this.data.claimType),
      providerClaimNumber: this.data.providerClaimNumber
    }));
  }

}
