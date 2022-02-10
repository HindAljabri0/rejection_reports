import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, filter, map, switchMap, withLatestFrom } from "rxjs/operators";
import { UploadsPage } from "../models/claimReviewState.model";
import { ClaimReviewService } from "../services/claim-review-service/claim-review.service";
import { loadUploadsUnderReviewOfSelectedTab, setUploadsPageErrorOfSelectedTab, setUploadsPageOfSelectedTab } from "./claimReview.actions";
import { currentSelectedTabHasContent, currentSelectedTabPageControls, selectedUploadsTab } from "./claimReview.reducer";

@Injectable({ providedIn: 'root' })
export class ClaimReviewEffects {

    constructor(private actions$: Actions, private store: Store, private claimReviewService: ClaimReviewService) { }

    onLoadingUploadsUnderReviewOfSelectedTab$ = createEffect(() => this.actions$.pipe(
        ofType(loadUploadsUnderReviewOfSelectedTab),
        withLatestFrom(this.store.select(selectedUploadsTab)),
        withLatestFrom(this.store.select(currentSelectedTabPageControls)),
        withLatestFrom(this.store.select(currentSelectedTabHasContent)),
        map(values => ({ tabName: values[0][0][1], pageControl: values[0][1], hasContent: values[1] })),
        filter(requestParams => !requestParams.hasContent),
        switchMap(requestParams => this.claimReviewService.fetchUnderReviewUploadsOfStatus(
            requestParams.tabName,
            requestParams.pageControl.pageNumber,
            requestParams.pageControl.pageSize
        ).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => setUploadsPageOfSelectedTab(UploadsPage.fromBackendResponse(response as HttpResponse<any>))),
            catchError(errorResponse => of({ type: setUploadsPageErrorOfSelectedTab.type, message: errorResponse.message }))
        )),
    ));
}