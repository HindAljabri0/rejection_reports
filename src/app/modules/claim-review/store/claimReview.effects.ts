import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, filter, map, switchMap, withLatestFrom } from "rxjs/operators";
import { AuthService } from "src/app/services/authService/authService.service";
import { SharedServices } from "src/app/services/shared.services";
import { PageControls, UploadsPage } from "../models/claimReviewState.model";
import { UploadClaimSummaryList } from "../models/UploadClaimSummaryList.model";
import { ClaimReviewService } from "../services/claim-review-service/claim-review.service";
import { loadSingleClaim, loadSingleClaimErrors, loadUploadClaimsList, loadUploadsUnderReviewOfSelectedTab, markAsDone, markAsDoneAll, markAsDoneSelected, setClaimDetailsRemarks, setDiagnnosisRemarks, setLoadUploadClaimsList, setMarkAllAsDone, setMarkAsDoneReturn, setMarkSelectedAsDoneReturn, setSingleClaim, setSingleClaimErrors, setUploadsPageErrorOfSelectedTab, setUploadsPageOfSelectedTab } from "./claimReview.actions";
import { currentSelectedTabHasContent, currentSelectedTabPageControls, selectedUploadsTab } from "./claimReview.reducer";

@Injectable({ providedIn: 'root' })
export class ClaimReviewEffects {

    constructor(private actions$: Actions, private authService: AuthService, private store: Store, private claimReviewService: ClaimReviewService, private sharedServices: SharedServices) { }

    onLoadingUploadsUnderReviewOfSelectedTab$ = createEffect(() => this.actions$.pipe(
        ofType(loadUploadsUnderReviewOfSelectedTab),
        withLatestFrom(this.store.select(selectedUploadsTab)),
        withLatestFrom(this.store.select(currentSelectedTabPageControls)),
        withLatestFrom(this.store.select(currentSelectedTabHasContent)),
        map(values => (this.sharedServices.loadingChanged.next(true), { tabName: values[0][0][1], pageControl: values[0][1], hasContent: values[1] })),
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

    onLoadSingleClaim$ = createEffect(() => this.actions$.pipe(
        ofType(loadSingleClaim),
        map(data => {
            this.sharedServices.loadingChanged.next(true);
            return data
        }),
        switchMap(data => this.claimReviewService.selectSingleClaim(
            data.data.uploadId,
            data.data.provClaimNo
        ).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
            map(response => {
                this.sharedServices.loadingChanged.next(false);
                return setSingleClaim(response)
            }),
            catchError(errorResponse => {
                this.sharedServices.loadingChanged.next(false);
                return of({ type: setUploadsPageErrorOfSelectedTab.type, message: errorResponse.message })
            })
        )),
    ));

    onLoadSingleClaimErrors$ = createEffect(() => this.actions$.pipe(
        ofType(loadSingleClaimErrors),
        map(data => {
            return data
        }),
        switchMap(data => this.claimReviewService.selectSingleClaimErrors(
            data.data.uploadId,
            data.data.provClaimNo
        ).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
            map(listOfErrs => {
                return setSingleClaimErrors({ errors: listOfErrs })
            }),
            catchError(errorResponse => {
                return of({ type: setUploadsPageErrorOfSelectedTab.type, message: errorResponse.message })
            })
        )),
    ));

    onSetDiagnnosisRemarks$ = createEffect(() => this.actions$.pipe(
        ofType(setDiagnnosisRemarks),
        switchMap(data => this.claimReviewService.updateDiagnosisRemarks(data.data).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
        )),
    ), { dispatch: false });

    OnSetClaimDetailsRemarks$ = createEffect(() => this.actions$.pipe(
        ofType(setClaimDetailsRemarks),
        switchMap(data => this.claimReviewService.updateClaimDetailsRemarks(data.data).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
        )),
    ), { dispatch: false });

    onMarkClaimAsDone$ = createEffect(() => this.actions$.pipe(
        ofType(markAsDone),
        map(data => {
            this.sharedServices.loadingChanged.next(true);
            return data
        }),
        switchMap(data => this.claimReviewService.markClaimAsDone(data.data).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
            map(data => {
                this.sharedServices.loadingChanged.next(false);
                return setMarkAsDoneReturn({ data: data });
            }),
            catchError(errorResponse => {
                this.sharedServices.loadingChanged.next(false);
                return of({ type: setUploadsPageErrorOfSelectedTab.type, message: errorResponse.message })
            })
        )),
    ));

    onMarkClaimAsDoneAll$ = createEffect(() => this.actions$.pipe(
        ofType(markAsDoneAll),
        map(data => {
            this.sharedServices.loadingChanged.next(true);
            return data
        }),
        switchMap(data => this.claimReviewService.markClaimAsDoneAll(data.data).pipe(
            map(data => {
                this.sharedServices.loadingChanged.next(false);
                return setMarkAllAsDone()
            }),
            catchError(errorResponse => {
                this.sharedServices.loadingChanged.next(false);
                return of({ type: setUploadsPageErrorOfSelectedTab.type, message: errorResponse.message })
            })
        )),
    ));

    onMarkAsDoneSelected$ = createEffect(() => this.actions$.pipe(
        ofType(markAsDoneSelected),
        map(data => {
            this.sharedServices.loadingChanged.next(true);

            return data
        }),
        switchMap(data => this.claimReviewService.markClaimAsDoneSelected(data.data).pipe(
            map(noOfRows => {
                this.sharedServices.loadingChanged.next(false);
                return setMarkSelectedAsDoneReturn({ selectedClaims: data.data.provClaimNoList })
            }),
            catchError(errorResponse => {
                this.sharedServices.loadingChanged.next(false);
                return of({ type: setUploadsPageErrorOfSelectedTab.type, message: errorResponse.message })
            })
        )),
    ));

    onLoadUploadClaimsList$ = createEffect(() => this.actions$.pipe(
        ofType(loadUploadClaimsList),
        map(data => {
            this.sharedServices.loadingChanged.next(true);
            return data
        }),
        switchMap(data => this.claimReviewService.selectDetailView(data.data.uploadId, data.data.payload).pipe(
            map(response => {
                this.sharedServices.loadingChanged.next(false);
                if (response instanceof Object) {
                    let pageControl: PageControls = UploadsPage.pageControlfromBackendResponse(response)
                    let uploadClaimSummaryList: UploadClaimSummaryList = {
                        content: response["content"],
                        pageControl: pageControl
                    };
                    return setLoadUploadClaimsList({ data: { uploadClaimSummaryList: uploadClaimSummaryList } })
                }
            }),
            catchError(errorResponse => {
                this.sharedServices.loadingChanged.next(false);
                return of({ type: setUploadsPageErrorOfSelectedTab.type, message: errorResponse.message })
            })
        )),
    ));
}