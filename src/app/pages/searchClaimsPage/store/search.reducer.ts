import { createFeatureSelector, createReducer } from '@ngrx/store'
import { SearchedClaim } from 'src/app/models/searchedClaim';


export interface SearchState {
    searchCriteria;
    claims: SearchedClaim[];
    currentPage: number;
    maxPages: number;
    attachmentManagementState: AttachmentManagementState;
}

export interface AttachmentManagementState {
    unassignedAttachments: { file: File, type?: string }[];
    assignedAttachments: { claimId:number, file, type: string }[];
}

const initState: SearchState = {
    searchCriteria: null,
    claims: [],
    currentPage: 0,
    maxPages: 0,
    attachmentManagementState: {
        unassignedAttachments: [],
        assignedAttachments: [],
    }
}


const _searchReducer = createReducer(
    initState,
)

export function searchReducer(state, action) {
    return _searchReducer(state, action);
}

export const searchStateSelector = createFeatureSelector<SearchState>('searchState');