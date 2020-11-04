import { createAction, props } from '@ngrx/store';
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { AssignedAttachment, SearchCriteria, UnassignedAttachment } from './search.reducer';


export enum SearchPaginationAction {
    firstPage,
    previousPage,
    nextPage,
    lastPage
}

export const setSearchCriteria = createAction('[ Search ] modify current search criteria', props<SearchCriteria>());
export const requestClaimsPage = createAction('[ Search ] request a page of claims based on current criteria', props<{ action: SearchPaginationAction }>());
export const storeClaims = createAction('[ Search ] store the result of claims page request in current state', props<{ claims: SearchedClaim[], currentPage:number, maxPages:number, pageSize:number }>());

export const requestClaimAttachments = createAction('[ Search - Attachment Management ] request attachments of a claim', props<{ claimId: string }>());
export const assignAttachmentsToClaim = createAction('[ Search - Attachment Management ] assign attachments that are request from backend or are assigned here in front end', props<{ attachments: AssignedAttachment[] }>());
export const storeUnassignedAttachments = createAction('[ Search - Attachment Management ] store unassigned attachments', props<{ attachments: UnassignedAttachment[] }>());


export const showErrorMessage = createAction('[ Search - Attachment Management ] show error message to user', props<{message: string}>());
