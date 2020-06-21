import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as actions from './claim.actions';
import { Claim } from '../models/claim.model';
import { HttpEvent, HttpResponse } from '@angular/common/http';

export interface ClaimState {
    claim: Claim;
    LOVs: { Departments: any[], IllnessCode: any[], VisitType: any[], PhysicianCategory: any[] };
}

const initState: ClaimState = {
    claim: null,
    LOVs: { Departments: [], IllnessCode: [], VisitType: [], PhysicianCategory: [] }
}

const _claimReducer = createReducer(
    initState,
    on(actions.startCreatingNewClaim, (state, { caseType }) => {
        let claim = new Claim(caseType);
        return { ...state, claim: claim };
    }),
    on(actions.setLOVs, (state, { LOVs }) => ({ ...state, LOVs: extractLOVsFromHttpResponse(LOVs) })),
    on(actions.updatePatientName, (state, { name }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, patient: { ...state.claim.caseInformation.patient, fullName: name } } } })),
    on(actions.updatePatientGender, (state, { gender }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, patient: { ...state.claim.caseInformation.patient, gender: gender } } } })),
    on(actions.updatePayer, (state, { payerId }) => ({ ...state, claim: { ...state.claim, claimIdentities: { ...state.claim.claimIdentities, payerID: `${payerId}` } } })),
    on(actions.updatePatientMemberId, (state, { memberId }) => ({ ...state, claim: { ...state.claim, member: { ...state.claim.member, memberID: memberId } } })),
    on(actions.updateNationalId, (state, { nationalId }) => ({ ...state, claim: { ...state.claim, member: { ...state.claim.member, idNumber: nationalId } } })),
    on(actions.updatePolicyNum, (state, { policyNo }) => ({ ...state, claim: { ...state.claim, member: { ...state.claim.member, policyNumber: policyNo } } })),
    on(actions.updateApprovalNum, (state, { approvalNo }) => ({ ...state, claim: { ...state.claim, claimIdentities: { ...state.claim.claimIdentities, approvalNumber: approvalNo } } })),
    on(actions.updatePhysicianId, (state, { physicianId }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, physician: { ...state.claim.caseInformation.physician, physicianID: physicianId } } } })),
    on(actions.updatePhysicianName, (state, { physicianName }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, physician: { ...state.claim.caseInformation.physician, physicianName: physicianName } } } })),
);

export function claimReducer(state, action) {
    return _claimReducer(state, action);
}

export const claimSelector = createFeatureSelector<ClaimState>('claimState');
export const getClaim = createSelector(claimSelector, (state) => state.claim);
export const getVistType = createSelector(claimSelector, (state) => state.LOVs.VisitType);
export const getDepartments = createSelector(claimSelector, (state) => state.LOVs.Departments);
export const getIllnessCode = createSelector(claimSelector, (state) => state.LOVs.IllnessCode);
export const getPhysicianCategory = createSelector(claimSelector, (state) => state.LOVs.PhysicianCategory);



function extractLOVsFromHttpResponse(response: HttpEvent<any>) {
    if (response instanceof HttpResponse) {
        return response.body;
    }
}