import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { SharedServices } from 'src/app/services/shared.services';
import { assignAttachmentsToClaim, requestClaimAttachments, saveAttachmentsChanges, sendSaveRequestForClaim, showErrorMessage, toggleAssignedAttachmentLoading } from './search.actions';
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
        map(data => data.ids.forEach(id =>
            this.store.dispatch(sendSaveRequestForClaim({ claimId: id, attachments: data.attachments.filter(att => att.claimId == id) }))
        ))
    ), { dispatch: false })

    sendSaveRequestForClaim$ = createEffect(() => this.actions$.pipe(
        ofType(sendSaveRequestForClaim),
        switchMap(data => this.claimService.putAttachmentsOfClaim(this.sharedServices.providerId, data.claimId, data.attachments).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => {}),
            catchError(err => of({}))
        ))
    ), { dispatch: false })

    mapAttachmentResponseToAssignedAttachments(response, claimId: string): AssignedAttachment[] {
        let results: AssignedAttachment[] = []
        if (response instanceof HttpResponse) {
            const body = response.body;
            if (body instanceof Array) {
                results = body.map(att => ({ claimId: claimId, file: att['attachmentfile'], type: att['filetype'], name: att['filename'], attachmentId: att['attachmentid'] }));
            }
        }
        return results;
    }

}