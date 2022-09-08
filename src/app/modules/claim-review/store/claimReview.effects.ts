import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { BehaviorSubject, of } from "rxjs";
import { catchError, filter, map, switchMap, withLatestFrom } from "rxjs/operators";
import { AuthService } from "src/app/services/authService/authService.service";
import { SharedServices } from "src/app/services/shared.services";
import { showSnackBarMessage } from "src/app/store/mainStore.actions";
import { PageControls, UploadsPage } from "../models/claimReviewState.model";
import { UploadClaimSummaryList } from "../models/UploadClaimSummaryList.model";
import { ClaimReviewService } from "../services/claim-review-service/claim-review.service";
import { deleteUpload, downloadExcel, loadCoderList, loadDoctorList, loadProviderList, loadSingleClaim, loadSingleClaimErrors, loadUploadClaimsList, loadUploadsUnderReviewOfSelectedTab, markAsDone, markAsDoneAll, markAsDoneSelected, setClaimDetailsRemarks, setCoderListReturn, setDiagnnosisRemarks, setDiagnosisRemarksReturn, setDoctorListReturn, setLoadUploadClaimsList, setMarkAllAsDone, setMarkAsDoneReturn, setMarkSelectedAsDoneReturn, setProviderList, setSingleClaim, setSingleClaimErrors, setUploadsPageErrorOfSelectedTab, setUploadsPageOfSelectedTab, updateAssignment } from "./claimReview.actions";
import { currentSelectedTabHasContent, currentSelectedTabPageControls, getCoderId, getDoctorId, getProviderId, selectedUploadsTab } from "./claimReview.reducer";

@Injectable({ providedIn: 'root' })
export class ClaimReviewEffects {

    constructor(private actions$: Actions, private authService: AuthService, private store: Store, private claimReviewService: ClaimReviewService, private sharedServices: SharedServices) { }

    onLoadingUploadsUnderReviewOfSelectedTab$ = createEffect(() => this.actions$.pipe(
        ofType(loadUploadsUnderReviewOfSelectedTab),
        withLatestFrom(this.store.select(getProviderId)),
        withLatestFrom(this.store.select(getDoctorId)),
        withLatestFrom(this.store.select(getCoderId)),
        withLatestFrom(this.store.select(selectedUploadsTab)),
        withLatestFrom(this.store.select(currentSelectedTabPageControls)),
        withLatestFrom(this.store.select(currentSelectedTabHasContent)),
        map(values => (this.sharedServices.loadingChanged.next(true), { providerId: values[0][0][0][0][0][1], doctorId: values[0][0][0][0][1], coderId: values[0][0][0][1], tabName: values[0][0][1], pageControl: values[0][1], hasContent: values[1] })),
        switchMap(requestParams => this.claimReviewService.fetchUnderReviewUploadsOfStatus(
            requestParams.tabName,
            requestParams.pageControl.pageNumber,
            requestParams.pageControl.pageSize,
            this.authService.getAuthUsername(),
            requestParams.doctorId,
            requestParams.coderId,
            requestParams.providerId
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

        switchMap(data => {
            this.sharedServices.loadingChanged.next(true);
            return this.claimReviewService.updateDiagnosisRemarks(data.data).pipe(
                filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
                map(response => {
                    this.sharedServices.loadingChanged.next(false);
                    return setDiagnosisRemarksReturn({ data: data.data });
                }),
                catchError(errorResponse => {
                    this.sharedServices.loadingChanged.next(false);
                    return of({ type: setUploadsPageErrorOfSelectedTab.type, message: errorResponse.message })
                })
            )
        }),
    ));

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
                console.log('data: ', data);
                this.sharedServices.loadingChanged.next(false);
                this.store.dispatch(showSnackBarMessage({ message: 'Claim Marked as Done Successfully!' }));
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

    onDeleteUpload$ = createEffect(() => this.actions$.pipe(
        ofType(deleteUpload),
        map(data => {
            this.sharedServices.loadingChanged.next(true);
            return data
        }),
        switchMap(data => this.claimReviewService.deleteUpload(data.upload).pipe(
            map(data => {
                console.log(data);
                this.store.dispatch(showSnackBarMessage({ message: 'Upload Deleted Successfully!' }));
                this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
                this.sharedServices.loadingChanged.next(false);
            })
        )),
    ), { dispatch: false });

    onLoadingDoctorList$ = createEffect(() => this.actions$.pipe(
        ofType(loadDoctorList),
        switchMap(() => this.claimReviewService.getDoctorList().pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
            map(response => {
                this.sharedServices.loadingChanged.next(false);
                return setDoctorListReturn({ list: response });
            })
        )),
    ));

    onLoadingCoderList$ = createEffect(() => this.actions$.pipe(
        ofType(loadCoderList),
        switchMap(() => this.claimReviewService.getCoderList().pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
            map(response => {
                this.sharedServices.loadingChanged.next(false);
                return setCoderListReturn({ list: response });
            })
        )),
    ));

    onLoadProviderList$ = createEffect(() => this.actions$.pipe(
        ofType(loadProviderList),
        switchMap(() => this.claimReviewService.getAvailableProviderIds().pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
            map(response => {
                return response;
            }), switchMap(data => this.claimReviewService.getAvailableProviderList(data).pipe(
                filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
                map(response => {
                    return setProviderList({ list: response });
                })
            ))
        )),
    ));

    onUpdateAssignment$ = createEffect(() => this.actions$.pipe(
        ofType(updateAssignment),
        switchMap(data => this.claimReviewService.updateAssignment(data.data.uploadId, data.data.userNme, data.data.doctor, data.data.coder).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse || response instanceof Object),
            map(response => {
                this.sharedServices.loadingChanged.next(false);
                this.store.dispatch(showSnackBarMessage({ message: "User Assigned Successfully!" }));
                this.store.dispatch(loadUploadsUnderReviewOfSelectedTab());
            }),
            catchError(errorResponse => {
                this.sharedServices.loadingChanged.next(false);
                this.store.dispatch(showSnackBarMessage({ message: errorResponse.error }))
                return of({ type: setUploadsPageErrorOfSelectedTab.type, message: errorResponse.message })
            })
        )),
    ), { dispatch: false });

    onDownloadExcel$ = createEffect(() => this.actions$.pipe(
        ofType(downloadExcel),
        map(data => {
            this.sharedServices.loadingChanged.next(true);
            return data
        }),
        switchMap(data => this.claimReviewService.downloadExcel(data.uploadId).pipe(
            map(data => {
                console.log(data);
                this.store.dispatch(showSnackBarMessage({ message: 'Excel Downloaded Successfully!' }));
                this.sharedServices.loadingChanged.next(false);
            })
        )),
    ), { dispatch: false });
}