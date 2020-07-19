import { createAction, props } from '@ngrx/store';
import { Diagnosis } from '../models/diagnosis.model';
import { Claim } from '../models/claim.model';
import { Period } from '../models/period.type';
import { FieldError } from './claim.reducer';
import { Invoice } from '../models/invoice.model';

export const startCreatingNewClaim = createAction('[ Claim ] start creating new claim', props<{ claimType: string, providerClaimNumber: string }>());
export const setLoading = createAction('[ Claim ] set if claim module is loading', props<{ loading: boolean }>())
export const loadLOVs = createAction('[ Claim ] start loading LOVs from backend');
export const setLOVs = createAction('[ Claim ] set LOVs object from backend', props<{ LOVs: any }>());
export const setError = createAction('[ Claim ] set error', props<{ error: any }>());
export const getUploadId = createAction('[ Claim ] get this month upload ID', props<{ providerId: string }>());
export const setUploadId = createAction('[ Claim ] set upload id', props<{ id: any }>());
export const saveClaim = createAction('[ Claim ] save the claim');
export const viewThisMonthClaims = createAction('[ Claim ] view this month claims', props<{ uploadId: number }>());
export const cancelClaim = createAction('[ Claim ] cancel');
export const startValidatingClaim = createAction('[ Claim ] start claim validation');
export const addClaimErrors = createAction('[ Claim ] add errors', props<{ module: string, errors: FieldError[] }>());
export const changeSelectedTab = createAction('[ Claim ] change selected tab', props<{ tab: number }>());
//Patient
export const updatePatientName = createAction('[ Claim Patient Info ] update full name', props<{ name: string }>());
export const updatePatientGender = createAction('[ Claim Patient Info ] update gender', props<{ gender: 'M' | 'F' }>());
export const updatePayer = createAction('[ Claim Patient Info ] update payer', props<{ payerId: number }>());
export const updateVisitType = createAction('[ Claim Patient Info ] update visit type', props<{ visitType: string }>());
export const updateNationality = createAction('[ Claim Patient Info ] update Nationality', props<{ nationality: string }>());
export const updatePatientMemberId = createAction('[ Claim Patient Info ] update patient member id', props<{ memberId: string }>());
export const updateNationalId = createAction('[ Claim Patient Info ] update national id', props<{ nationalId: string }>());
export const updatePolicyNum = createAction('[ Claim Patient Info ] update policy no', props<{ policyNo: string }>());
export const updateApprovalNum = createAction('[ Claim Patient Info ] update approval no', props<{ approvalNo: string }>());
//Physician
export const updatePhysicianId = createAction('[ Claim Physician Info ] update Physician Id', props<{ physicianId: string }>());
export const updatePhysicianName = createAction('[ Claim Physician Info ] update Physician name', props<{ physicianName: string }>());
export const updatePhysicianCategory = createAction('[ Claim Physician Info ] update physician category', props<{ physicianCategory: string }>());
export const updateDepartment = createAction('[ Claim Physician Info ] update department', props<{ department: string }>());

export const updateDiagnosisList = createAction('[ Claim Diagnosis List] update list', props<{ list: Diagnosis[] }>());

export const updateIllnesses = createAction('[ Claim Illnesses ] update illnesses', props<{ list: string[] }>());

//GenInfo
export const updateClaimDate = createAction('[ Claim Date ] update claim date', props<{ claimDate: Date }>());
export const updateClaimType = createAction('[ Claim Type ] update claim type', props<{ claimType: string }>());
export const updateFileNumber = createAction('[ File Number ] update File Number', props<{ fileNumber: string }>());
export const updateMemberDob = createAction('[ Member DOB ] update member dob', props<{ memberDob: Date }>());
export const updateIllnessDuration = createAction('[ Illness Duration ] update illness duration', props<{ illnessDuration: any }>());
export const updateAge = createAction('[ Age ] update age', props<{ age: any }>());
export const updateMainSymptoms = createAction('[ mainSymptoms ] update mainSymptoms', props<{ symptoms: string }>())

//Invoices&Services
export const saveInvoices_Services = createAction('[ Invoice & Services ] this will force invoice/services component to dispatch updateInvoices_services action');
export const updateInvoices_Services = createAction('[ Invoices & Services ] update invoices & services', props<{ invoices: Invoice[] }>());

export const selectGDPN = createAction('[ Auto Calc ] switch between claim, invoice & service calc', props<{ invoiceIndex?: number, serviceIndex?: number }>());