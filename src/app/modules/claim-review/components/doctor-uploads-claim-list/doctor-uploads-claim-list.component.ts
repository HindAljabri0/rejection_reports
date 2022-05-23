import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange, MatDialog, PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/authService/authService.service';
import { SharedServices } from 'src/app/services/shared.services';
import { initState, UserPrivileges } from 'src/app/store/mainStore.reducer';
import { PageControls } from '../../models/claimReviewState.model';
import { ClaimSummary } from '../../models/claimSummary.mocel';
import { loadSingleClaim, loadSingleClaimErrors, loadUploadClaimsList, markAsDoneAll, markAsDoneSelected } from '../../store/claimReview.actions';
import { getUploadClaimsSummary, getUploadClaimsSummaryPageControls } from '../../store/claimReview.reducer';
import {
  DoctorUploadsClaimDetailsDialogComponent
} from '../doctor-uploads-claim-details-dialog/doctor-uploads-claim-details-dialog.component';


@Component({
  selector: 'app-doctor-uploads-claim-list',
  templateUrl: './doctor-uploads-claim-list.component.html',
  styles: []
})
export class DoctorUploadsClaimListComponent implements OnInit {

  public uploadId: number;
  $claimSummary: Observable<ClaimSummary[]>;
  claimSummaryIds: string[] = [];
  selectedClaimNumberIds: string[] = new Array();
  userPrivileges: UserPrivileges = initState.userPrivileges;

  allCheckBoxIsChecked: boolean;
  allCheckBoxIsIndeterminate: boolean;

  pageControl: PageControls;
  constructor(private activatedRoute: ActivatedRoute, private sharedServices: SharedServices,
    private authService: AuthService, private dialog: MatDialog, private store: Store) {
    this.pageControl = new PageControls(0, 10);
  }

  ngOnInit() {
    this.uploadId = this.activatedRoute.snapshot.params.uploadId;
    this.refreshData();
    this.$claimSummary.subscribe(claimSummary => {
      this.claimSummaryIds = claimSummary ? [...claimSummary.map(data => data.provClaimNo)] : []
    })
    this.store.select(getUploadClaimsSummaryPageControls).subscribe(pageControl => {
      this.pageControl = { ...pageControl }
    })
  }

  refreshData() {
    this.sharedServices.loadingChanged.next(true);
    this.store.dispatch(loadUploadClaimsList({
      data: {
        uploadId: this.uploadId,
        payload: {
          page: this.pageControl.pageNumber,
          pageSize: this.pageControl.pageSize,
          doctor: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isDoctor,
          coder: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isCoder
        }
      }
    }))
    this.$claimSummary = this.store.select(getUploadClaimsSummary)

    this.$claimSummary.subscribe(result => {
      this._toggleAllClaims(false)
    })

  }


  toggleAllClaims(event: MatCheckboxChange) {
    this._toggleAllClaims(event.checked)
  }

  private _toggleAllClaims(checked: boolean) {
    if (checked) {
      this.allCheckBoxIsChecked = true;
      this.selectedClaimNumberIds = this.claimSummaryIds.slice()
    } else {
      this.allCheckBoxIsChecked = false;
      this.allCheckBoxIsIndeterminate = false;
      this.selectedClaimNumberIds = [];
    }
  }

  toggleClaim(event: MatCheckboxChange, provclaimno: string) {
    if (event.checked) {
      this.selectedClaimNumberIds.push(provclaimno);
    } else {
      this.selectedClaimNumberIds.splice(this.selectedClaimNumberIds.indexOf(provclaimno), 1);
    }

    // refersh boolean indicators for checkall checkbox in every single checkbox change event 
    if (this.selectedClaimNumberIds.length == this.pageControl.totalUploads) {
      this.allCheckBoxIsChecked = true
      this.allCheckBoxIsIndeterminate = false
    } else if (this.selectedClaimNumberIds.length > 0) {
      this.allCheckBoxIsChecked = false
      this.allCheckBoxIsIndeterminate = true
    }
  }

  handlePageEvent(event: PageEvent) {
    this.pageControl.totalUploads = event.length;
    this.pageControl.pageSize = event.pageSize;
    this.pageControl.pageNumber = event.pageIndex;
    this.refreshData();
  }

  openDoctorClaimViewDialog(provClaimNo: string) {
    const dialogRef = this.dialog.open(DoctorUploadsClaimDetailsDialogComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      data: {
        uploadId: this.uploadId,
        provClaimNo: provClaimNo
      }
    });
  }

    markAllAsDone() {
    this.store.dispatch(markAsDoneAll({
      data: {
        coder: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isCoder,
        doctor: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isDoctor,
        provClaimNo: null, uploadId: this.uploadId,
        userName: this.authService.getUserName()
      }
    }));
  }
  
    markSelectedAsDone() {
    this.store.dispatch(markAsDoneSelected({
      data: {
        uploadId: this.uploadId,
        provClaimNoList: this.selectedClaimNumberIds,
        coder: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isCoder,
        doctor: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isDoctor,
        userName: this.authService.getUserName()
      }
    }));
  }


}