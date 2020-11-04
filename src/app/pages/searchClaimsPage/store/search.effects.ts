import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ClaimService } from 'src/app/services/claimService/claim.service';
import { SharedServices } from 'src/app/services/shared.services';
import { assignAttachmentsToClaim, requestClaimAttachments, showErrorMessage } from './search.actions';
import { AssignedAttachment, getAssignedAttachments, getSelectedClaimAttachments } from './search.reducer';



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
        map(values => values[0].claimId),
        switchMap(claimId => this.claimService.getAttachmentsOfClaim(this.sharedServices.providerId, claimId).pipe(
            filter(response => response instanceof HttpResponse || response instanceof HttpErrorResponse),
            map(response => assignAttachmentsToClaim({ attachments: this.mapAttachmentResponseToAssignedAttachments(response, claimId) })),
            catchError(err => of({ type: showErrorMessage.type, error: { code: 'ATTACHMENT_REQUEST' } }))
        ))
    ));

    mapAttachmentResponseToAssignedAttachments(response, claimId:string): AssignedAttachment[] {
        let results: AssignedAttachment[] = []
        if(response instanceof HttpResponse){
            const body = response.body;
            if(body instanceof Array){
                results = body.map(att => ({claimId: claimId, file: att['attachmentfile'], type: att['filetype'], name: att['filename']}));
            }
        }
        return results;
    }

}