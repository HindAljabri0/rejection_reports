import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { UploadsPage } from '../../models/claimReviewState.model';
import { loadUploadsUnderReviewOfSelectedTab, uploadsReviewPageAction } from '../../store/claimReview.actions';

@Component({
    selector: 'app-uploads-assigning-tab-content',
    templateUrl: './uploads-assigning-tab-content.component.html'
})
export class UploadsAssigningTabContentComponent implements OnInit {

    @Input()
    page: UploadsPage;

    @Input()
    tabName:  "new" | "in-progress" | "completed";

    constructor(private store: Store) { }

    ngOnInit() {
    }

    dispatchPageEvent(event: PageEvent) {
        this.store.dispatch(uploadsReviewPageAction(event));
        this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
    }

}
