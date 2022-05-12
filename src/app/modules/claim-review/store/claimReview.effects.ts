import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, filter, map, switchMap, withLatestFrom } from "rxjs/operators";
import { AuthService } from "src/app/services/authService/authService.service";
import { SharedServices } from "src/app/services/shared.services";
import { UploadsPage } from "../models/claimReviewState.model";
import { ClaimReviewService } from "../services/claim-review-service/claim-review.service";
import { loadUploadsUnderReviewOfSelectedTab, setUploadsPageErrorOfSelectedTab, setUploadsPageOfSelectedTab } from "./claimReview.actions";
import { currentSelectedTabHasContent, currentSelectedTabPageControls, selectedUploadsTab } from "./claimReview.reducer";

@Injectable({ providedIn: 'root' })
export class ClaimReviewEffects {

    constructor(private actions$: Actions, private authService: AuthService, private store: Store, private claimReviewService: ClaimReviewService, private sharedServices: SharedServices) { }
    // this.sharedServices.loadingChanged.next(false);

    onLoadingUploadsUnderReviewOfSelectedTab$ = createEffect(() => this.actions$.pipe(
        ofType(loadUploadsUnderReviewOfSelectedTab),
        withLatestFrom(this.store.select(selectedUploadsTab)),
        withLatestFrom(this.store.select(currentSelectedTabPageControls)),
        withLatestFrom(this.store.select(currentSelectedTabHasContent)),
        map(values => (console.log('values', values), this.sharedServices.loadingChanged.next(true), { tabName: values[0][0][1], pageControl: values[0][1], hasContent: values[1] })),
        switchMap(requestParams => this.claimReviewService.fetchUnderReviewUploadsOfStatus(
            requestParams.tabName,
            requestParams.pageControl.pageNumber,
            requestParams.pageControl.pageSize,
            this.authService.getUserName()
        ).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
            map(response => {
                this.sharedServices.loadingChanged.next(false);
                return setUploadsPageOfSelectedTab(UploadsPage.fromBackendResponse(response as HttpResponse<any>))
            }),
            catchError(errorResponse => {
                this.sharedServices.loadingChanged.next(false);
                return of({ type: setUploadsPageErrorOfSelectedTab.type, message: errorResponse.message })
            })
        )),
    ));
}