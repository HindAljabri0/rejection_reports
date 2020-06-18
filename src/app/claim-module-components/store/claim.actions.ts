import { createAction, props } from '@ngrx/store';

export const startCreatingNewClaim = createAction('[ Claim ] start creating new claim', props<{caseType:string}>())