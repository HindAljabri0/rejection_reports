import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { loadLOVs, setLOVs, setError, startCreatingNewClaim, setLoading, startValidatingClaim } from './claim.actions';
import { switchMap, map, catchError, filter, tap } from 'rxjs/operators';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { of } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ClaimValidationService } from '../services/claimValidationService/claim-validation.service';


@Injectable({
    providedIn: 'root'
})
export class ClaimEffects {

    constructor(private actions$: Actions, private adminService:AdminService, private validationService:ClaimValidationService){}

    loadLOVs$ = createEffect(() => this.actions$.pipe(
        ofType(loadLOVs),
        switchMap(() => this.adminService.getLOVsForClaimCreation().pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => setLOVs({LOVs:response})),
            catchError(err => of({type: setError.type, error: {code: 'LOV_ERROR'}}))
        ))
    ));

    startValidatingClaim$ = createEffect(() => this.actions$.pipe(
        ofType(startValidatingClaim),
        tap(() => this.validationService.startValidation()),
        map(() => setLoading({loading:false}))
    ));

}