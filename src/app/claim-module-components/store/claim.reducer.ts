import { createReducer, on } from '@ngrx/store';
import { Claim } from '../models/claim.model';

export const claim: Claim = null;

const _claimReducer = createReducer(claim);

export const claimReducer = (state, action) => _claimReducer(state, action);