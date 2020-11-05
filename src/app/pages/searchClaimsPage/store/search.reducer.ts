import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store'
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { assignAttachmentsToClaim, setSearchCriteria, storeClaims } from './search.actions';


export interface SearchState {
    searchCriteria: SearchCriteria;
    claims: SearchedClaim[];
    currentPage: number;
    maxPages: number;
    pageSize: number;
    attachmentManagementState: AttachmentManagementState;
}

export interface SearchCriteria {
    statuses?: string[];
    provClaimNum?: string;
    memberId?: string;
    payerId?: string;
    fromDate?: string;
    toDate?: string;
    batchId?: string;
    uploadId?: string;
}


export interface AttachmentManagementState {
    unassignedAttachments: UnassignedAttachment[];
    assignedAttachments: AssignedAttachment[];
}

export type UnassignedAttachment = { file: File, type?: string };
export type AssignedAttachment = { claimId: string, file, type: string, name: string };

const initState: SearchState = {
    searchCriteria: null,
    claims: [],
    currentPage: 0,
    maxPages: 0,
    pageSize: 10,
    attachmentManagementState: {
        unassignedAttachments: [],
        assignedAttachments: [],
    }
}


const _searchReducer = createReducer(
    initState,
    on(setSearchCriteria, (state, { type, ...criteria }) => ({ ...state, searchCriteria: { ...state.searchCriteria, ...criteria } })),
    on(storeClaims, (state, { claims, currentPage, maxPages, pageSize }) => ({ ...state, claims: claims, currentPage: currentPage, maxPages: maxPages, pageSize: pageSize })),
    on(assignAttachmentsToClaim, (state, { attachments }) => ({ ...state, attachmentManagementState: { ...state.attachmentManagementState, assignedAttachments: attachments } })),
)

export function searchReducer(state, action) {
    return _searchReducer(state, action);
}

export const searchStateSelector = createFeatureSelector<SearchState>('searchState');

export const getCurrentSearchResult = createSelector(searchStateSelector, (state) => state.claims);
export const getAssignedAttachments = createSelector(searchStateSelector, (state) => state.attachmentManagementState.assignedAttachments);
export const getSelectedClaimAttachments = (claimId: string) => createSelector(searchStateSelector, (state) => state.attachmentManagementState.assignedAttachments.filter(att => att.claimId == claimId));
export const getPageInfo = createSelector(searchStateSelector, (state) => ({ currentPage: state.currentPage, maxPages: state.maxPages }));