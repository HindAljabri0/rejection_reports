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
  styleUrls: ['./on-saving-done.component.css']
})
export class OnSavingDoneComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<OnSavingDoneComponent>,
    @Inject(MAT_DIALOG_DATA) private data:OnSavingDoneDialogData,
    private store:Store,
    private sharedServices:SharedServices,
    private location:Location
  ) { }

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => this.store.dispatch(cancelClaim()));
  }

  get showViewAllButton(){
    return this.data.uploadId != null;
  }

  onViewAllClaimsClicked(){
    this.store.dispatch(viewThisMonthClaims({uploadId:this.data.uploadId}));
    this.dialogRef.close();
  }

  onCreateAnotherClaimClicked(){
    this.store.dispatch(cancelClaim());
    this.dialogRef.close();
  }

  onViewClaimClicked(){
    this.store.dispatch(viewThisMonthClaims({uploadId:this.data.uploadId, claimId:this.data.claimId, editMode: this.isNotAccepted}));
    this.dialogRef.close();
  }

  onOK(){
    this.location.go(this.location.path().replace('#edit', ''));
    location.reload();
  }

  get isNotAccepted(){
    return this.data.status.toLowerCase() == 'notaccepted';
  }

  getStatusText(){
    return this.sharedServices.statusToName(this.data.status);
  }

  getStatusColor(){
    return this.sharedServices.getCardAccentColor(this.data.status);
  }

  get errors(){
    return this.data.errors.map(error => error['description']);
  }
}
