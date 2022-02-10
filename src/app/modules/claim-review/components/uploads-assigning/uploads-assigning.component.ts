import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UploadsPage } from '../../models/claimReviewState.model';
import { loadUploadsUnderReviewOfSelectedTab, uploadsReviewTabAction } from '../../store/claimReview.actions';
import { completedClaimsUnderReviewPage, inProgressClaimsUnderReviewPage, newClaimsUnderReviewPage } from '../../store/claimReview.reducer';

@Component({
    selector: 'app-uploads-assigning',
    templateUrl: './uploads-assigning.component.html',
    styles: []
})
export class UploadsAssigningComponent implements OnInit {

    newUploads$: Observable<UploadsPage>;
    inProgressUploads$: Observable<UploadsPage>;
    completedUploads$: Observable<UploadsPage>;

    constructor(private store: Store) { }

    ngOnInit() {
        this.newUploads$ = this.store.select(newClaimsUnderReviewPage);
        this.inProgressUploads$ = this.store.select(inProgressClaimsUnderReviewPage);
        this.completedUploads$ = this.store.select(completedClaimsUnderReviewPage);
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
    }

    dispatchTabChangeEvent(event: MatTabChangeEvent) {
        this.store.dispatch(uploadsReviewTabAction({ index: event.index }));
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
    }

}
