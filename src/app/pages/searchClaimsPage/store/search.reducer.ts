import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store'
import { SearchedClaim } from 'src/app/models/searchedClaim';
import { assignAttachmentsToClaim, cancelAttachmentEdit, requestClaimAttachments, setSearchCriteria, storeClaims, toggleAssignedAttachmentLoading, updateClaimAttachments } from './search.actions';


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
    assignedAttachmentsLoading: boolean;
    claimsWithChanges: string[];
    assignedAttachments: AssignedAttachment[];
}

export type UnassignedAttachment = { file: File, type?: string, attachmentId?: string };
export type AssignedAttachment = { claimId: string, file, type: string, name: string, attachmentId?: string };

const initState: SearchState = {
    searchCriteria: null,
    claims: [],
    currentPage: 0,
    maxPages: 0,
    pageSize: 10,
    attachmentManagementState: {
        assignedAttachmentsLoading: false,
        claimsWithChanges: [],
        assignedAttachments: [],
    }
}


const _searchReducer = createReducer(
    initState,
    on(setSearchCriteria, (state, { type, ...criteria }) => ({ ...state, searchCriteria: { ...state.searchCriteria, ...criteria } })),
    on(storeClaims, (state, { claims, currentPage, maxPages, pageSize }) => ({ ...state, claims: claims, currentPage: currentPage, maxPages: maxPages, pageSize: pageSize })),
    on(toggleAssignedAttachmentLoading, (state, { isLoading }) => ({ ...state, attachmentManagementState: { ...state.attachmentManagementState, assignedAttachmentsLoading: isLoading } })),
    on(assignAttachmentsToClaim, (state, { attachments }) => ({ ...state, attachmentManagementState: { ...state.attachmentManagementState, assignedAttachments: attachments, assignedAttachmentsLoading: false } })),
    on(updateClaimAttachments, (state, { claimId, attachments }) => {
        let filteredAttachments = state.attachmentManagementState.assignedAttachments.filter(att => att.claimId != claimId);
        let allAttachments = filteredAttachments.concat(attachments);
        let claimsWithChanges = [...state.attachmentManagementState.claimsWithChanges];
        if(!claimsWithChanges.includes(claimId)) claimsWithChanges.push(claimId)
        return ({ ...state, attachmentManagementState: { ...state.attachmentManagementState, assignedAttachments: allAttachments, claimsWithChanges: claimsWithChanges} });
    }),
    on(cancelAttachmentEdit, (state) => ({...state, attachmentManagementState: initState.attachmentManagementState})),
)

export function searchReducer(state, action) {
    return _searchReducer(state, action);
}

export const searchStateSelector = createFeatureSelector<SearchState>('searchState');

export const getCurrentSearchResult = createSelector(searchStateSelector, (state) => state.claims);
export const getAssignedAttachments = createSelector(searchStateSelector, (state) => state.attachmentManagementState.assignedAttachments);
export const getSelectedClaimAttachments = (claimId: string) => createSelector(searchStateSelector, (state) => state.attachmentManagementState.assignedAttachments.filter(att => att.claimId == claimId));
export const getPageInfo = createSelector(searchStateSelector, (state) => ({ currentPage: state.currentPage, maxPages: state.maxPages }));
export const getIsAssignedAttachmentsLoading = createSelector(searchStateSelector, (state) => state.attachmentManagementState.assignedAttachmentsLoading);
export const getClaimsWithChanges = createSelector(searchStateSelector, (state) => state.attachmentManagementState.claimsWithChanges);