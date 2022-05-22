import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { ClaimReviewState, UploadsPage } from "../models/claimReviewState.model";
import { loadUploadsUnderReviewOfSelectedTab, markAsDoneSelected, setLoadUploadClaimsList, setMarkSelectedAsDoneReturn, setSingleClaim, setSingleClaimErrors, setUploadsPageErrorOfSelectedTab, setUploadsPageOfSelectedTab, uploadsReviewPageAction, uploadsReviewTabAction } from "./claimReview.actions";


const initState: ClaimReviewState = {
    uploads: {
        new: new UploadsPage(0, 10),
        inProgress: new UploadsPage(0, 10),
        completed: new UploadsPage(0, 10)
    },
    selectedUploadsTab: 'new',
    claimErrors: null,
    singleClaim: null,
    uploadClaimsSummary: null
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
    }),
    on(setSingleClaim, (state, claim) => {
        return ({ ...state, singleClaim: claim });
    })
    ,
    on(setSingleClaimErrors, (state, errors) => {
        return ({ ...state, claimErrors: errors });
    })
    , 
    on(setMarkSelectedAsDoneReturn, (state, markAsDone) => {
        console.log('markAsDone.selectedClaims', markAsDone.selectedClaims);
        return ({ ...state });
    })
    , 
    on(setLoadUploadClaimsList, (state, claimSummary) => {
        return ({ ...state, UploadClaimsSummary: claimSummary.data.uploadClaimSummaryList.content});
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
export const getSingleClaim = createSelector(claimReviewStateSelector, (state) => state.singleClaim);

export const getSingleClaimServices = createSelector(claimReviewStateSelector, (state) => state.singleClaim ? state.singleClaim.invoice.map(invoice => invoice.service ? invoice.service : []).reduce((serviceList1, serviceList2) => { let res = []; res.push(...serviceList1); res.push(...serviceList2); return res; }) : []);
export const getSelectedIllnessCodes = createSelector(claimReviewStateSelector, (state) => state.singleClaim && state.singleClaim.caseInformation && state.singleClaim.caseInformation.caseDescription && state.singleClaim.caseInformation.caseDescription.illnessCategory ? state.singleClaim.caseInformation.caseDescription.illnessCategory.inllnessCode : []);
export const getClaimErrors = createSelector(claimReviewStateSelector, (state) => state.claimErrors);
export const getUploadClaimsSummary = createSelector(claimReviewStateSelector, (state) => state.uploadClaimsSummary);




export type FieldError = { fieldName?: string, code?: string, description?: string };
export type DiagnosisRemarksUpdateRequest = { diagnosisId: number, provClaimNo: string, uploadId: number, remarks?: string, coder: boolean, doctor: boolean };
export type MarkAsDone = { provClaimNo?: string, uploadId: number, coder: boolean, doctor: boolean, userName: string, provClaimNoList?: string[] };
export type UploadClaimsList = {page: number, pageSize: number, doctor: boolean, coder: boolean};
