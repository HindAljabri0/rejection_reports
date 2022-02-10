import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent, PageEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PageControls } from '../../models/claimReviewState.model';
import { Upload } from '../../models/upload.model';
import { loadUploadsUnderReviewOfSelectedTab, uploadsReviewPageAction, uploadsReviewTabAction } from '../../store/claimReview.actions';
import { completedClaimsUnderReviewPage, currentSelectedTabPagination, inProgressClaimsUnderReviewPage, newClaimsUnderReviewPage } from '../../store/claimReview.reducer';

@Component({
    selector: 'app-uploads-assigning',
    templateUrl: './uploads-assigning.component.html',
    styles: []
})
export class UploadsAssigningComponent implements OnInit {

    newUploads$: Observable<Upload[]>;
    inProgressUploads$: Observable<Upload[]>;
    completedUploads$: Observable<Upload[]>;

    pageControls: PageControls;

    constructor(private store: Store) { }

    ngOnInit() {
        this.newUploads$ = this.store.select(newClaimsUnderReviewPage);
        this.inProgressUploads$ = this.store.select(inProgressClaimsUnderReviewPage);
        this.completedUploads$ = this.store.select(completedClaimsUnderReviewPage);
        this.store.select(currentSelectedTabPagination).subscribe(controls => this.pageControls = controls);
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
    }

    dispatchPageEvent(event: PageEvent) {
        this.store.dispatch(uploadsReviewPageAction(event))
    }

    dispatchTabChangeEvent(event: MatTabChangeEvent) {
        this.store.dispatch(uploadsReviewTabAction({ index: event.index }));
    }

}
