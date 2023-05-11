import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
    loadLOVs,
    setLOVs,
    setError,
    startCreatingNewClaim,
    setLoading,
    startValidatingClaim,
    getUploadId,
    setUploadId,
    viewThisMonthClaims,
    saveClaim,
    cancelClaim,
    openCreateByApprovalDialog,
    getClaimDataByApproval,
    openSelectServiceDialog,
    showOnSaveDoneDialog,
    retrieveClaim,
    viewRetrievedClaim,
    saveClaimChanges,
    finishValidation,
    goToClaim
} from './claim.actions';
import { switchMap, map, catchError, filter, tap, withLatestFrom } from 'rxjs/operators';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { of } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ClaimValidationService } from '../services/claimValidationService/claim-validation.service';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { Store } from '@ngrx/store';
import { getClaim, getClaimObjectErrors, getDepartments, getPageMode, getPaginationControl, getRetrievedClaimId, getRetrievedClaimProps } from './claim.reducer';
import { SharedServices } from 'src/app/services/shared.services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CreateByApprovalFormComponent } from '../dialogs/create-by-approval-form/create-by-approval-form.component';
import { ApprovalInquiryService } from '../services/approvalInquiryService/approval-inquiry.service';
import { Claim } from '../models/claim.model';
import { Service } from '../models/service.model';
import { SelectServiceDialogComponent } from '../dialogs/select-service-dialog/select-service-dialog.component';
import { OnSavingDoneComponent } from '../dialogs/on-saving-done/on-saving-done.component';
import { OnSavingDoneDialogData } from '../dialogs/on-saving-done/on-saving-done.data';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';


@Injectable({
    providedIn: 'root'
})
export class ClaimEffects {

    dentalDepartmentCode: string;
    opticalDepartmentCode: string;

    constructor(
        private actions$: Actions,
        private store: Store,
        private adminService: AdminService,
        private approvalInquireService: ApprovalInquiryService,
        private validationService: ClaimValidationService,
        private claimService: ClaimService,
        private sharedServices: SharedServices,
        private router: Router,
        private dialog: MatDialog,
        private dialogService: DialogService
    ) {
        this.store.select(getDepartments)
            .subscribe(departments => {
                if (departments != null && departments.length > 0) {
                    this.dentalDepartmentCode = departments.find(department => department.name == 'Dental').departmentId + '';
                    this.opticalDepartmentCode = departments.find(department => department.name == 'Optical').departmentId + '';

                }
            });
    }



    openApprovalFormDialog$ = createEffect(() => this.actions$.pipe(
        ofType(openCreateByApprovalDialog),
        tap(data => this.dialog.open(CreateByApprovalFormComponent, {
            data,
            closeOnNavigation: true,
            panelClass: ['primary-dialog']
        }))
    ), { dispatch: false });

    getClaimDataFromApproval$ = createEffect(() => this.actions$.pipe(
        ofType(getClaimDataByApproval),
        switchMap(data => this.approvalInquireService.getClaimDataByApprovalNumber(this.sharedServices.providerId,
            data.payerId,
            data.approvalNumber,
            data.claimType == this.dentalDepartmentCode ? 'DENTAL' : 'OPTICAL').pipe(
                filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
                map(response => {
                    this.dialog.closeAll();
                    return startCreatingNewClaim({
                        data: {
                            claim: Claim.fromApprovalResponse(data.claimType,
                                data.providerClaimNumber,
                                data.payerId,
                                data.approvalNumber,
                                response),
                            services: Service.fromResponse(response),
                        }
                    });
                }),
                catchError(err => {
                    console.log(err);
                    this.dialog.closeAll();
                    if (err.hasOwnProperty('status') && (err.status == 0 || err.status >= 500)) {
                        return of({ type: setError.type, error: { code: `APPROVAL_ERROR_SERVER`, } });
                    }
                    return of({
                        type: setError.type,
                        error: {
                            code: `APPROVAL_ERROR_${data.claimType == this.dentalDepartmentCode ? 'DENTAL' : 'OPTICAL'}`,
                        }
                    });
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
            data,
            closeOnNavigation: true,
            width: '90%',
        }))
    ), { dispatch: false });

    startValidatingClaim$ = createEffect(() => this.actions$.pipe(
        ofType(startValidatingClaim),
        tap(() => this.validationService.startValidation()),
        map(() => finishValidation())
    ));

    onFinishValidation$ = createEffect(() => this.actions$.pipe(
        ofType(finishValidation),
        withLatestFrom(this.store.select(getClaimObjectErrors)),
        withLatestFrom(this.store.select(getPageMode)),
        map(values => ({ errors: values[0][1], pageMode: values[1] })),
        map(values => {
            if ((values.errors.genInfoErrors.length == 0
                || values.errors.genInfoErrors.every(error => !['VSITDATE', 'PATFILNO', 'DPARCODE'].includes(error.fieldName)))
                && (values.errors.invoicesErrors.length == 0
                    || values.errors.invoicesErrors.every(error => error.fieldName != 'INVOICENUM'))
            ) {
                if (values.pageMode == 'CREATE' || values.pageMode=='CREATE_FROM_RETRIEVED'  ) {
                    console.log(values.pageMode )
                    return getUploadId({ providerId: this.sharedServices.providerId });
                } else {
                    console.log(values.pageMode)
                    return saveClaimChanges();
                }
            }
            return setLoading({ loading: false });
        })
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
                return showOnSaveDoneDialog(OnSavingDoneDialogData.fromResponse(response, value[1].claimIdentities.uploadID, null));
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
                return of({ type: setError.type, error: { code: 'CLAIM_SAVING_ERROR', status, description } });
            })
        ))
    ));

    saveClaimChanges$ = createEffect(() => this.actions$.pipe(
        ofType(saveClaimChanges),
        withLatestFrom(this.store.select(getClaim)),
        withLatestFrom(this.store.select(getRetrievedClaimId)),
        withLatestFrom(this.store.select(getRetrievedClaimProps)),
        map(values => ({ claim: values[0][0][1], id: values[0][1], currentStatus: values[1].statusCode})),
        switchMap(values => this.claimService.saveChangesToExistingClaim(values.claim, this.sharedServices.providerId, values.id).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => {
                this.store.dispatch(setLoading({ loading: false }));
                return showOnSaveDoneDialog(OnSavingDoneDialogData.fromResponse(response, values.claim.claimIdentities.uploadID, values.currentStatus));
            }),
            catchError(err => {
                let status = '';
                let description: string;
                if (err instanceof HttpErrorResponse) {
                    try {
                        status = err.error['status'];
                        description = err.error['errors'][0]['description'];
                    } catch (error) { }
                }
                this.store.dispatch(setLoading({ loading: false }));
                return of({
                    type: setError.type,
                    error: {
                        code: 'CLAIM_SAVING_ERROR',
                        status,
                        description: description || 'Could not handle the request.'
                    }
                });
            })
        ))
    ));

    openOnSavingDoneDialog$ = createEffect(() => this.actions$.pipe(
        ofType(showOnSaveDoneDialog),
        tap(data => this.dialog.open(OnSavingDoneComponent, {
            data,
            closeOnNavigation: true,
            panelClass: ['primary-dialog']
        }))
    ), { dispatch: false });

    viewThisMonthClaims$ = createEffect(() => this.actions$.pipe(
        ofType(viewThisMonthClaims),
        tap(value => {
            if (value.claimId != null) {
                this.router.navigate([this.sharedServices.providerId, 'claims'],
                    { queryParams: { uploadId: value.uploadId, claimId: value.claimId, editMode: value.editMode || false } });
            } else {
                this.router.navigate([this.sharedServices.providerId, 'claims'], { queryParams: { uploadId: value.uploadId } });
            }
        }),
        map(() => cancelClaim())
    ));

    retrieveClaim$ = createEffect(() => this.actions$.pipe(
        ofType(retrieveClaim),
        switchMap(action => this.claimService.viewClaim(this.sharedServices.providerId, action.claimId).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => viewRetrievedClaim(response)),
            catchError(err => of({ type: setError.type, error: { code: 'CLAIM_RETRIEVE_ERROR' } }))
        ))
    ));

    goToClaim$ = createEffect(() => this.actions$.pipe(
        ofType(goToClaim),
        tap(value => {
            this.router.navigate(['/claims', value.claimId]).then(() => location.reload());
        })
    ), { dispatch: false });

}
