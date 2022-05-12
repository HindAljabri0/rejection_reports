import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService/authService.service';
import { SharedServices } from 'src/app/services/shared.services';
import { initState, UserPrivileges } from 'src/app/store/mainStore.reducer';
import { PageControls } from '../../models/claimReviewState.model';
import { ClaimSummary } from '../../models/claimSummary.mocel';
import { ClaimReviewService } from '../../services/claim-review-service/claim-review.service';


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
  constructor(private activatedRoute: ActivatedRoute, private route: Router, private claimReviewService: ClaimReviewService, private sharedServices: SharedServices, private authService: AuthService) {
    this.pageControl = new PageControls(0, 5);
  }

  ngOnInit() {
    this.uploadId = this.activatedRoute.snapshot.params.uploadId;
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

  viewSingleClaim(claim: ClaimSummary) {
    this.route.navigate([`/claim/${claim.provClaimNo}`], {relativeTo: this.activatedRoute});
  }

}

