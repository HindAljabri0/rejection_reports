import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { SearchedClaim } from 'src/app/models/searchedClaim';
import {
    assignAttachmentsToClaim,
    cancelAttachmentEdit,
    saveAttachmentsChanges,
    setSearchCriteria,
    storeAttachmentsChangesResponse,
    storeClaims,
    toggleAssignedAttachmentLoading,
    updateClaimAttachments
} from './search.actions';


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
    invoiceNo?: string;
    patientFileNo?: string;
    policyNo?: string;
    payerId?: string;
    organizationId?: string;
    fromDate?: string;
    toDate?: string;
    batchId?: string;
    uploadId?: string;
    nationalId?:string;
    requestBundleId?:string;
}


export interface AttachmentManagementState {
    saveChangesLoading: boolean;
    assignedAttachmentsLoading: boolean;
    claimsWithChanges: string[];
    assignedAttachments: AssignedAttachment[];
    responses: { id: string, status: string, error?}[];
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
        saveChangesLoading: false,
        assignedAttachmentsLoading: false,
        claimsWithChanges: [],
        assignedAttachments: [],
        responses: [],
    }
};


const _searchReducer = createReducer(
    initState,
    on(setSearchCriteria, (state, { type, ...criteria }) => ({ ...state, searchCriteria: { ...state.searchCriteria, ...criteria } })),
    on(storeClaims, (state, { claims, currentPage, maxPages, pageSize }) =>
        ({ ...state, claims, currentPage, maxPages, pageSize })),
    on(toggleAssignedAttachmentLoading, (state, { isLoading }) =>
        ({ ...state, attachmentManagementState: { ...state.attachmentManagementState, assignedAttachmentsLoading: isLoading } })),
    on(assignAttachmentsToClaim, (state, { attachments }) =>
    ({
        ...state, attachmentManagementState: {
            ...state.attachmentManagementState,
            assignedAttachments: attachments.concat(state.attachmentManagementState.assignedAttachments),
            assignedAttachmentsLoading: false
        }
    })),
    on(updateClaimAttachments, (state, { claimId, attachments }) => {
        const filteredAttachments = state.attachmentManagementState.assignedAttachments.filter(att => att.claimId != claimId);
        const allAttachments = filteredAttachments.concat(attachments);
        const claimsWithChanges = [...state.attachmentManagementState.claimsWithChanges];
        if (!claimsWithChanges.includes(claimId)) { claimsWithChanges.push(claimId); }
        return ({
            ...state, attachmentManagementState: {
                ...state.attachmentManagementState,
                assignedAttachments: allAttachments,
                claimsWithChanges
            }
        });
    }),
    on(cancelAttachmentEdit, (state) => ({ ...state, attachmentManagementState: initState.attachmentManagementState })),
    on(saveAttachmentsChanges, (state) => ({
        ...state, attachmentManagementState: {
            ...state.attachmentManagementState,
            saveChangesLoading: true
        }
    })),
    on(storeAttachmentsChangesResponse, (state, { responses }) => ({
        ...state,
        attachmentManagementState: {
            ...state.attachmentManagementState,
            saveChangesLoading: false,
            responses,
            claimsWithChanges: state.attachmentManagementState.claimsWithChanges.filter(id =>
                responses.findIndex(res => res.id == id && res.status == 'error') != -1)
        }
    })),
);

export function searchReducer(state, action) {
    return _searchReducer(state, action);
}

export const searchStateSelector = createFeatureSelector<SearchState>('searchState');

export const getCurrentSearchResult = createSelector(searchStateSelector, (state) => state.claims);
export const getAssignedAttachments = createSelector(searchStateSelector, (state) => state.attachmentManagementState.assignedAttachments);
export const getSelectedClaimAttachments = (claimId: string) => createSelector(searchStateSelector,
    (state) => state.attachmentManagementState.assignedAttachments.filter(att => att.claimId == claimId));
export const getPageInfo = createSelector(searchStateSelector, (state) => ({ currentPage: state.currentPage, maxPages: state.maxPages }));
export const getIsAssignedAttachmentsLoading = createSelector(searchStateSelector,
    (state) => state.attachmentManagementState.assignedAttachmentsLoading);
export const getClaimsWithChanges = createSelector(searchStateSelector, (state) => state.attachmentManagementState.claimsWithChanges);
export const getIsSavingChanges = createSelector(searchStateSelector, (state) => state.attachmentManagementState.saveChangesLoading);
export const getSavingResponses = createSelector(searchStateSelector, (state) => state.attachmentManagementState.responses);
