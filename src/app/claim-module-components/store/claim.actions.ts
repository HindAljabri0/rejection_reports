import { createAction, props } from '@ngrx/store';
import { Diagnosis } from '../models/diagnosis.model';
import { Claim } from '../models/claim.model';
import { Period } from '../models/period.type';
import { ClaimPageType, FieldError } from './claim.reducer';
import { Invoice } from '../models/invoice.model';
import { ApprovalFormData } from '../dialogs/create-by-approval-form/create-by-approval-form.data';
import { Service } from '../models/service.model';
import { SelectServiceDialogData } from '../dialogs/select-service-dialog/select-service-dialog-data';
import { ServiceDecision } from '../models/serviceDecision.model';
import { OnSavingDoneDialogData } from '../dialogs/on-saving-done/on-saving-done.data';
import { AttachmentRequest } from '../models/attachmentRequest.model';
import { Investigation } from '../models/investigation.model';

export const retrieveClaim = createAction('[ Claim ] retrieve claim to view/edit', props<{ claimId: string, edit: boolean }>());
export const viewRetrievedClaim = createAction('[ Claim ] view retrieved claim', props<any>());
export const openCreateByApprovalDialog = createAction('[ Claim ] open a dialog retrieve claim data by approval number',
  props<ApprovalFormData>());


export const getClaimDataByApproval = createAction('[ Claim ] start retrieving claim data', props<{
  approvalNumber: string,
  payerId: string,
  claimType: string,
  providerClaimNumber: string
}>());
export const startCreatingNewClaim = createAction('[ Claim ] start creating new claim',
  props<{
    data: {
      claimType: string,
      providerClaimNumber: string
    } | {
      claim: Claim,
      services: {
        service: Service,
        decision: ServiceDecision,
        used: boolean
      }[]
    }
  }>());
export const setLoading = createAction('[ Claim ] set if claim module is loading', props<{ loading: boolean }>());
export const loadLOVs = createAction('[ Claim ] start loading LOVs from backend');
export const setLOVs = createAction('[ Claim ] set LOVs object from backend', props<{ LOVs: any }>());
export const setError = createAction('[ Claim ] set error', props<{ error: any }>());
export const getUploadId = createAction('[ Claim ] get this month upload ID', props<{ providerId: string }>());
export const setUploadId = createAction('[ Claim ] set upload id', props<{ id: any }>());
export const saveClaim = createAction('[ Claim ] save the claim');
export const saveClaimChanges = createAction('[ Claim ] update the claim');
export const showOnSaveDoneDialog = createAction('[ Claim ] show message dialog after saving is done', props<OnSavingDoneDialogData>());
export const viewThisMonthClaims = createAction('[ Claim ] view this month claims',
  props<{
    uploadId: number,
    claimId?: string,
    editMode?: boolean
  }>());
export const cancelClaim = createAction('[ Claim ] cancel');
export const startValidatingClaim = createAction('[ Claim ] start claim validation');
export const finishValidation = createAction('[ Claim ] finishValidation');
export const addClaimErrors = createAction('[ Claim ] add errors', props<{ module: string, errors: FieldError[] }>());
export const changeSelectedTab = createAction('[ Claim ] change selected tab', props<{ tab: string }>());
export const toEditMode = createAction('[ Claim ] change page mode to edit');
export const cancelEdit = createAction('[ Claim ] cancel editing');
export const goToClaim = createAction('[ CLaim ] go to claim', props<{ claimId: string }>());
// Patient
export const updatePatientName = createAction('[ Claim Patient Info ] update full name', props<{ name: string }>());
export const updatePatientGender = createAction('[ Claim Patient Info ] update gender', props<{ gender: string }>());
export const updatePayer = createAction('[ Claim Patient Info ] update payer', props<{ payerId: number }>());
export const updateVisitType = createAction('[ Claim Patient Info ] update visit type', props<{ visitType: string }>());
export const updateNationality = createAction('[ Claim Patient Info ] update Nationality', props<{ nationality: string }>());
export const updatePatientMemberId = createAction('[ Claim Patient Info ] update patient member id', props<{ memberId: string }>());
export const updateAccCode = createAction('[ Claim Patient Info ] update patient account code', props<{ accCode: string }>());
export const updateNationalId = createAction('[ Claim Patient Info ] update national id', props<{ nationalId: string }>());
export const updatePolicyNum = createAction('[ Claim Patient Info ] update policy no', props<{ policyNo: string }>());
export const updateApprovalNum = createAction('[ Claim Patient Info ] update approval no', props<{ approvalNo: string }>());
export const updatePlanType = createAction('[ Claim Patient Info ] upldate plan type', props<{ planType: string }>());
// Physician
export const updatePhysicianId = createAction('[ Claim Physician Info ] update Physician Id', props<{ physicianId: string }>());
export const updatePhysicianName = createAction('[ Claim Physician Info ] update Physician name', props<{ physicianName: string }>());
export const updatePhysicianCategory = createAction('[ Claim Physician Info ] update physician category',
  props<{ physicianCategory: string }>());
export const updateDepartment = createAction('[ Claim Physician Info ] update department', props<{ department: string }>());
export const updatePageType = createAction('[ Claim Physician Info ] update page type', props<{ pageType: ClaimPageType }>());

export const updateDiagnosisList = createAction('[ Claim Diagnosis List] update list', props<{ list: Diagnosis[] }>());

export const updateIllnesses = createAction('[ Claim Illnesses ] update illnesses', props<{ list: string[] }>());

// GenInfo
export const updateClaimDate = createAction('[ Claim Gen Info ] update claim date', props<{ claimDate: Date }>());
export const updateCaseType = createAction('[ Claim Gen Info ] update case type', props<{ caseType: string }>());
export const updateFileNumber = createAction('[ Claim Gen Info ] update File Number', props<{ fileNumber: string }>());
export const updateMemberDob = createAction('[ Claim Gen Info ] update member dob', props<{ memberDob: Date }>());
export const updateIllnessDuration = createAction('[ Claim Gen Info ] update illness duration', props<{ illnessDuration: any }>());
export const updateAge = createAction('[ Claim Gen Info ] update age', props<{ age: any }>());
export const updateMainSymptoms = createAction('[ Claim Gen Info ] update mainSymptoms', props<{ symptoms: string }>());
export const updateSignificantSign = createAction('[ Claim Gen Info ] update significant Sign', props<{ sign: string }>());
export const updateCommReport = createAction('[ Claim Gen Info ] update comm report', props<{ report: string }>());
export const updateEligibilityNum = createAction('[ Claim Gen Info ] update eligibility number', props<{ number: string }>());
export const updateRadiologyReport = createAction('[ Claim Gen Info ] update radiology report', props<{ report: string }>());
export const updateOtherCondition = createAction('[ Claim Gen Info ] update other condition', props<{ condition: string }>());
export const updateContactNumber = createAction('[ Claim Gen Info ] update Contact Number', props<{ contactNumber: string }>());

// Vital Signs
export const updateTemperature = createAction('[ Vital Signs ] update Temperature', props<{ temperature: number }>());
export const updateBloodPressure = createAction('[ Vital Signs ] update Blood Pressure', props<{ pressure: string }>());
export const updatePulse = createAction('[ Vital Signs ] update Pulse', props<{ pulse: number }>());
export const updateRespiratoryRate = createAction('[ Vital Signs ] update Respiratory Rate', props<{ rate: number }>());
export const updateWeight = createAction('[ Vital Signs ] update Weight', props<{ weight: number }>());
export const updateHeight = createAction('[ Vital Signs ] update Height', props<{ height: number }>());
export const updateLastMenstruationPeriod = createAction('[ Vital Signs ] update Last Menstruation Period', props<{ period: Date }>());

// Admission
export const updateAdmissionDate = createAction('[ Admission ] update Admission Date', props<{ date: Date }>());
export const updateDischargeDate = createAction('[ Admission ] update Discharge Date', props<{ date: Date }>());
export const updateLengthOfStay = createAction('[ Admission ] update Length Of Stay', props<{ length: Period }>());
export const updateRoomNumber = createAction('[ Admission ] update Room Number', props<{ number: string }>());
export const updateBedNumber = createAction('[ Admission ] update Bed Number', props<{ number: string }>());

// attachments
export const updateCurrentAttachments = createAction('[ Attachments ] update current attachments',
  props<{ attachments: AttachmentRequest[] }>());

// LAB Results
export const saveLabResults = createAction('[ LAB Results ] this will force lab results & components to dispatch updateLabResults action');
export const updateLabResults = createAction('[ LAB Results ] update LAB Results', props<{ investigations: Investigation[] }>());

// Invoices&Services
export const saveInvoices_Services =
  createAction('[ Invoice & Services ] this will force invoice/services component to dispatch updateInvoices_services action');
export const updateInvoices_Services = createAction('[ Invoices & Services ] update invoices & services',
  props<{ invoices: Invoice[] }>());
export const openSelectServiceDialog = createAction('[ Invoices & Services ] open a dialog to select a retrieved service',
  props<SelectServiceDialogData>());
export const addRetrievedServices = createAction('[ Invoices & Services ] add retrieved services to invoice',
  props<{ services: { service: Service, decision: ServiceDecision }[], invoiceIndex: number, serviceIndex?: number }>());
export const makeRetrievedServiceUnused = createAction('[ Invoices & Services ] make retrieved service unused',
  props<{ serviceNumber: number }>());

export const selectGDPN = createAction('[ Auto Calc ] switch between claim, invoice & service calc', props<{ invoiceIndex?: number }>());
// export const PBMErrorWithStatus = createAction('[ Auto Calc ] Claim Error with status', props<{ invoiceIndex?: number }>());
export const removeDiagonsisError = createAction('[ Claim ] remove diagonsis errors', props<{ errors: FieldError[] }>());