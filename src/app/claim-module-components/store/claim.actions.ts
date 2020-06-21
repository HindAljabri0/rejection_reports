import { createAction, props } from '@ngrx/store';

export const startCreatingNewClaim = createAction('[ Claim ] start creating new claim', props<{ caseType: string }>());
export const loadLOVs = createAction('[ Claim ] start loading LOVs from backend');
export const setLOVs = createAction('[ Claim ] set LOVs object from backend', props<{LOVs:any}>());
export const setError = createAction('[ Claim ] set error', props<{error:any}>());

export const updatePatientName = createAction('[ Claim Patient Info ] update full name', props<{ name: string }>());
export const updatePatientGender = createAction('[ Claim Patient Info ] update gender', props<{ gender: 'M' | 'F' }>());
export const updatePayer = createAction('[ Claim Patient Info ] update payer', props<{ payerId: number }>());
export const updatePatientMemberId = createAction('[ Claim Patient Info ] update patient member id', props<{ memberId: string }>());
export const updateNationalId = createAction('[ Claim Patient Info ] update national id', props<{ nationalId : string }>());
export const updatePolicyNum = createAction('[ Claim Patient Info ] update policy no', props<{ policyNo : string }>());
export const updateApprovalNum = createAction('[ Claim Patient Info ] update approval no', props<{ approvalNo : string }>());
export const updatePhysicianId = createAction('[ Claim Physician Info ] update Physician Id', props<{ physicianId: string }>());
export const updatePhysicianName = createAction('[ Claim Physician Info ] update Physician name', props<{ physicianName: string }>());