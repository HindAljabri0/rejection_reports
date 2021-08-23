import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SharedServices } from 'src/app/services/shared.services';
import { cancelClaim, viewThisMonthClaims } from '../../store/claim.actions';
import { OnSavingDoneDialogData } from './on-saving-done.data';

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
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute
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
    let oldClaimId;
    if (pathSegments.includes("claimId=")) {
      oldClaimId = pathSegments.pop().split('=').pop();
    } else {
      oldClaimId = pathSegments.pop();
    }
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

    const hasPreviousPage = this.location.path().includes('hasPrevious=1');
    if (hasPreviousPage)
      location.reload();
    else {
      if (this.location.path().includes("claimId=") && (this.data.oldStatus != null && this.data.oldStatus.toLowerCase() != this.data.status.toLowerCase())) {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParamsHandling: 'preserve',
          fragment: `reload..${this.data.oldStatus.toLowerCase()}..${this.data.status.toLowerCase()}`
        });
      } else {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParamsHandling: 'preserve',
          fragment: `reload..${this.data.status.toLowerCase()}`
        });
      }
    }

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
