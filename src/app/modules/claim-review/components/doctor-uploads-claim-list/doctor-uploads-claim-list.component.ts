import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange, MatDialog, PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { AuthService } from 'src/app/services/authService/authService.service';
import { SharedServices } from 'src/app/services/shared.services';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import { initState, UserPrivileges } from 'src/app/store/mainStore.reducer';
import { PageControls } from '../../models/claimReviewState.model';
import { ClaimSummary } from '../../models/claimSummary.mocel';
import { loadSingleClaim, loadSingleClaimErrors, loadUploadClaimsList, markAsDoneAll, markAsDoneSelected } from '../../store/claimReview.actions';
import { getUploadClaimsSummary, getUploadClaimsSummaryPageControls, getNextAvailableClaimRow } from '../../store/claimReview.reducer';
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
  claimSummaryIds: { provClaimNo: string, claimReviewStatus: boolean }[] = [];
  selectedClaimNumberIds: string[] = new Array();
  userPrivileges: UserPrivileges = initState.userPrivileges;
  // singleClaimReviewStatus: boolean = true;
  isDialogOpen: boolean = false
  dialogClaimIndex = 0
  nextAvailableClaimRow: number
  // nextAvailableClaim: { provClaimNo: string, claimReviewStatus: boolean }

  allCheckBoxIsChecked: boolean;
  allCheckBoxIsIndeterminate: boolean;

  // onDialogCloseAction: string = null;

  pageControl: PageControls;
  constructor(private activatedRoute: ActivatedRoute, private sharedServices: SharedServices,
    private authService: AuthService, private dialog: MatDialog, private store: Store) {
    this.pageControl = new PageControls(0, 10);
  }

  ngOnInit() {
    this.uploadId = this.activatedRoute.snapshot.params.uploadId;
    this.refreshData();
    this.$claimSummary.subscribe(claimSummary => {
      this.claimSummaryIds = claimSummary ? [...claimSummary.map(data => { return { provClaimNo: data.provClaimNo, claimReviewStatus: data.claimReviewStatus === '1' } })] : []
      if (this.isDialogOpen) {
        this.isDialogOpen = false;
        console.log('claimSummaryIds', this.claimSummaryIds);
        console.log('this.dialogClaimIndex', this.dialogClaimIndex);
        this.openDoctorClaimViewDialog(this.claimSummaryIds[this.dialogClaimIndex].provClaimNo, this.dialogClaimIndex, this.claimSummaryIds[this.dialogClaimIndex].claimReviewStatus);
        // this.store.dispatch(findNextUnresolvedClaim({currentProvClaimNo: this.claimSummaryIds[this.dialogClaimIndex].provClaimNo}))
      }
    })
    this.store.select(getUploadClaimsSummaryPageControls).subscribe(pageControl => {
      this.pageControl = { ...pageControl }
    })
  }

  findNextAvailableClaim(index: number) {
    this.claimSummaryIds[index]
    for (let i: number = index + 1; i < this.claimSummaryIds.length; i = i + 1) {
      if (!this.claimSummaryIds[i].claimReviewStatus) {
        this.dialogClaimIndex = i
        // this.nextAvailableClaim = this.claimSummaryIds[i]
        return;
      }
    }
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
      this.selectedClaimNumberIds = this.claimSummaryIds.map(claimSummary => { return claimSummary.provClaimNo })
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
    console.log('this.pageControl', this.pageControl);
    this.refreshData();
  }

  openDoctorClaimViewDialog(provClaimNo: string, index: number, claimReviewStatus: boolean) {
    this.findNextAvailableClaim(index)
    this.dialogClaimIndex = index
    this.dispatchActions(this.uploadId, provClaimNo)
    const dialogRef = this.dialog.open(DoctorUploadsClaimDetailsDialogComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      data: {
        uploadId: this.uploadId,
        provClaimNo: provClaimNo,
        pageControl: this.pageControl,
        index: this.dialogClaimIndex,
        markAsDone: claimReviewStatus
      }
    }).afterClosed()
      .subscribe(action => {
        this.onCloseDialog(action, this.dialogClaimIndex);
      });;
  }

  onCloseDialog(action: any, index: number) {
    switch (action) {
      case 'next': {
        if ((index + 1) % this.pageControl.pageSize == 0) {
          this.handlePageEvent({
            length: this.pageControl.totalUploads,
            pageIndex: this.pageControl.pageNumber + 1,
            pageSize: this.pageControl.pageSize,
          })
          this.dialogClaimIndex = 0
          this.isDialogOpen = true;
          break;
        }
        this.openDoctorClaimViewDialog(this.claimSummaryIds[index + 1].provClaimNo, index + 1, this.claimSummaryIds[index + 1].claimReviewStatus)
        break;
      }
      case 'prev': {
        if (index == 0) {
          this.handlePageEvent({
            length: this.pageControl.totalUploads,
            pageIndex: this.pageControl.pageNumber - 1,
            pageSize: this.pageControl.pageSize
          })
          this.dialogClaimIndex = this.pageControl.pageSize - 1
          this.isDialogOpen = true;
          break;
        }
        this.openDoctorClaimViewDialog(this.claimSummaryIds[index - 1].provClaimNo, index - 1, this.claimSummaryIds[index - 1].claimReviewStatus)
        break;
      }
      case 'first': {
        this.handlePageEvent({
          length: this.pageControl.totalUploads,
          pageIndex: 0,
          pageSize: this.pageControl.pageSize
        })
        this.dialogClaimIndex = 0
        this.isDialogOpen = true;

        break;
      }
      case 'last': {
        this.handlePageEvent({
          length: this.pageControl.totalUploads,
          pageIndex: this.pageControl.totalPages - 1,
          pageSize: this.pageControl.pageSize,
        })
        this.dialogClaimIndex = (this.pageControl.totalUploads % this.pageControl.pageSize) - 1
        this.isDialogOpen = true;
        break;
      }
      case 'mark-as-done': {
        this.store.select(getNextAvailableClaimRow).subscribe(nextAvailableClaimRow => {
          if (nextAvailableClaimRow) {
            if (nextAvailableClaimRow > this.pageControl.pageSize * (this.pageControl.pageNumber + 1)) {
              this.handlePageEvent({
                length: this.pageControl.totalUploads,
                pageIndex: Math.floor(nextAvailableClaimRow / this.pageControl.pageSize),
                pageSize: this.pageControl.pageSize
              })
              this.isDialogOpen = true;
              this.dialogClaimIndex = (nextAvailableClaimRow % this.pageControl.pageSize) - 1
            } else {
              this.isDialogOpen = false;
              this.findNextAvailableClaim(index);
              this.openDoctorClaimViewDialog(this.claimSummaryIds[this.dialogClaimIndex].provClaimNo, this.dialogClaimIndex, this.claimSummaryIds[this.dialogClaimIndex].claimReviewStatus)
            }
          } else {
            // show no more claims available
          }
        });
        break;

      }
      default: {
        this.isDialogOpen = false
      }
    }
  }



  dispatchActions(uploadId: number, provClaimNo: string) {
    this.store.dispatch(loadSingleClaim({ data: { uploadId: uploadId, provClaimNo: provClaimNo } }))
    this.store.dispatch(loadSingleClaimErrors({ data: { uploadId: uploadId, provClaimNo: provClaimNo } }))
  }

  markAllAsDone() {
    const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, {
      panelClass: ['primary-dialog'],
      disableClose: true,
      autoFocus: false,
      data: {
        mainMessage: 'Are you sure you want to Mark All Claim(s) as Done?',
        mode: 'warning'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(markAsDoneAll({
          data: {
            coder: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isCoder,
            doctor: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isDoctor,
            provClaimNo: null, uploadId: this.uploadId,
            userName: this.authService.getUserName()
          }
        }));
        return this.store.dispatch(showSnackBarMessage({ message: 'Claim(s) Marked as Done Successfully!' }));
      }
    }, error => { });
  }

  markSelectedAsDone() {
    if (this.selectedClaimNumberIds.length == 0) {
      return this.store.dispatch(showSnackBarMessage({ message: 'Please select at least one Claim!' }));
    }
    this.store.dispatch(markAsDoneSelected({
      data: {
        uploadId: this.uploadId,
        provClaimNoList: this.selectedClaimNumberIds,
        coder: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isCoder,
        doctor: this.sharedServices.userPrivileges.WaseelPrivileges.RCM.isDoctor,
        userName: this.authService.getUserName()
      }
    }));
    return this.store.dispatch(showSnackBarMessage({ message: 'Claim(s) Marked as Done Successfully!' }));
  }



}