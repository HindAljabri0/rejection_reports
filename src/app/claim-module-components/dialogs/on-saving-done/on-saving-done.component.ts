import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { OnSavingDoneDialogData } from './on-saving-done.data';
import { SharedServices } from 'src/app/services/shared.services';
import { viewThisMonthClaims, cancelClaim } from '../../store/claim.actions';
import { Location } from '@angular/common';

@Component({
  selector: 'app-on-saving-done',
  templateUrl: './on-saving-done.component.html',
  styles: []
})
export class OnSavingDoneComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<OnSavingDoneComponent>,
    @Inject(MAT_DIALOG_DATA) private data: OnSavingDoneDialogData,
    private store: Store,
    private sharedServices: SharedServices,
    private location: Location
  ) { }

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => {
      if (!this.showViewAllButton) {
        this.onOK();
      } else if (this.data.status != 'Not_Saved') {
        this.store.dispatch(cancelClaim());
      }
    });
  }

  get showViewAllButton() {
    return this.data.uploadId != null;
  }

  onViewAllClaimsClicked() {
    this.store.dispatch(viewThisMonthClaims({ uploadId: this.data.uploadId }));
    this.dialogRef.close();
  }

  onCreateAnotherClaimClicked() {
    this.store.dispatch(cancelClaim());
    this.dialogRef.close();
  }

  onViewClaimClicked() {
    this.store.dispatch(viewThisMonthClaims({ uploadId: this.data.uploadId, claimId: this.data.claimId, editMode: this.isNotAccepted }));
    this.dialogRef.close();
  }

  onOK() {
    const pathSegments = this.location.path().split('/');
    const oldClaimId = pathSegments.pop();
    oldClaimId.replace('#edit', '');
    const paginationIds = localStorage.getItem('search_tab_result');
    if (paginationIds != null) {
      const paginationIdsSegments = paginationIds.split(',');
      localStorage.setItem('search_tab_result', paginationIdsSegments.map(id => {
        if (id == oldClaimId) {
          return this.data.claimId;
        } else {
          return id;
        }
      }).join(','));
    }
    pathSegments.push(this.data.claimId);
    this.location.go(pathSegments.join('/'));
    location.reload();
  }

  get isNotAccepted() {
    return this.data.status.toLowerCase() == 'notaccepted';
  }

  getStatusText() {
    return this.sharedServices.statusToName(this.data.status);
  }

  getStatusColor() {
    return this.sharedServices.getCardAccentColor(this.data.status);
  }

  get errors() {
    return this.data.errors.map(error => error['description']);
  }
}
