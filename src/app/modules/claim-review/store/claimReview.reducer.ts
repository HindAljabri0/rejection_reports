import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { ClaimReviewState, UploadsPage } from "../models/claimReviewState.model";
import { loadUploadsUnderReviewOfSelectedTab, setUploadsPageErrorOfSelectedTab, setUploadsPageOfSelectedTab, uploadsReviewPageAction, uploadsReviewTabAction } from "./claimReview.actions";


const initState: ClaimReviewState = {
    uploads: {
        new: new UploadsPage(0, 10),
        inProgress: new UploadsPage(0, 10),
        completed: new UploadsPage(0, 10)
    },
    selectedUploadsTab: 'new'
}

const _claimReviewReducer = createReducer(
    initState,
    on(uploadsReviewTabAction, (state, { index }) => ({ ...state, selectedUploadsTab: index == 0 ? 'new' : (index == 1 ? 'inProgress' : 'completed') })),
    on(uploadsReviewPageAction, (state, { pageIndex, pageSize }) => {
        if (state.selectedUploadsTab == 'new')
            return ({ ...state, uploads: { ...state.uploads, new: new UploadsPage(pageIndex, pageSize) } });
        else if (state.selectedUploadsTab == 'inProgress')
            return ({ ...state, uploads: { ...state.uploads, inProgress: new UploadsPage(pageIndex, pageSize) } });
        else
            return ({ ...state, uploads: { ...state.uploads, completed: new UploadsPage(pageIndex, pageSize) } });
    }),
    on(loadUploadsUnderReviewOfSelectedTab, (state) => {
        if (state.selectedUploadsTab == 'new')
            return ({ ...state, uploads: { ...state.uploads, new: { ...state.uploads.new, pageControls: { ...state.uploads.new.pageControls, isLoading: true } } } });
        else if (state.selectedUploadsTab == 'inProgress')
            return ({ ...state, uploads: { ...state.uploads, inProgress: { ...state.uploads.inProgress, pageControls: { ...state.uploads.inProgress.pageControls, isLoading: true } } } });
        else
            return ({ ...state, uploads: { ...state.uploads, completed: { ...state.uploads.completed, pageControls: { ...state.uploads.completed.pageControls, isLoading: true } } } });
    }),
    on(setUploadsPageOfSelectedTab, (state, { uploads, pageControls }) => {
        if (state.selectedUploadsTab == 'new')
            return ({ ...state, uploads: { ...state.uploads, new: { uploads: uploads, pageControls: pageControls } } });
        else if (state.selectedUploadsTab == 'inProgress')
            return ({ ...state, uploads: { ...state.uploads, inProgress: { uploads: uploads, pageControls: pageControls } } });
        else
            return ({ ...state, uploads: { ...state.uploads, completed: { uploads: uploads, pageControls: pageControls } } });
    }),
    on(setUploadsPageErrorOfSelectedTab, (state, { message }) => {
        if (state.selectedUploadsTab == 'new')
            return ({ ...state, uploads: { ...state.uploads, new: { ...state.uploads.new, pageControls: { ...state.uploads.new.pageControls, errorMessage: message, isLoading: false } } } });
        else if (state.selectedUploadsTab == 'inProgress')
            return ({ ...state, uploads: { ...state.uploads, inProgress: { ...state.uploads.inProgress, pageControls: { ...state.uploads.inProgress.pageControls, errorMessage: message, isLoading: false } } } });
        else
            return ({ ...state, uploads: { ...state.uploads, completed: { ...state.uploads.completed, pageControls: { ...state.uploads.completed.pageControls, errorMessage: message, isLoading: false } } } });
    })
);

export function claimReviewReducer(state, action) {
    return _claimReviewReducer(state, action);
}

export const claimReviewStateSelector = createFeatureSelector<ClaimReviewState>('claimReviewState');

export const newClaimsUnderReviewPage = createSelector(claimReviewStateSelector, (state) => state.uploads.new);
export const inProgressClaimsUnderReviewPage = createSelector(claimReviewStateSelector, (state) => state.uploads.inProgress);
export const completedClaimsUnderReviewPage = createSelector(claimReviewStateSelector, (state) => state.uploads.completed);
export const selectedUploadsTab = createSelector(claimReviewStateSelector, (state) => state.selectedUploadsTab);
export const currentSelectedTabPageControls = createSelector(claimReviewStateSelector, (state) => state.uploads[state.selectedUploadsTab].pageControls);
export const currentSelectedTabHasContent = createSelector(claimReviewStateSelector, (state) => state.uploads[state.selectedUploadsTab].uploads != null && state.uploads[state.selectedUploadsTab].uploads.length > 0);