import { createAction, props } from '@ngrx/store';
import { Diagnosis } from '../models/diagnosis.model';
import { Claim } from '../models/claim.model';
import { Period } from '../models/period.type';
import { FieldError } from './claim.reducer';
import { Invoice } from '../models/invoice.model';
import { ApprovalFormData } from '../dialogs/create-by-approval-form/create-by-approval-form.data';
import { Service } from '../models/service.model';
import { SelectServiceDialogData } from '../dialogs/select-service-dialog/select-service-dialog-data';
import { ServiceDecision } from '../models/serviceDecision.model';
import { OnSavingDoneDialogData } from '../dialogs/on-saving-done/on-saving-done.data';

export const retrieveClaim = createAction('[ Claim ] retrieve claim to view/edit', props<{ claimId: string }>());
export const viewRetrievedClaim = createAction('[ Claim ] view retrieved claim', props<any>());
export const openCreateByApprovalDialog = createAction('[ Claim ] open a dialog retrieve claim data by approval number', props<ApprovalFormData>());
export const getClaimDataByApproval = createAction('[ Claim ] start retrieving claim data', props<{ approvalNumber: string, payerId: string, claimType: string, providerClaimNumber: string }>())
export const startCreatingNewClaim = createAction('[ Claim ] start creating new claim', props<{ data: { claimType: string, providerClaimNumber: string } | { claim: Claim, services: { service: Service, decision: ServiceDecision, used: boolean }[] } }>());
export const setLoading = createAction('[ Claim ] set if claim module is loading', props<{ loading: boolean }>())
export const loadLOVs = createAction('[ Claim ] start loading LOVs from backend');
export const setLOVs = createAction('[ Claim ] set LOVs object from backend', props<{ LOVs: any }>());
export const setError = createAction('[ Claim ] set error', props<{ error: any }>());
export const getUploadId = createAction('[ Claim ] get this month upload ID', props<{ providerId: string }>());
export const setUploadId = createAction('[ Claim ] set upload id', props<{ id: any }>());
export const saveClaim = createAction('[ Claim ] save the claim');
export const showOnSaveDoneDialog = createAction('[ Claim ] show message dialog after saving is done', props<OnSavingDoneDialogData>());
export const viewThisMonthClaims = createAction('[ Claim ] view this month claims', props<{ uploadId: number, claimId?: string, editMode?: boolean }>());
export const cancelClaim = createAction('[ Claim ] cancel');
export const startValidatingClaim = createAction('[ Claim ] start claim validation');
export const addClaimErrors = createAction('[ Claim ] add errors', props<{ module: string, errors: FieldError[] }>());
export const changeSelectedTab = createAction('[ Claim ] change selected tab', props<{ tab: number }>());
//Patient
export const updatePatientName = createAction('[ Claim Patient Info ] update full name', props<{ name: string }>());
export const updatePatientGender = createAction('[ Claim Patient Info ] update gender', props<{ gender: string }>());
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
export const updateCaseType = createAction('[ Claim Type ] update case type', props<{ caseType: string }>());
export const updateFileNumber = createAction('[ File Number ] update File Number', props<{ fileNumber: string }>());
export const updateMemberDob = createAction('[ Member DOB ] update member dob', props<{ memberDob: Date }>());
export const updateIllnessDuration = createAction('[ Illness Duration ] update illness duration', props<{ illnessDuration: any }>());
export const updateAge = createAction('[ Age ] update age', props<{ age: any }>());
export const updateMainSymptoms = createAction('[ mainSymptoms ] update mainSymptoms', props<{ symptoms: string }>())

//Invoices&Services
export const saveInvoices_Services = createAction('[ Invoice & Services ] this will force invoice/services component to dispatch updateInvoices_services action');
export const updateInvoices_Services = createAction('[ Invoices & Services ] update invoices & services', props<{ invoices: Invoice[] }>());
export const openSelectServiceDialog = createAction('[ Invoices & Services ] open a dialog to select a retreived service', props<SelectServiceDialogData>());
export const addRetrievedServices = createAction('[ Invoices & Services ] add retrieved services to invoice', props<{ services: { service: Service, decision: ServiceDecision }[], invoiceIndex: number, serviceIndex?: number }>());
export const makeRetrievedServiceUnused = createAction('[ Invoices & Services ] make retrieved service unused', props<{ serviceNumber: number }>());

export const selectGDPN = createAction('[ Auto Calc ] switch between claim, invoice & service calc', props<{ invoiceIndex?: number }>());