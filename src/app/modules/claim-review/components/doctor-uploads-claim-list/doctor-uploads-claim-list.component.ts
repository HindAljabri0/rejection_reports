import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { time } from 'console';
import { PageControls } from '../../models/claimReviewState.model';
import { claimScrubbing } from '../../models/ClaimScrubbing.model';
import { ClaimReviewService } from '../../services/claim-review-service/claim-review.service';

@Component({
  selector: 'app-doctor-uploads-claim-list',
  templateUrl: './doctor-uploads-claim-list.component.html',
  styles: []
})
export class DoctorUploadsClaimListComponent implements OnInit {

  public id : number;
  public claimData : claimScrubbing[]; 
  pageControl: PageControls;
  constructor(private router : ActivatedRoute,private claimReviewService : ClaimReviewService) { 
    this.pageControl = new PageControls(0,5);
  }
  ngOnInit() {
    this.id = this.router.snapshot.params.id;
    this.pageControl.pageSize = 5;
    this.pageControl.pageNumber = 0;
    this.refreshData();
  }

  refreshData(){
    this.claimReviewService.selectDetailView(this.id,this.pageControl.pageNumber,this.pageControl.pageSize).subscribe(response => {
      if (response instanceof Object) {
        let body : any = response["content"];
        this.claimData = body as claimScrubbing[];
        this.pageControl.totalPages = response["totalPages"];
      }
    });
  }

  goToFirstPage() {
    if (this.pageControl.pageNumber != 0) {
      this.pageControl.pageNumber = 0;
    }
    this.refreshData()
  }
  goToPrePage() {
    if (this.pageControl.pageNumber != 0) {
      this.pageControl.pageNumber = this.pageControl.pageNumber - 1;
    }
    this.refreshData();
  }
  goToNextPage() {
    if ((this.pageControl.pageNumber + 1) < this.pageControl.totalPages) {
      this.pageControl.pageNumber = this.pageControl.pageNumber + 1;
    }
    this.refreshData();
  }
  goToLastPage() {
    if (this.pageControl.pageNumber != (this.pageControl.totalPages - 1)) {
      this.pageControl.pageNumber = this.pageControl.totalPages - 1;
    }
    this.refreshData();
  }

}
