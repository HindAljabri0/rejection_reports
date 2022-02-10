import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { ClaimReviewState, UploadsPage } from "../models/claimReviewState.model";
import { loadUploadsUnderReviewOfSelectedTab, uploadsReviewTabAction } from "./claimReview.actions";


const initState: ClaimReviewState = {
    uploads: {
        new: new UploadsPage(),
        inProgress: new UploadsPage(),
        completed: new UploadsPage()
    },
    selectedUploadsTab: 'new'
}

const _claimReviewReducer = createReducer(
    initState,
    on(uploadsReviewTabAction, (state, { index }) => ({ ...state, selectedUploadTab: index == 0 ? 'new' : (index == 1 ? 'inProgress' : 'completed') })),
    on(loadUploadsUnderReviewOfSelectedTab, (state) => {
        if (state.selectedUploadsTab == 'new')
            return ({ ...state, uploads: { ...state.uploads, new: { ...state.uploads.new, isLoading: true } } });
        else if (state.selectedUploadsTab == 'inProgress')
            return ({ ...state, uploads: { ...state.uploads, new: { ...state.uploads.inProgress, isLoading: true } } });
        else
            return ({ ...state, uploads: { ...state.uploads, new: { ...state.uploads.completed, isLoading: true } } });
    })
);

export function claimReviewReducer(state, action) {
    return _claimReviewReducer(state, action);
}

export const claimReviewStateSelector = createFeatureSelector<ClaimReviewState>('claimReviewState');

export const newClaimsUnderReviewPage = createSelector(claimReviewStateSelector, (state) => state.uploads.new.uploads);
export const inProgressClaimsUnderReviewPage = createSelector(claimReviewStateSelector, (state) => state.uploads.inProgress.uploads);
export const completedClaimsUnderReviewPage = createSelector(claimReviewStateSelector, (state) => state.uploads.completed.uploads);
export const selectedUploadsTab = createSelector(claimReviewStateSelector, (state) => state.selectedUploadsTab);
export const currentSelectedTabPagination = createSelector(claimReviewStateSelector, (state) => state.uploads[state.selectedUploadsTab].pageControls);