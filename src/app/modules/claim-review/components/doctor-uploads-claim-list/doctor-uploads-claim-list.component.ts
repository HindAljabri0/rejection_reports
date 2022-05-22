import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange, MatDialog, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/authService/authService.service';
import { SharedServices } from 'src/app/services/shared.services';
import { initState, UserPrivileges } from 'src/app/store/mainStore.reducer';
// import { ActivatedRoute } from '@angular/router';
import { PageControls } from '../../models/claimReviewState.model';
import { ClaimSummary } from '../../models/claimSummary.mocel';
import { ClaimReviewService } from '../../services/claim-review-service/claim-review.service';
import { loadSingleClaim, loadSingleClaimErrors, markAsDoneAll, markAsDoneSelected } from '../../store/claimReview.actions';
// import { loadSingleClaim } from "../claim-review/store/claimReview.actions";
// import * as actions from '../../store/claimReview.actions';

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
  public claimSummary: ClaimSummary[];
  public visitedPages: number[] = [];
  selectedClaimNumberIds: string[] = new Array();
  userPrivileges: UserPrivileges = initState.userPrivileges;

  allCheckBoxIsChecked: boolean;
  private allCheckBoxIsCheckedForPagination: boolean;
  allCheckBoxIsIndeterminate: boolean;

  pageControl: PageControls;
  constructor(private activatedRoute: ActivatedRoute, private route: Router, private claimReviewService: ClaimReviewService, private sharedServices: SharedServices, private authService: AuthService, private dialog: MatDialog, private store: Store) {
    this.pageControl = new PageControls(0, 5);
  }

  ngOnInit() {
    this.uploadId = this.activatedRoute.snapshot.params.uploadId;
    console.log('this.uploadId in doctor upload claim list component', this.uploadId );
    this.pageControl.pageSize = 10;
    this.pageControl.pageNumber = 0;
    this.refreshData();

  }

  refreshData() {
    this.sharedServices.loadingChanged.next(true);

    this.claimReviewService.selectDetailView(this.uploadId, this.pageControl.pageNumber, this.pageControl.pageSize, this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isDoctor, this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isCoder).subscribe(response => {
      if (response instanceof Object) {
        this.claimSummary = response["content"] as ClaimSummary[];
        this.pageControl.totalPages = response["totalPages"];
        this.pageControl.totalUploads = response["totalElements"];
        if (this.allCheckBoxIsCheckedForPagination && !this.visitedPages.includes(this.pageControl.pageNumber)) {
          this.checkAllClaims(this.claimSummary);
          this.visitedPages.push(this.pageControl.pageNumber);
        }
        this.sharedServices.loadingChanged.next(false);
      }
    });
  }

  toggleAllClaims(event: MatCheckboxChange) {
    if (event.checked) {
      this.allCheckBoxIsChecked = true;
      this.allCheckBoxIsCheckedForPagination = true;
      this.checkAllClaims(this.claimSummary);
    } else {
      this.allCheckBoxIsChecked = false;
      this.allCheckBoxIsCheckedForPagination = false;
      this.selectedClaimNumberIds.length = 0;
    }
  }

  checkAllClaims(claimData: ClaimSummary[]) {
    this.selectedClaimNumberIds = [...this.selectedClaimNumberIds, ...claimData.map(data => data.provClaimNo)]
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
    this.store.dispatch(loadSingleClaim({data: {uploadId: this.uploadId, provClaimNo: provClaimNo}}))
    this.store.dispatch(loadSingleClaimErrors({data: {uploadId: this.uploadId, provClaimNo: provClaimNo}}))
    const dialogRef = this.dialog.open(DoctorUploadsClaimDetailsDialogComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      data: {
        uploadId: this.uploadId,
        provClaimNo: provClaimNo
      }
    });
  }

  saveMarkAsDone() {
    if(this.allCheckBoxIsChecked && this.allCheckBoxIsCheckedForPagination)
    {
      this.store.dispatch(markAsDoneAll({
        data: {
          coder: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isCoder,
          doctor: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isDoctor,
          provClaimNo: null, uploadId: this.uploadId,
          userName: this.authService.getUserName()
        }
      }));
    }else{
      console.log(this.selectedClaimNumberIds);
      this.store.dispatch(markAsDoneSelected({
        data: {
          uploadId: this.uploadId,
          provClaimNo: this.selectedClaimNumberIds
        }
      }));
    }
  }

}