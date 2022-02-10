import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter } from "jszip";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { ClaimReviewService } from "../services/claim-review-service/claim-review.service";
import { loadUploadsUnderReviewOfSelectedTab } from "./claimReview.actions";
import { currentSelectedTabPagination, selectedUploadsTab } from "./claimReview.reducer";

@Injectable({ providedIn: 'root' })
export class ClaimReviewEffects {

    constructor(private actions$: Actions, private store: Store, private claimReviewService: ClaimReviewService) { }

    onLoadingUploadsUnderReviewOfSelectedTab$ = createEffect(() => this.actions$.pipe(
        ofType(loadUploadsUnderReviewOfSelectedTab),
        withLatestFrom(this.store.select(selectedUploadsTab)),
        withLatestFrom(this.store.select(currentSelectedTabPagination)),
        map(actionAndTabNameAndPageControl => ({ tabName: actionAndTabNameAndPageControl[0][1], pageControl: actionAndTabNameAndPageControl[1] })),
        switchMap(requestParams => this.claimReviewService.fetchUnderReviewUploadsOfStatus(
            requestParams.tabName,
            requestParams.pageControl.pageNumber,
            requestParams.pageControl.pageSize
        ).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => ),

        )),
    ), { dispatch: false });
}