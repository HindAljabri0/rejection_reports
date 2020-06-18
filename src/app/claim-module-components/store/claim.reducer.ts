import { createReducer, on } from '@ngrx/store';

export const claim = {};

const _claimReducer = createReducer(claim);

export const claimReducer = (state, action) => _claimReducer(state, action);