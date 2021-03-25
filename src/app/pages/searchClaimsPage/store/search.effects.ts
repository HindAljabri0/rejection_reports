import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { SharedServices } from 'src/app/services/shared.services';
import { showSnackBarMessage } from 'src/app/store/mainStore.actions';
import {
    assignAttachmentsToClaim,
    requestClaimAttachments,
    saveAttachmentsChanges,
    showErrorMessage,
    storeAttachmentsChangesResponse,
    toggleAssignedAttachmentLoading
} from './search.actions';
import { AssignedAttachment, getAssignedAttachments, getClaimsWithChanges } from './search.reducer';



@Injectable({
    providedIn: 'root'
})
export class SearchEffects {

    constructor(
        private actions$: Actions,
        private store: Store,
        private claimService: ClaimService,
        private sharedServices: SharedServices
    ) { }


    onRequestClaimAttachments$ = createEffect(() => this.actions$.pipe(
        ofType(requestClaimAttachments),
        withLatestFrom(this.store.select(getAssignedAttachments)),
        filter(values => values[1].every(att => att.claimId != values[0].claimId)),
        map(values => {
            this.store.dispatch(toggleAssignedAttachmentLoading({ isLoading: true }));
            return values[0].claimId;
        }),
        switchMap(claimId => this.claimService.getAttachmentsOfClaim(this.sharedServices.providerId, claimId).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => assignAttachmentsToClaim({ attachments: this.mapAttachmentResponseToAssignedAttachments(response, claimId) })),
            catchError(err => {
                this.store.dispatch(toggleAssignedAttachmentLoading({ isLoading: false }));
                return of({ type: showErrorMessage.type, error: { code: 'ATTACHMENT_REQUEST' } });
            })
        ))
    ));

    onSaveClaimAttachment$ = createEffect(() => this.actions$.pipe(
        ofType(saveAttachmentsChanges),
        withLatestFrom(this.store.select(getClaimsWithChanges)),
        withLatestFrom(this.store.select(getAssignedAttachments)),
        map(data => ({ attachments: data[1].filter(att => data[0][1].includes(att.claimId)), ids: data[0][1] })),
        map(data => forkJoin(
            data.ids.map(id =>
                this.claimService.putAttachmentsOfClaim(this.sharedServices.providerId,
                    id,
                    data.attachments.filter(att => att.claimId == id))
                    .pipe(
                        filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
                        map(response => ({ id: id, status: 'done' })),
                        catchError(err => of({ id: id, status: 'error', error: err }))
                    )
            )
        )),
        map(requests => requests.subscribe(res => this.store.dispatch(storeAttachmentsChangesResponse({ responses: res }))))
    ), { dispatch: false });

    onShowErrorMessage$ = createEffect(() => this.actions$.pipe(
        ofType(showErrorMessage),
        map(data => data.error),
        tap(error => {
            switch (error.code) {
                case 'ATTACHMENT_REQUEST':
                    this.store.dispatch(showSnackBarMessage({ message: 'Could not load attachment. Please try again later.' }));
                    break;
                default:
                    if (error.message != null) {
                        this.store.dispatch(showSnackBarMessage({ message: error.message }));
                    }
                    break;
            }
        })
    ), { dispatch: false });

    mapAttachmentResponseToAssignedAttachments(response, claimId: string): AssignedAttachment[] {
        let results: AssignedAttachment[] = [];
        if (response instanceof HttpResponse) {
            const body = response.body;
            if (body instanceof Array) {
                results = body.map(att => ({
                    claimId: claimId, file: att['attachmentfile'],
                    type: att['filetype'], name: att['filename'], attachmentId: att['attachmentid']
                }));
            }
        }
        return results;
    }

}
