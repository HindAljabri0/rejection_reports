import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { Claim } from "src/app/claim-module-components/models/claim.model";
import { Diagnosis } from "src/app/claim-module-components/models/diagnosis.model";
import { ClaimReviewState, PageControls, UploadsPage } from "../models/claimReviewState.model";
import { SwitchUser } from "../models/SwitchUser.model";
import { loadUploadsUnderReviewOfSelectedTab, setCoderListReturn, setDiagnosisRemarksReturn, setDoctorAndCoderData, setDoctorListReturn, setLoadUploadClaimsList, setMarkAllAsDone, setMarkAsDoneReturn, setMarkSelectedAsDoneReturn, setProviderList, setSingleClaim, setSingleClaimErrors, setUploadsPageErrorOfSelectedTab, setUploadsPageOfSelectedTab, uploadsReviewPageAction, uploadsReviewTabAction } from "./claimReview.actions";


const initState: ClaimReviewState = {
    uploads: {
        new: new UploadsPage(0, 10),
        inProgress: new UploadsPage(0, 10),
        completed: new UploadsPage(0, 10)
    },
    selectedUploadsTab: 'new',
    claimErrors: { errors: [] },
    singleClaim: new Claim('INPATIENT', '0'),
    uploadClaimsSummary: null,
    uploadClaimsSummaryPageControls: new PageControls(0, 10),
    nextAvailableClaimProvNo: 0,
    doctorList: null,
    coderList: null,
    providerList: null,
    doctorId: null,
    coderId: null,
    providerId: null
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
            return ({ ...state, nextAvailableClaimProvNo: 0, uploads: { ...state.uploads, new: { uploads: uploads, pageControls: pageControls } } });
        else if (state.selectedUploadsTab == 'inProgress')
            return ({ ...state, nextAvailableClaimProvNo: 0, uploads: { ...state.uploads, inProgress: { uploads: uploads, pageControls: pageControls } } });
        else
            return ({ ...state, nextAvailableClaimProvNo: 0, uploads: { ...state.uploads, completed: { uploads: uploads, pageControls: pageControls } } });
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
    }),
    on(setSingleClaimErrors, (state, errors) => {
        return ({ ...state, claimErrors: errors });
    }),
    on(setMarkSelectedAsDoneReturn, (state, markAsDone) => {
        let newUploadClaimsSummary = state.uploadClaimsSummary.map(claimSummary => markAsDone.selectedClaims.includes(claimSummary.provClaimNo) ? { ...claimSummary, claimReviewStatus: '1' } : claimSummary)
        return ({ ...state, uploadClaimsSummary: newUploadClaimsSummary });
    }),
    on(setMarkAllAsDone, (state, markAllAsDone) => {
        let newUploadClaimsSummary = state.uploadClaimsSummary.map(claimSummary => { return { ...claimSummary, claimReviewStatus: '1' } })
        return ({ ...state, uploadClaimsSummary: newUploadClaimsSummary });
    }),
    on(setMarkAsDoneReturn, (state, data) => {
        let newUploadClaimsSummary = state.uploadClaimsSummary.map(
            claimSummary => {
                return claimSummary.provClaimNo === data.data.claimDetails.provClaimNo ?
                    { ...claimSummary, claimReviewStatus: '1' } : claimSummary
            })
        return ({ ...state, uploadClaimsSummary: newUploadClaimsSummary, nextAvailableClaimProvNo: data.data.nextAvailableClaimRow });
    }),
    on(setLoadUploadClaimsList, (state, claimSummary) => {
        return ({
            ...state,
            uploadClaimsSummary: claimSummary.data.uploadClaimSummaryList.content
            , uploadClaimsSummaryPageControls: claimSummary.data.uploadClaimSummaryList.pageControl
        });
    }),
    on(setDiagnosisRemarksReturn, (state, data) => {
        console.log(data);
        let newDiagnosis: Diagnosis[] = state.singleClaim.caseInformation.caseDescription.diagnosis.map(
            diagnosis => {
                let diag = { ...diagnosis }
                //  diagnosis .diagnosisId === data.data.diagnosisId ? {...diagnosis, doctorRemarks : data.data.doctorRemarks,coderRemarks : remarkReturn.data.doctorRemarks} : diagnosis
                if (diagnosis.diagnosisId === data.data.diagnosisId) {
                    if (data.data.doctor) {
                        diag.doctorRemarks = data.data.remarks
                    } else if (data.data.coder) {
                        diag.coderRemarks = data.data.remarks
                    }
                }
                return diag
            })
        return ({ ...state, singleClaim: { ...state.singleClaim, caseInformation: { ...state.singleClaim.caseInformation, caseDescription: { ...state.singleClaim.caseInformation.caseDescription, diagnosis: newDiagnosis } } } });
    }),
    on(setDoctorListReturn, (state, data) => {
        return ({
            ...state, doctorList: data.list
        });
    }),
    on(setCoderListReturn, (state, data) => {
        return ({
            ...state, coderList: data.list
        });
    }),
    on(setDoctorAndCoderData, (state, { selectedDoctorId, selectedCoderId, selectedProvider }) => ({
        ...state, doctorId: selectedDoctorId, coderId: selectedCoderId, providerId: selectedProvider
    }
    )),
    on(setProviderList, (state, { list }) => ({ ...state, providerList: list }
    ))
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
export const getUploadClaimsSummaryPageControls = createSelector(claimReviewStateSelector, (state) => state.uploadClaimsSummaryPageControls);
export const getNextAvailableClaimRow = createSelector(claimReviewStateSelector, (state) => state.nextAvailableClaimProvNo);
export const getDoctorList = createSelector(claimReviewStateSelector, (state) => state.doctorList);
export const getCoderList = createSelector(claimReviewStateSelector, (state) => state.coderList);
export const getDoctorId = createSelector(claimReviewStateSelector, (state) => state.doctorId);
export const getCoderId = createSelector(claimReviewStateSelector, (state) => state.coderId);
export const getProviderId = createSelector(claimReviewStateSelector, (state) => state.providerId);
export const getProviderList = createSelector(claimReviewStateSelector, (state) => state.providerList);




export type FieldError = { fieldName?: string, code?: string, description?: string };
export type DiagnosisRemarksUpdateRequest = { diagnosisId: number, provClaimNo: string, uploadId: number, remarks?: string, coder: boolean, doctor: boolean };
export type MarkAsDone = { provClaimNo?: string, uploadId: number, coder: boolean, doctor: boolean, userName: string, provClaimNoList?: string[] };
export type UploadClaimsList = { page: number, pageSize: number, doctor: boolean, coder: boolean };
