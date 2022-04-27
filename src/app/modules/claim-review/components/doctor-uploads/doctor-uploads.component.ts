import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageControls, UploadsPage } from '../../models/claimReviewState.model';
import { loadUploadsUnderReviewOfSelectedTab, uploadsReviewTabAction } from '../../store/claimReview.actions';
import { newClaimsUnderReviewPage, inProgressClaimsUnderReviewPage, completedClaimsUnderReviewPage } from '../../store/claimReview.reducer';

@Component({
  selector: 'app-doctor-uploads',
  templateUrl: './doctor-uploads.component.html',
  styles: []
})
export class DoctorUploadsComponent implements OnInit {

  constructor(private store: Store) { }

  private pageControl: PageControls;

  newUploads$: Observable<UploadsPage>;
  inProgressUploads$: Observable<UploadsPage>;
  completedUploads$: Observable<UploadsPage>;

  ngOnInit() {
    this.newUploads$ = this.store.select(newClaimsUnderReviewPage);
    this.inProgressUploads$ = this.store.select(inProgressClaimsUnderReviewPage);
    this.completedUploads$ = this.store.select(completedClaimsUnderReviewPage);
    this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
    this.fillPageControls();
  }

  fillPageControls() {
    this.newUploads$.subscribe((upload) => {
      console.log('upload', upload);
      this.pageControl = upload.pageControls
    })
  }

  goToFirstPage() {
    console.log("goToFirstPage");
    if (this.pageControl.pageNumber != 0) {
      this.pageControl.pageNumber = 0;
      this.getScrubbingClaims();
    }
  }
  goToPrePage() {
    console.log("goToPrePage");
    if (this.pageControl.pageNumber != 0) {
      this.pageControl.pageNumber = this.pageControl.pageNumber - 1;
      this.getScrubbingClaims();
    }
  }
  goToNextPage() {
    console.log("goToNextPage");
    if ((this.pageControl.pageNumber + 1) < this.pageControl.totalPages) {
      this.pageControl.pageNumber = this.pageControl.pageNumber + 1;
      this.getScrubbingClaims();
    }
  }
  goToLastPage() {
    console.log("goToLastPage");
    if (this.pageControl.pageNumber != (this.pageControl.totalPages - 1)) {
      this.pageControl.pageNumber = this.pageControl.totalPages - 1;
      this.getScrubbingClaims();

    }
  }

  getScrubbingClaims(){
    this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());

  } 

}
