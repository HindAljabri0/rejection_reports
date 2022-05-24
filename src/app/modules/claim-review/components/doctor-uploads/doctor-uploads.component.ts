import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UploadsPage } from '../../models/claimReviewState.model';
import { Upload } from '../../models/upload.model';
import { loadUploadsUnderReviewOfSelectedTab, uploadsReviewPageAction, uploadsReviewTabAction } from '../../store/claimReview.actions';
import { completedClaimsUnderReviewPage, inProgressClaimsUnderReviewPage, newClaimsUnderReviewPage } from '../../store/claimReview.reducer';

@Component({
  selector: 'app-doctor-uploads',
  templateUrl: './doctor-uploads.component.html',
  styles: []
})
export class DoctorUploadsComponent implements OnInit {

  constructor(private store: Store, private router: Router, private activatedRoute: ActivatedRoute) { }

  isDoctor: boolean;
  isCoder: boolean;

  newUploads$: Observable<UploadsPage>;
  inProgressUploads$: Observable<UploadsPage>;
  completedUploads$: Observable<UploadsPage>;

  pageSizeOptions = [10, 20, 50, 100];

  ngOnInit() {
    this.newUploads$ = this.store.select(newClaimsUnderReviewPage);
    this.inProgressUploads$ = this.store.select(inProgressClaimsUnderReviewPage);
    this.completedUploads$ = this.store.select(completedClaimsUnderReviewPage);
    this.getScrubbingClaims();
    this.isDoctor = localStorage.getItem('101101').includes('|24.41') || localStorage.getItem('101101').startsWith('24.41');
    this.isCoder = localStorage.getItem('101101').includes('|24.42') || localStorage.getItem('101101').startsWith('24.42');
  }

  getScrubbingClaims() {
    this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
  }

  dispatchTabChangeEvent(event: MatTabChangeEvent) {
    this.store.dispatch(uploadsReviewTabAction({ index: event.index }));
    this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
  }

  viewUploadClaims(upload: Upload) {
    this.router.navigate([upload.id, "claim"], {relativeTo: this.activatedRoute});
  }

  handlePageEvent(event: PageEvent) {
    this.store.dispatch(uploadsReviewPageAction(event));
    this.getScrubbingClaims();
  }
}
