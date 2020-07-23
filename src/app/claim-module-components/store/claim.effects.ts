import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { loadLOVs, setLOVs, setError, startCreatingNewClaim, setLoading, startValidatingClaim, getUploadId, setUploadId, viewThisMonthClaims, saveClaim, cancelClaim, openCreateByApprovalDialog, getClaimDataByApproval, openSelectServiceDialog } from './claim.actions';
import { switchMap, map, catchError, filter, tap, withLatestFrom } from 'rxjs/operators';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { of } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ClaimValidationService } from '../services/claimValidationService/claim-validation.service';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { Store } from '@ngrx/store';
import { getClaim } from './claim.reducer';
import { SharedServices } from 'src/app/services/shared.services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CreateByApprovalFormComponent } from '../dialogs/create-by-approval-form/create-by-approval-form.component';
import { ApprovalInquiryService } from '../services/approvalInquiryService/approval-inquiry.service';
import { Claim } from '../models/claim.model';
import { Service } from '../models/service.model';
import { SelectServiceDialogComponent } from '../dialogs/select-service-dialog/select-service-dialog.component';


@Injectable({
    providedIn: 'root'
})
export class ClaimEffects {

    constructor(
        private actions$: Actions,
        private store: Store,
        private adminService: AdminService,
        private approvalInquireService: ApprovalInquiryService,
        private validationService: ClaimValidationService,
        private claimService: ClaimService,
        private sharedServices: SharedServices,
        private router: Router,
        private dialog: MatDialog
    ) { }

    openApprovalFormDialog$ = createEffect(() => this.actions$.pipe(
        ofType(openCreateByApprovalDialog),
        tap(data => this.dialog.open(CreateByApprovalFormComponent, {
            data: data,
            closeOnNavigation: true,
            height: '200px',
            width: '600px',
        }))
    ), { dispatch: false });

    getClaimDataFromApproval$ = createEffect(() => this.actions$.pipe(
        ofType(getClaimDataByApproval),
        switchMap(data => this.approvalInquireService.getClaimDataByApprovalNumber(this.sharedServices.providerId, data.payerId, data.approvalNumber, data.claimType).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => {
                this.dialog.closeAll();
                return startCreatingNewClaim({ data: { claim: Claim.fromApprovalResponse(data.claimType, data.providerClaimNumber, data.payerId, data.approvalNumber, response), services: Service.fromResponse(response) } });
            }),
            catchError(err => {
                this.dialog.closeAll();
                if (err.hasOwnProperty('status') && (err.status == 0 || err.status >= 500)) {
                    return of({ type: setError.type, error: { code: `APPROVAL_ERROR_SERVER`, } });
                }
                return of({ type: setError.type, error: { code: `APPROVAL_ERROR_${data.claimType}`, } });
            })
        ))
    ));

    loadLOVs$ = createEffect(() => this.actions$.pipe(
        ofType(loadLOVs),
        switchMap(() => this.adminService.getLOVsForClaimCreation().pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => setLOVs({ LOVs: response })),
            catchError(err => of({ type: setError.type, error: { code: 'LOV_ERROR' } }))
        ))
    ));

    openSelectServiceDialog$ = createEffect(() => this.actions$.pipe(
        ofType(openSelectServiceDialog),
        tap(data => this.dialog.open(SelectServiceDialogComponent, {
            data: data,
            closeOnNavigation: true,
            height: '600px',
            width: '800px',
        }))
    ), { dispatch: false });

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
        ofType(setUploadId || saveClaim),
        withLatestFrom(this.store.select(getClaim)),
        switchMap(value => this.claimService.saveManuallyCreatedClaim(value[1], this.sharedServices.providerId).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => {
                this.store.dispatch(setLoading({ loading: false }));
                return viewThisMonthClaims({ uploadId: value[1].claimIdentities.uploadID });
            }),
            catchError(err => {
                let status = '';
                let description: string;
                if (err instanceof HttpErrorResponse) {
                    status = err.error['status'];
                    try {
                        description = err.error['errors'][0]['description'];
                    } catch (error) { }
                }
                this.store.dispatch(setLoading({ loading: false }));
                return of({ type: setError.type, error: { code: 'CLAIM_SAVING_ERROR', status: status, description: description } });
            })
        ))
    ));

    viewThisMonthClaims$ = createEffect(() => this.actions$.pipe(
        ofType(viewThisMonthClaims),
        tap(value => this.router.navigate([this.sharedServices.providerId, 'claims'], { queryParams: { uploadId: value.uploadId } })),
        map(() => cancelClaim())
    ));

}