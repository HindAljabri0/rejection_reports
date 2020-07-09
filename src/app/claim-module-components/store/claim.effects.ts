import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { loadLOVs, setLOVs, setError, startCreatingNewClaim, setLoading, startValidatingClaim, getUploadId, setUploadId, viewThisMonthClaims } from './claim.actions';
import { switchMap, map, catchError, filter, tap, withLatestFrom } from 'rxjs/operators';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { of } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ClaimValidationService } from '../services/claimValidationService/claim-validation.service';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { Store } from '@ngrx/store';
import { getClaim } from './claim.reducer';
import { SharedServices } from 'src/app/services/shared.services';


@Injectable({
    providedIn: 'root'
})
export class ClaimEffects {

    constructor(private actions$: Actions, private store: Store, private adminService: AdminService, private validationService: ClaimValidationService, private claimService: ClaimService, private sharedServices: SharedServices) { }

    loadLOVs$ = createEffect(() => this.actions$.pipe(
        ofType(loadLOVs),
        switchMap(() => this.adminService.getLOVsForClaimCreation().pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => setLOVs({ LOVs: response })),
            catchError(err => of({ type: setError.type, error: { code: 'LOV_ERROR' } }))
        ))
    ));

    startValidatingClaim$ = createEffect(() => this.actions$.pipe(
        ofType(startValidatingClaim),
        tap(() => this.validationService.startValidation()),
        map(() => setLoading({ loading: false }))
    ));

    getUploadId$ = createEffect(() => this.actions$.pipe(
        ofType(getUploadId),
        switchMap(value => this.claimService.getUploadIdForManuallyCreatedClaims(value.providerId).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => setUploadId({ id: response })),
            catchError(err => of({ type: setError.type, error: { code: 'UPLOAD_ID_ERROR' } }))
        ))
    ));

    saveClaim$ = createEffect(() => this.actions$.pipe(
        ofType(setUploadId),
        withLatestFrom(this.store.select(getClaim)),
        switchMap(value => this.claimService.saveManuallyCreatedClaim(value[1], this.sharedServices.providerId).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => {
                this.store.dispatch(setLoading({loading:false}));
                return viewThisMonthClaims({uploadId: value[1].claimIdentities.uploadID});
            }),
            catchError(err => {
                this.store.dispatch(setLoading({loading:false}));
                return of({ type: setError.type, error: { code: 'CLAIM_SAVING_ERROR' } })
            })
        ))
    ));

}