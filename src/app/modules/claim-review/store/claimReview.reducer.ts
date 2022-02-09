import { createFeatureSelector, createReducer, createSelector } from "@ngrx/store";
import { ClaimReviewState, UploadsPage } from "../models/claimReviewState.model";
import { Upload } from "../models/upload.model";


const initState: ClaimReviewState = {
    uploads: {
        new: new UploadsPage(),
        inProgress: new UploadsPage(),
        completed: new UploadsPage()
    }
}

const _claimReviewReducer = createReducer(
    initState
);

export function claimReviewReducer(state, action) {
    return _claimReviewReducer(state, action);
}

export const claimReviewStateSelector = createFeatureSelector<ClaimReviewState>('claimReviewState');

export const newClaimsUnderReviewPage = createSelector(claimReviewStateSelector, (state) => state.uploads.new.uploads);
export const inProgressClaimsUnderReviewPage = createSelector(claimReviewStateSelector, (state) => state.uploads.inProgress.uploads);
export const completedClaimsUnderReviewPage = createSelector(claimReviewStateSelector, (state) => state.uploads.completed.uploads);