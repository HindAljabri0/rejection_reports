import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as actions from './claim.actions';
import { Claim } from '../models/claim.model';
import { CaseInfo } from '../models/caseInfo.model';

export const claim: Claim = null;

const _claimReducer = createReducer(
    claim,
    on(actions.startCreatingNewClaim, (state, {caseType}) => {
        let claim = new Claim();
        claim.caseInformation = new CaseInfo();
        claim.caseInformation.caseType = caseType;
        return claim;
    })
);

export const claimReducer = (state, action) => _claimReducer(state, action);

export const claimSelector = createFeatureSelector<Claim>('claim');
export const getClaim = createSelector(claimSelector, (claim) => claim);
