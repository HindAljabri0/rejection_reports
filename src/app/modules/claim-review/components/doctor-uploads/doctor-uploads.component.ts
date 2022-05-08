import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setupMaster } from 'cluster';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageControls, UploadsPage } from '../../models/claimReviewState.model';
import { Upload } from '../../models/upload.model';
import { loadUploadsUnderReviewOfSelectedTab, setUploadsPageOfSelectedTab, uploadsReviewTabAction } from '../../store/claimReview.actions';
import { newClaimsUnderReviewPage, inProgressClaimsUnderReviewPage, completedClaimsUnderReviewPage } from '../../store/claimReview.reducer';

@Component({
  selector: 'app-doctor-uploads',
  templateUrl: './doctor-uploads.component.html',
  styles: []
})
export class DoctorUploadsComponent implements OnInit {

  constructor(private store: Store, private router : Router) { }

  pageControl: PageControls;
  isDoctor : boolean;
  isCoder : boolean;

  newUploads$: Observable<UploadsPage>;
  inProgressUploads$: Observable<UploadsPage>;
  completedUploads$: Observable<UploadsPage>;

  ngOnInit() {
    this.newUploads$ = this.store.select(newClaimsUnderReviewPage);
    this.inProgressUploads$ = this.store.select(inProgressClaimsUnderReviewPage);
    this.completedUploads$ = this.store.select(completedClaimsUnderReviewPage);
    this.getScrubbingClaims();
    this.fillPageControls('New');
    this.isDoctor = localStorage.getItem('101101').includes('|24.41') || localStorage.getItem('101101').startsWith('24.41');
    this.isCoder = localStorage.getItem('101101').includes('|24.42') || localStorage.getItem('101101').startsWith('24.42');
  }

  fillPageControls(name : string) {
    if (name == "New"){
      this.newUploads$.subscribe((upload) => {
        this.pageControl = upload.pageControls
      })
    }else if(name == "In Progress"){
      this.inProgressUploads$.subscribe((upload) => {
        this.pageControl = upload.pageControls
      })
    }else{
      this.completedUploads$.subscribe((upload) => {
        this.pageControl = upload.pageControls
      })
    }
  }

  goToFirstPage() {
    if (this.pageControl.pageNumber != 0) {
      this.pageControl.pageNumber = 0;
      this.getScrubbingClaims();
    }
  }
  goToPrePage() {
    if (this.pageControl.pageNumber != 0) {
      this.pageControl.pageNumber = this.pageControl.pageNumber - 1;
      this.getScrubbingClaims();
    }
  }
  goToNextPage() {
    if ((this.pageControl.pageNumber + 1) < this.pageControl.totalPages) {
      this.pageControl.pageNumber = this.pageControl.pageNumber + 1;
      this.getScrubbingClaims();
    }
  }
  goToLastPage() {
    if (this.pageControl.pageNumber != (this.pageControl.totalPages - 1)) {
      this.pageControl.pageNumber = this.pageControl.totalPages - 1;
      this.getScrubbingClaims();
    }
  }

  getScrubbingClaims(){
    this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
  }

  dispatchTabChangeEvent(event: MatTabChangeEvent) {
    this.store.dispatch(uploadsReviewTabAction({ index: event.index }));
    this.fillPageControls(event.tab.textLabel);
    this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
  }

  selectDetailView(upload : Upload){                      
    this.router.navigate(["/review/doctor/claims/" + upload.id]);
  }
}
