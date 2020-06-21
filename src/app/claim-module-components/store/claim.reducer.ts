import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as actions from './claim.actions';
import { Claim } from '../models/claim.model';
import { CaseInfo } from '../models/caseInfo.model';

export const claim: Claim = null;

const _claimReducer = createReducer(
    claim,
    on(actions.startCreatingNewClaim, (state, { caseType }) => {
        let claim = new Claim(caseType);
        return claim;
    }),
    on(actions.updatePatientName, (state, { name }) => ({ ...state, caseInformation: { ...state.caseInformation, patient: { ...state.caseInformation.patient, fullName: name } } })),
    on(actions.updatePatientGender, (state, { gender }) => ({ ...state, caseInformation: { ...state.caseInformation, patient: { ...state.caseInformation.patient, gender: gender } } })),
    on(actions.updatePayer, (state, { payerId }) => ({ ...state, claimIdentities: { ...state.claimIdentities, payerID: `${payerId}` } })),
    on(actions.updatePatientMemberId, (state, { memberId }) => ({ ...state, member: { ...state.member, memberID: memberId } })),
    on(actions.updateNationalId, (state, { nationalId }) => ({ ...state, member: { ...state.member, idNumber: nationalId } })),
    on(actions.updatePolicyNum, (state, { policyNo }) => ({ ...state, member: { ...state.member, policyNumber: policyNo } })),
    on(actions.updateApprovalNum, (state, { approvalNo }) => ({ ...state, claimIdentities: { ...state.claimIdentities, approvalNumber: approvalNo } })),
    on(actions.updatePhysicianId, (state, { physicianId }) => ({ ...state, caseInformation:{...state.caseInformation,physician:{...state.caseInformation.physician,physicianID:physicianId}} })),
    on(actions.updatePhysicianName, (state, { physicianName }) => ({ ...state, caseInformation:{...state.caseInformation,physician:{...state.caseInformation.physician,physicianName:physicianName}} })),
);

export function claimReducer(state, action) {
    return _claimReducer(state, action);
}

export const claimSelector = createFeatureSelector<Claim>('claim');
export const getClaim = createSelector(claimSelector, (claim) => claim);
