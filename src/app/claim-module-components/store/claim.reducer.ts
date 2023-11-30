import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as actions from './claim.actions';
import { Claim } from '../models/claim.model';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { GDPN } from '../models/GDPN.model';
import { Service } from '../models/service.model';
import { ServiceDecision } from '../models/serviceDecision.model';
import { RetrievedClaimProps } from '../models/retrievedClaimProps.model';
import { FileType } from '../models/attachmentRequest.model';
import { SEARCH_TAB_RESULTS_KEY } from 'src/app/services/shared.services';

export type ClaimPageMode = 'CREATE' | 'CREATE_FROM_RETRIEVED' | 'VIEW' | 'EDIT';
export type ClaimPageType = 'DENTAL_OPTICAL_PHARMACY' | 'INPATIENT_OUTPATIENT';
export interface ClaimState {
    claim: Claim;
    retrievedClaimId: string;
    retrievedClaimProps: RetrievedClaimProps;
    newAttachments: { src: string | ArrayBuffer, name: string, fileType: FileType }[];
    claimBeforeEdit: Claim;
    claimPropsBeforeEdit: RetrievedClaimProps;
    retrievedServices: { service: Service, decision: ServiceDecision, used: boolean }[];
    claimErrors: {
        uncategorised: FieldError[],
        genInfoErrors: FieldError[],
        admissionErrors: FieldError[],
        invoicesErrors: FieldError[],
        vitalSignsErrors: FieldError[],
        diagnosisErrors: FieldError[],
        illnessErrors: FieldError[],
        labResultsErrors: FieldError[]
    };
    LOVs: { Departments: any[], IllnessCode: any[], VisitType: any[], PhysicianCategory: any[] };
    error: any;
    loading: boolean;
    selectedTab: string;
    selectedGDPN: { invoiceIndex?: number };
    approvalFormLoading: boolean;
    mode: ClaimPageMode;
    type: ClaimPageType;
    paginationControl: { currentIndex: number, size: number, searchTabCurrentResults: number[]; };
    pbmClaimError: [];
    pbmClaimStatus: string;

}

const initState: ClaimState = {
    claim: null,
    retrievedClaimId: null,
    retrievedClaimProps: null,
    newAttachments: [],
    claimBeforeEdit: null,
    claimPropsBeforeEdit: null,
    retrievedServices: [],
    claimErrors: {
        diagnosisErrors: [],
        genInfoErrors: [],
        invoicesErrors: [],
        admissionErrors: [],
        vitalSignsErrors: [],
        illnessErrors: [],
        uncategorised: [],
        labResultsErrors: []
    },
    LOVs: { Departments: [], IllnessCode: [], VisitType: [], PhysicianCategory: [] },
    error: null,
    loading: true,
    selectedTab: 'GENERAL_INFORMATION',
    selectedGDPN: {},
    approvalFormLoading: false,
    mode: 'CREATE',
    type: 'DENTAL_OPTICAL_PHARMACY',
    paginationControl: { searchTabCurrentResults: [], currentIndex: -1, size: 0 },
    pbmClaimError: [],
    pbmClaimStatus: ''
};

const _claimReducer = createReducer(
    initState,
    on(actions.retrieveClaim,
        (state, { edit, claimId }) => ({
            ...state, mode: (edit ? 'EDIT' : 'VIEW'),
            loading: true, retrievedClaimId: claimId
        })),
    on(actions.viewRetrievedClaim, (state, response) => {
        const body = response.body;
        const dentalId = '4';
        const opticalId = '50';
        const pharmacyId = '68';
        const departmentCode = body['claim']['visitInformation']['departmentCode'];
        const caseType = body['claim']['caseInformation']['caseType'];
        const type: ClaimPageType = caseType == 'OUTPATIENT' &&
            (departmentCode == dentalId ||
                departmentCode == opticalId ||
                departmentCode == pharmacyId) ? 'DENTAL_OPTICAL_PHARMACY' : 'INPATIENT_OUTPATIENT';
        const props: RetrievedClaimProps = {

            claimDecisionGDPN: body['claimDecisionGDPN'],
            eligibilityCheck: body['eligibilityCheck'],
            lastSubmissionDate: body['lastSubmissionDate'],
            lastUpdateDate: body['lastUpdateDate'],
            paymentDate: body['paymentDate'],
            paymentReference: body['paymentReference'],
            statusCode: body['statusCode'],
            statusDetail: body['statusDetail'],
            payerbatchrefno: body['payerbatchrefno'],
            payerclaimrefno: body['payerclaimrefno']

        };
        const editable = state.mode == 'EDIT' &&
            ['Downloadable', 'Accepted', 'NotAccepted', 'Failed', 'INVALID'].includes(props.statusCode);
        const storedSearchTabResults = localStorage.getItem(SEARCH_TAB_RESULTS_KEY);
        let searchTabResults: number[] = [...state.paginationControl.searchTabCurrentResults];
        let currentIndex = state.paginationControl.currentIndex;
        if (storedSearchTabResults != null) {
            const storedSplitted = storedSearchTabResults.split(',');
            try {
                storedSplitted.forEach(id => searchTabResults.push(Number.parseInt(id, 10)));
                if (state.paginationControl.searchTabCurrentResults.length > 0) {
                    searchTabResults = [...state.paginationControl.searchTabCurrentResults];
                }
                currentIndex = searchTabResults.findIndex(id => state.retrievedClaimId == `${id}`);
                if (currentIndex == -1) {
                    searchTabResults.unshift(Number.parseInt(state.retrievedClaimId, 10));
                    currentIndex = 0;
                }
            } catch (e) { console.log(e); }
        }
        return ({
            ...state, claim: Claim.fromViewResponse(body['claim']),
            type,
            retrievedClaimProps: props,
            loading: false,
            claimBeforeEdit: (editable ? Claim.fromViewResponse(body['claim']) : null),
            claimPropsBeforeEdit: (editable ? props : null),
            mode: (editable ? 'EDIT' : 'VIEW'),
            paginationControl: {
                searchTabCurrentResults: searchTabResults,
                currentIndex,
                size: searchTabResults.length
            },
            claimErrors: body['errors'],
            pbmClaimError: body['pbmClaimError'],
            pbmClaimStatus: body['pbmClaimStatus']
        });
    }),
    on(actions.toEditMode, (state) => ({
        ...state,
        mode: 'EDIT',
        claimBeforeEdit: state.claim,
        claimPropsBeforeEdit: state.retrievedClaimProps
    })),
    on(actions.cancelEdit, (state) => ({
        ...state,
        newAttachments: [],
        claim: state.claimBeforeEdit,
        retrievedClaimProps: state.claimPropsBeforeEdit,
        claimBeforeEdit: null,
        claimPropsBeforeEdit: null,
        mode: 'VIEW'
    })),
    on(actions.toCreateMode, (state) => ({
        ...state,
        mode: 'CREATE',
        claimBeforeEdit: null,
        claimPropsBeforeEdit: null,
        newAttachments: [],
        claim: null,
        retrievedClaimProps: null
    })),
    on(actions.getClaimDataByApproval, (state) => ({ ...state, approvalFormLoading: true })),
    on(actions.startCreatingNewClaim, (state, { data }) => {
        if (data.hasOwnProperty('claim')) {
            return {
                ...state, claim: data['claim'],
                retrievedServices: data['services'],
                approvalFormLoading: false,
                mode: 'CREATE_FROM_RETRIEVED'
            };
        } else {
            const claim = new Claim(data['claimType'], data['providerClaimNumber']);
            return {
                ...state, claim, mode: 'CREATE', type: (data['claimType'] === 'INPATIENT'
                    || data['claimType'] === 'OUTPATIENT') ? 'INPATIENT_OUTPATIENT' : 'DENTAL_OPTICAL_PHARMACY'
            };
        }
    }),
    on(actions.loadLOVs, (state) => ({ ...state, loading: true })),
    on(actions.setLOVs, (state, { LOVs }) => ({
        ...state,
        LOVs: extractFromHttpResponse(LOVs),
        loading: state.mode == 'CREATE' ? false : state.loading
    })),
    on(actions.setLoading, (state, { loading }) => ({ ...state, loading })),
    on(actions.setUploadId, (state, { id }) => ({
        ...state, claim: {
            ...state.claim,
            claimIdentities: {
                ...state.claim.claimIdentities,
                uploadID: extractFromHttpResponse(id)
            }
        }
    })),
    on(actions.setError, (state, { error }) => ({ ...state, error, loading: false, approvalFormLoading: false })),
    on(actions.cancelClaim, (state) => ({ ...initState, loading: false, LOVs: state.LOVs })),
    on(actions.changeSelectedTab, (state, { tab }) => ({ ...state, selectedTab: tab })),
    on(actions.addClaimErrors, (state, { module, errors }) => {
        let claimErrors = initState.claimErrors;
        switch (module) {
            case 'genInfoErrors':
                claimErrors = { ...state.claimErrors, genInfoErrors: errors };
                break;
            case 'invoiceErrors':
                claimErrors = { ...state.claimErrors, invoicesErrors: errors };
                break;
            case 'illnessErrors':
                claimErrors = { ...state.claimErrors, illnessErrors: errors };
                break;
        }
        return { ...state, claimErrors };
    }),
    on(actions.updatePatientName, (state, { name }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                patient: { ...state.claim.caseInformation.patient, fullName: name }
            }
        }
    })),
    on(actions.updatePatientGender, (state, { gender }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                patient: { ...state.claim.caseInformation.patient, gender }
            }
        }
    })),
    on(actions.updatePayer, (state, { payerId }) => ({
        ...state, claim: {
            ...state.claim,
            claimIdentities: {
                ...state.claim.claimIdentities,
                payerID: `${payerId}`
            }
        }
    })),
    on(actions.updateVisitType, (state, { visitType }) => ({
        ...state, claim: {
            ...state.claim,
            visitInformation: {
                ...state.claim.visitInformation,
                visitType
            }
        }
    })),
    on(actions.updateNationality, (state, { nationality }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                patient: { ...state.claim.caseInformation.patient, nationality }
            }
        }
    })),
    on(actions.updatePatientMemberId, (state, { memberId }) => ({
        ...state, claim: {
            ...state.claim,
            member: {
                ...state.claim.member,
                memberID: memberId
            }
        }
    })),
    on(actions.updateAccCode, (state, { accCode }) => ({
        ...state, claim: {
            ...state.claim,
            member: {
                ...state.claim.member,
                accCode
            }
        }
    })),
    on(actions.updateNationalId, (state, { nationalId }) => ({
        ...state, claim: {
            ...state.claim,
            member: {
                ...state.claim.member,
                idNumber: nationalId
            }
        }
    })),
    on(actions.updatePolicyNum, (state, { policyNo }) => ({
        ...state, claim: {
            ...state.claim,
            member: {
                ...state.claim.member,
                policyNumber: policyNo
            }
        }
    })),
    on(actions.updateApprovalNum, (state, { approvalNo }) => ({
        ...state, claim: {
            ...state.claim,
            claimIdentities: {
                ...state.claim.claimIdentities,
                approvalNumber: approvalNo
            }
        }
    })),
    on(actions.updatePlanType, (state, { planType }) => ({
        ...state, claim: {
            ...state.claim,
            member: {
                ...state.claim.member,
                planType
            }
        }
    })),

    on(actions.updatePhysicianId, (state, { physicianId }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                physician: { ...state.claim.caseInformation.physician, physicianID: physicianId }
            }
        }
    })),
    on(actions.updatePhysicianName, (state, { physicianName }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                physician: { ...state.claim.caseInformation.physician, physicianName }
            }
        }
    })),
    on(actions.updatePhysicianCategory, (state, { physicianCategory }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                physician: { ...state.claim.caseInformation.physician, physicianCategory }
            }
        }
    })),
    on(actions.updateDepartment, (state, { department }) => ({
        ...state, claim: {
            ...state.claim,
            visitInformation: {
                ...state.claim.visitInformation,
                departmentCode: department
            }
        },
        claimErrors: {
            ...state.claimErrors,
            genInfoErrors: [...state.claimErrors.genInfoErrors.filter(error => error.fieldName != 'DPARCODE')]
        }
    })),
    on(actions.updatePageType, (state, { pageType }) => ({ ...state, type: pageType })),

    on(actions.updateDiagnosisList, (state, { list }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: { ...state.claim.caseInformation.caseDescription, diagnosis: list }
            }
        }
    })),

    on(actions.updateIllnesses, (state, { list }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: {
                    ...state.claim.caseInformation.caseDescription,
                    illnessCategory: { inllnessCode: list }
                }
            }
        }
    })),

    on(actions.updateClaimDate, (state, { claimDate }) => ({
        ...state, claim: {
            ...state.claim,
            visitInformation: {
                ...state.claim.visitInformation,
                visitDate: claimDate
            }
        },
        claimErrors: {
            ...state.claimErrors,
            genInfoErrors: [...state.claimErrors.genInfoErrors.filter(error => error.fieldName != 'VSITDATE')]
        }
    })),
    on(actions.updateCaseType, (state, { caseType }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                caseType
            }
        }
    })),
    on(actions.updateFileNumber, (state, { fileNumber }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                patient: { ...state.claim.caseInformation.patient, patientFileNumber: fileNumber }
            }
        },
        claimErrors: {
            ...state.claimErrors,
            genInfoErrors: [...state.claimErrors.genInfoErrors.filter(error => error.fieldName != 'PATFILNO')]
        }
    })),
    on(actions.updateContactNumber, (state, { contactNumber }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                patient: { ...state.claim.caseInformation.patient, contactNumber: contactNumber }
            }
        },
        claimErrors: {
            ...state.claimErrors,
            genInfoErrors: [...state.claimErrors.genInfoErrors.filter(error => error.fieldName != 'CONTNUMBER')]
        }
    })),
    on(actions.updateMemberDob, (state, { memberDob }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                patient: { ...state.claim.caseInformation.patient, dob: memberDob }
            }
        }
    })),
    on(actions.updateIllnessDuration, (state, { illnessDuration }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: { ...state.claim.caseInformation.caseDescription, illnessDuration }
            }
        }
    })),
    on(actions.updateAge, (state, { age }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                patient: { ...state.claim.caseInformation.patient, age }
            }
        }
    })),
    on(actions.updateMainSymptoms, (state, { symptoms }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: { ...state.claim.caseInformation.caseDescription, chiefComplaintSymptoms: symptoms }
            }
        }
    })),
    on(actions.updateSignificantSign, (state, { sign }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: { ...state.claim.caseInformation.caseDescription, signicantSigns: sign }
            }
        }
    })),
    on(actions.updateCommReport, (state, { report }) => ({ ...state, claim: { ...state.claim, commreport: report } })),
    on(actions.updateEligibilityNum, (state, { number }) => ({
        ...state, claim: {
            ...state.claim,
            claimIdentities: {
                ...state.claim.claimIdentities,
                eligibilityNumber: number
            }
        }
    })),
    on(actions.updateRadiologyReport, (state, { report }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                radiologyReport: report
            }
        }
    })),
    on(actions.updateOtherCondition, (state, { condition }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                otherConditions: condition
            }
        }
    })),

    on(actions.updateTemperature, (state, { temperature }) => ({
        ...state, claim: {
            ...state.claim, caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: {
                    ...state.claim.caseInformation.caseDescription,
                    temperature
                }
            }
        }
    })),
    on(actions.updateBloodPressure, (state, { pressure }) => ({
        ...state, claim: {
            ...state.claim, caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: {
                    ...state.claim.caseInformation.caseDescription,
                    bloodPressure: pressure
                }
            }
        }
    })),
    on(actions.updatePulse, (state, { pulse }) => ({
        ...state, claim: {
            ...state.claim, caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: {
                    ...state.claim.caseInformation.caseDescription,
                    pulse
                }
            }
        }
    })),
    on(actions.updateRespiratoryRate, (state, { rate }) => ({
        ...state, claim: {
            ...state.claim, caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: {
                    ...state.claim.caseInformation.caseDescription,
                    respRate: rate
                }
            }
        }
    })),
    on(actions.updateWeight, (state, { weight }) => ({
        ...state, claim: {
            ...state.claim, caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: {
                    ...state.claim.caseInformation.caseDescription,
                    weight
                }
            }
        }
    })),
    on(actions.updateHeight, (state, { height }) => ({
        ...state, claim: {
            ...state.claim, caseInformation:
            {
                ...state.claim.caseInformation, caseDescription:
                    { ...state.claim.caseInformation.caseDescription, height }
            }
        }
    })),
    on(actions.updateLastMenstruationPeriod, (state, { period }) => ({
        ...state, claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: { ...state.claim.caseInformation.caseDescription, lmp: period }
            }
        }
    })),

    on(actions.updateAdmissionDate, (state, { date }) => ({
        ...state, claim: {
            ...state.claim,
            admission: {
                ...state.claim.admission,
                admissionDate: date
            }
        }
    })),
    on(actions.updateDischargeDate, (state, { date }) => ({
        ...state, claim: {
            ...state.claim,
            admission: {
                ...state.claim.admission,
                discharge: { ...state.claim.admission.discharge, dischargeDate: date }
            }
        }
    })),
    on(actions.updateLengthOfStay, (state, { length }) => ({
        ...state, claim: {
            ...state.claim,
            admission: {
                ...state.claim.admission,
                discharge: { ...state.claim.admission.discharge, actualLengthOfStay: length }
            }
        }
    })),
    on(actions.updateRoomNumber, (state, { number }) => ({
        ...state, claim: {
            ...state.claim,
            admission: {
                ...state.claim.admission,
                roomNumber: number
            }
        }
    })),
    on(actions.updateBedNumber, (state, { number }) => ({
        ...state, claim: {
            ...state.claim,
            admission: {
                ...state.claim.admission,
                bedNumber: number
            }
        }
    })),

    on(actions.updateCurrentAttachments, (state, { attachments }) => ({ ...state, claim: { ...state.claim, attachment: attachments } })),

    on(actions.updateLabResults, (state, { investigations }) => ({
        ...state,
        claim: {
            ...state.claim,
            caseInformation: {
                ...state.claim.caseInformation,
                caseDescription: { ...state.claim.caseInformation.caseDescription, investigation: investigations }
            }
        }
    })),

    on(actions.updateInvoices_Services, (state, { invoices, recalculateClaimGDPN }) => {
        let GDPN: GDPN;
        if (recalculateClaimGDPN) {
            GDPN = {
                discount: { value: invoices.map(invoice => (invoice.invoiceGDPN != null && invoice.invoiceGDPN.discount != null ? invoice.invoiceGDPN.discount.value : 0)).reduce((pre, cur) => pre + cur), type: 'SAR' },
                gross: { value: invoices.map(invoice => (invoice.invoiceGDPN.gross != null ? invoice.invoiceGDPN.gross.value : 0)).reduce((pre, cur) => pre + cur), type: 'SAR' },
                net: { value: invoices.map(invoice => (invoice.invoiceGDPN.net != null ? invoice.invoiceGDPN.net.value : 0)).reduce((pre, cur) => pre + cur), type: 'SAR' },
                netVATamount: {
                    value: invoices.map(invoice => (invoice.invoiceGDPN.netVATamount != null ? invoice.invoiceGDPN.netVATamount.value : 0)).reduce((pre, cur) => pre + cur),
                    type: 'SAR'
                },
                netVATrate: null,
                patientShare: {
                    value: invoices.map(invoice => (invoice.invoiceGDPN.patientShare != null ? invoice.invoiceGDPN.patientShare.value : 0)).reduce((pre, cur) => pre + cur),
                    type: 'SAR'
                },
                patientShareVATamount: {
                    value: invoices.map(invoice => (invoice.invoiceGDPN.patientShareVATamount != null ? invoice.invoiceGDPN.patientShareVATamount.value : 0)).reduce((pre, cur) => pre + cur),
                    type: 'SAR'
                },
                patientShareVATrate: null,
            };
        } else {
            GDPN = state.claim.claimGDPN;
        }
        return ({
            ...state, claim: { ...state.claim, invoice: invoices, claimGDPN: GDPN },
            claimErrors: {
                ...state.claimErrors,
                invoicesErrors: [...state.claimErrors.invoicesErrors.filter(error => error.fieldName != 'INVOICENUM')]
            }
        });
    }),
    on(actions.addRetrievedServices, (state, { services }) => ({
        ...state,
        retrievedServices: [...state.retrievedServices.filter(
            s => services.findIndex(ns => ns.service.serviceNumber == s.service.serviceNumber) == -1),
        ...services.map(s => ({
            service: s.service,
            decision: s.decision,
            used: true
        }))]
    })),
    on(actions.makeRetrievedServiceUnused,
        (state, { serviceNumber }) => ({
            ...state,
            retrievedServices: state.retrievedServices.map(s => s.service.serviceNumber == serviceNumber ? {
                ...s,
                used: false
            } : s)
        })),
    on(actions.selectGDPN, (state, { invoiceIndex }) => ({ ...state, selectedGDPN: { invoiceIndex } })),
    on(actions.removeDiagonsisError, (state, { errors }) => {
        let claimErrors = initState.claimErrors;
        claimErrors = { ...state.claimErrors, diagnosisErrors: errors };
        return { ...state, claimErrors };
    }),
);

export function claimReducer(state, action) {
    return _claimReducer(state, action);
}

export const claimSelector = createFeatureSelector<ClaimState>('claimState');
export const getPaginationControl = createSelector(claimSelector, (state) => state != null ? state.paginationControl : null);
export const getIsApprovalFormLoading = createSelector(claimSelector, (state) => state.approvalFormLoading);
export const getClaim = createSelector(claimSelector, (state) => state.claim);
export const getCaseType = createSelector(claimSelector, (state) => state.claim != null &&
    state.claim.caseInformation != null ? state.claim.caseInformation.caseType : null);
export const getDepartmentCode = createSelector(claimSelector, (state) => state.claim != null &&
    state.claim.visitInformation != null ? state.claim.visitInformation.departmentCode : null);
export const getSelectedPayer = createSelector(claimSelector, (state) => state.claim != null &&
    state.claim.claimIdentities != null ? state.claim.claimIdentities.payerID : null);
export const getVisitType = createSelector(claimSelector, (state) => state.LOVs.VisitType);
export const getVisitDate = createSelector(claimSelector, (state) => state.claim != null &&
    state.claim.visitInformation != null ? state.claim.visitInformation.visitDate : null);
export const getSelectedTab = createSelector(claimSelector, (state) => state.selectedTab);
export const getDepartments = createSelector(claimSelector, (state) => state.LOVs.Departments);
export const getIllnessCode = createSelector(claimSelector, (state) => state.LOVs.IllnessCode);
export const getPhysicianCategory = createSelector(claimSelector, (state) => state.LOVs.PhysicianCategory);
export const getClaimModuleError = createSelector(claimSelector, (state) => state.error);
export const getClaimModuleIsLoading = createSelector(claimSelector, (state) => state.loading);
export const getClaimObjectErrors = createSelector(claimSelector, (state) => state.claimErrors);

export const getDiagnosisErrors = createSelector(claimSelector, (state) => state.claimErrors.diagnosisErrors);
export const getGenInfoErrors = createSelector(claimSelector, (state) => state.claimErrors.genInfoErrors);
export const getAdmissionErrors = createSelector(claimSelector, (state) => state.claimErrors.admissionErrors);
export const getIllnessErrors = createSelector(claimSelector, (state) => state.claimErrors.illnessErrors);
export const getVitalSignsErrors = createSelector(claimSelector, (state) => state.claimErrors.vitalSignsErrors);


export const getInvoicesErrors = createSelector(claimSelector, (state) => state.claimErrors.invoicesErrors);
export const getAllErrors = createSelector(claimSelector, (state) => state.claimErrors);

export const getLabResultsErrors = createSelector(claimSelector, (state) => state.claimErrors.labResultsErrors);
export const getUncategorisedErrors = createSelector(claimSelector, (state) => state.claimErrors.uncategorised);
export const getSelectedGDPN = createSelector(claimSelector, (state) => state.selectedGDPN);
export const getRetrievedServices = createSelector(claimSelector, (state) => state.retrievedServices);
export const getPageMode = createSelector(claimSelector, (state) => state.mode);
export const getPageType = createSelector(claimSelector, (state) => state.type);
export const getRetrievedClaimId = createSelector(claimSelector, (state) => state.retrievedClaimId);
export const getRetrievedClaimProps = createSelector(claimSelector, (state) => state.retrievedClaimProps);
export const getPBMClaimError = createSelector(claimSelector, (state) => state.pbmClaimError);
export const getPBMClaimStatus = createSelector(claimSelector, (state) => state.pbmClaimStatus);




function extractFromHttpResponse(response: HttpEvent<any>) {
    if (response instanceof HttpResponse) {
        return response.body;
    }
}


export const nationalities: { Code: string, Name: string }[] = [
    { Code: 'SA', Name: 'Saudi Arabia' },
    { Code: 'AF', Name: 'Afghanistan' },
    { Code: 'AX', Name: '\u00c5land Islands' },
    { Code: 'AL', Name: 'Albania' },
    { Code: 'DZ', Name: 'Algeria' },
    { Code: 'AS', Name: 'American Samoa' },
    { Code: 'AD', Name: 'Andorra' },
    { Code: 'AO', Name: 'Angola' },
    { Code: 'AI', Name: 'Anguilla' },
    { Code: 'AQ', Name: 'Antarctica' },
    { Code: 'AG', Name: 'Antigua and Barbuda' },
    { Code: 'AR', Name: 'Argentina' },
    { Code: 'AM', Name: 'Armenia' },
    { Code: 'AW', Name: 'Aruba' },
    { Code: 'AU', Name: 'Australia' },
    { Code: 'AT', Name: 'Austria' },
    { Code: 'AZ', Name: 'Azerbaijan' },
    { Code: 'BS', Name: 'Bahamas' },
    { Code: 'BH', Name: 'Bahrain' },
    { Code: 'BD', Name: 'Bangladesh' },
    { Code: 'BB', Name: 'Barbados' },
    { Code: 'BY', Name: 'Belarus' },
    { Code: 'BE', Name: 'Belgium' },
    { Code: 'BZ', Name: 'Belize' },
    { Code: 'BJ', Name: 'Benin' },
    { Code: 'BM', Name: 'Bermuda' },
    { Code: 'BT', Name: 'Bhutan' },
    { Code: 'BO', Name: 'Bolivia, Plurinational State of' },
    { Code: 'BQ', Name: 'Bonaire, Sint Eustatius and Saba' },
    { Code: 'BA', Name: 'Bosnia and Herzegovina' },
    { Code: 'BW', Name: 'Botswana' },
    { Code: 'BV', Name: 'Bouvet Island' },
    { Code: 'BR', Name: 'Brazil' },
    { Code: 'IO', Name: 'British Indian Ocean Territory' },
    { Code: 'BN', Name: 'Brunei Darussalam' },
    { Code: 'BG', Name: 'Bulgaria' },
    { Code: 'BF', Name: 'Burkina Faso' },
    { Code: 'BI', Name: 'Burundi' },
    { Code: 'KH', Name: 'Cambodia' },
    { Code: 'CM', Name: 'Cameroon' },
    { Code: 'CA', Name: 'Canada' },
    { Code: 'CV', Name: 'Cape Verde' },
    { Code: 'KY', Name: 'Cayman Islands' },
    { Code: 'CF', Name: 'Central African Republic' },
    { Code: 'TD', Name: 'Chad' },
    { Code: 'CL', Name: 'Chile' },
    { Code: 'CN', Name: 'China' },
    { Code: 'CX', Name: 'Christmas Island' },
    { Code: 'CC', Name: 'Cocos (Keeling) Islands' },
    { Code: 'CO', Name: 'Colombia' },
    { Code: 'KM', Name: 'Comoros' },
    { Code: 'CG', Name: 'Congo' },
    { Code: 'CD', Name: 'Congo, the Democratic Republic of the' },
    { Code: 'CK', Name: 'Cook Islands' },
    { Code: 'CR', Name: 'Costa Rica' },
    { Code: 'CI', Name: 'C\u00f4te d\'Ivoire' },
    { Code: 'HR', Name: 'Croatia' },
    { Code: 'CU', Name: 'Cuba' },
    { Code: 'CW', Name: 'Cura\u00e7ao' },
    { Code: 'CY', Name: 'Cyprus' },
    { Code: 'CZ', Name: 'Czech Republic' },
    { Code: 'DK', Name: 'Denmark' },
    { Code: 'DJ', Name: 'Djibouti' },
    { Code: 'DM', Name: 'Dominica' },
    { Code: 'DO', Name: 'Dominican Republic' },
    { Code: 'EC', Name: 'Ecuador' },
    { Code: 'EG', Name: 'Egypt' },
    { Code: 'SV', Name: 'El Salvador' },
    { Code: 'GQ', Name: 'Equatorial Guinea' },
    { Code: 'ER', Name: 'Eritrea' },
    { Code: 'EE', Name: 'Estonia' },
    { Code: 'ET', Name: 'Ethiopia' },
    { Code: 'FK', Name: 'Falkland Islands (Malvinas)' },
    { Code: 'FO', Name: 'Faroe Islands' },
    { Code: 'FJ', Name: 'Fiji' },
    { Code: 'FI', Name: 'Finland' },
    { Code: 'FR', Name: 'France' },
    { Code: 'GF', Name: 'French Guiana' },
    { Code: 'PF', Name: 'French Polynesia' },
    { Code: 'TF', Name: 'French Southern Territories' },
    { Code: 'GA', Name: 'Gabon' },
    { Code: 'GM', Name: 'Gambia' },
    { Code: 'GE', Name: 'Georgia' },
    { Code: 'DE', Name: 'Germany' },
    { Code: 'GH', Name: 'Ghana' },
    { Code: 'GI', Name: 'Gibraltar' },
    { Code: 'GR', Name: 'Greece' },
    { Code: 'GL', Name: 'Greenland' },
    { Code: 'GD', Name: 'Grenada' },
    { Code: 'GP', Name: 'Guadeloupe' },
    { Code: 'GU', Name: 'Guam' },
    { Code: 'GT', Name: 'Guatemala' },
    { Code: 'GG', Name: 'Guernsey' },
    { Code: 'GN', Name: 'Guinea' },
    { Code: 'GW', Name: 'Guinea-Bissau' },
    { Code: 'GY', Name: 'Guyana' },
    { Code: 'HT', Name: 'Haiti' },
    { Code: 'HM', Name: 'Heard Island and McDonald Islands' },
    { Code: 'VA', Name: 'Holy See (Vatican City State)' },
    { Code: 'HN', Name: 'Honduras' },
    { Code: 'HK', Name: 'Hong Kong' },
    { Code: 'HU', Name: 'Hungary' },
    { Code: 'IS', Name: 'Iceland' },
    { Code: 'IN', Name: 'India' },
    { Code: 'ID', Name: 'Indonesia' },
    { Code: 'IR', Name: 'Iran, Islamic Republic of' },
    { Code: 'IQ', Name: 'Iraq' },
    { Code: 'IE', Name: 'Ireland' },
    { Code: 'IM', Name: 'Isle of Man' },
    { Code: 'IL', Name: 'Israel' },
    { Code: 'IT', Name: 'Italy' },
    { Code: 'JM', Name: 'Jamaica' },
    { Code: 'JP', Name: 'Japan' },
    { Code: 'JE', Name: 'Jersey' },
    { Code: 'JO', Name: 'Jordan' },
    { Code: 'KZ', Name: 'Kazakhstan' },
    { Code: 'KE', Name: 'Kenya' },
    { Code: 'KI', Name: 'Kiribati' },
    { Code: 'KP', Name: 'Korea, Democratic People\'s Republic of' },
    { Code: 'KR', Name: 'Korea, Republic of' },
    { Code: 'KW', Name: 'Kuwait' },
    { Code: 'KG', Name: 'Kyrgyzstan' },
    { Code: 'LA', Name: 'Lao People\'s Democratic Republic' },
    { Code: 'LV', Name: 'Latvia' },
    { Code: 'LB', Name: 'Lebanon' },
    { Code: 'LS', Name: 'Lesotho' },
    { Code: 'LR', Name: 'Liberia' },
    { Code: 'LY', Name: 'Libya' },
    { Code: 'LI', Name: 'Liechtenstein' },
    { Code: 'LT', Name: 'Lithuania' },
    { Code: 'LU', Name: 'Luxembourg' },
    { Code: 'MO', Name: 'Macao' },
    { Code: 'MK', Name: 'Macedonia, the Former Yugoslav Republic of' },
    { Code: 'MG', Name: 'Madagascar' },
    { Code: 'MW', Name: 'Malawi' },
    { Code: 'MY', Name: 'Malaysia' },
    { Code: 'MV', Name: 'Maldives' },
    { Code: 'ML', Name: 'Mali' },
    { Code: 'MT', Name: 'Malta' },
    { Code: 'MH', Name: 'Marshall Islands' },
    { Code: 'MQ', Name: 'Martinique' },
    { Code: 'MR', Name: 'Mauritania' },
    { Code: 'MU', Name: 'Mauritius' },
    { Code: 'YT', Name: 'Mayotte' },
    { Code: 'MX', Name: 'Mexico' },
    { Code: 'FM', Name: 'Micronesia, Federated States of' },
    { Code: 'MD', Name: 'Moldova, Republic of' },
    { Code: 'MC', Name: 'Monaco' },
    { Code: 'MN', Name: 'Mongolia' },
    { Code: 'ME', Name: 'Montenegro' },
    { Code: 'MS', Name: 'Montserrat' },
    { Code: 'MA', Name: 'Morocco' },
    { Code: 'MZ', Name: 'Mozambique' },
    { Code: 'MM', Name: 'Myanmar' },
    { Code: 'NA', Name: 'Namibia' },
    { Code: 'NR', Name: 'Nauru' },
    { Code: 'NP', Name: 'Nepal' },
    { Code: 'NL', Name: 'Netherlands' },
    { Code: 'NC', Name: 'New Caledonia' },
    { Code: 'NZ', Name: 'New Zealand' },
    { Code: 'NI', Name: 'Nicaragua' },
    { Code: 'NE', Name: 'Niger' },
    { Code: 'NG', Name: 'Nigeria' },
    { Code: 'NU', Name: 'Niue' },
    { Code: 'NF', Name: 'Norfolk Island' },
    { Code: 'MP', Name: 'Northern Mariana Islands' },
    { Code: 'NO', Name: 'Norway' },
    { Code: 'OM', Name: 'Oman' },
    { Code: 'PK', Name: 'Pakistan' },
    { Code: 'PW', Name: 'Palau' },
    { Code: 'PS', Name: 'Palestine, State of' },
    { Code: 'PA', Name: 'Panama' },
    { Code: 'PG', Name: 'Papua New Guinea' },
    { Code: 'PY', Name: 'Paraguay' },
    { Code: 'PE', Name: 'Peru' },
    { Code: 'PH', Name: 'Philippines' },
    { Code: 'PN', Name: 'Pitcairn' },
    { Code: 'PL', Name: 'Poland' },
    { Code: 'PT', Name: 'Portugal' },
    { Code: 'PR', Name: 'Puerto Rico' },
    { Code: 'QA', Name: 'Qatar' },
    { Code: 'RE', Name: 'R\u00e9union' },
    { Code: 'RO', Name: 'Romania' },
    { Code: 'RU', Name: 'Russian Federation' },
    { Code: 'RW', Name: 'Rwanda' },
    { Code: 'BL', Name: 'Saint Barth\u00e9lemy' },
    { Code: 'SH', Name: 'Saint Helena, Ascension and Tristan da Cunha' },
    { Code: 'KN', Name: 'Saint Kitts and Nevis' },
    { Code: 'LC', Name: 'Saint Lucia' },
    { Code: 'MF', Name: 'Saint Martin (French part)' },
    { Code: 'PM', Name: 'Saint Pierre and Miquelon' },
    { Code: 'VC', Name: 'Saint Vincent and the Grenadines' },
    { Code: 'WS', Name: 'Samoa' },
    { Code: 'SM', Name: 'San Marino' },
    { Code: 'ST', Name: 'Sao Tome and Principe' },
    { Code: 'SN', Name: 'Senegal' },
    { Code: 'RS', Name: 'Serbia' },
    { Code: 'SC', Name: 'Seychelles' },
    { Code: 'SL', Name: 'Sierra Leone' },
    { Code: 'SG', Name: 'Singapore' },
    { Code: 'SX', Name: 'Sint Maarten (Dutch part)' },
    { Code: 'SK', Name: 'Slovakia' },
    { Code: 'SI', Name: 'Slovenia' },
    { Code: 'SB', Name: 'Solomon Islands' },
    { Code: 'SO', Name: 'Somalia' },
    { Code: 'ZA', Name: 'South Africa' },
    { Code: 'GS', Name: 'South Georgia and the South Sandwich Islands' },
    { Code: 'SS', Name: 'South Sudan' },
    { Code: 'ES', Name: 'Spain' },
    { Code: 'LK', Name: 'Sri Lanka' },
    { Code: 'SD', Name: 'Sudan' },
    { Code: 'SR', Name: 'Suriname' },
    { Code: 'SJ', Name: 'Svalbard and Jan Mayen' },
    { Code: 'SZ', Name: 'Swaziland' },
    { Code: 'SE', Name: 'Sweden' },
    { Code: 'CH', Name: 'Switzerland' },
    { Code: 'SY', Name: 'Syrian Arab Republic' },
    { Code: 'TW', Name: 'Taiwan, Province of China' },
    { Code: 'TJ', Name: 'Tajikistan' },
    { Code: 'TZ', Name: 'Tanzania, United Republic of' },
    { Code: 'TH', Name: 'Thailand' },
    { Code: 'TL', Name: 'Timor-Leste' },
    { Code: 'TG', Name: 'Togo' },
    { Code: 'TK', Name: 'Tokelau' },
    { Code: 'TO', Name: 'Tonga' },
    { Code: 'TT', Name: 'Trinidad and Tobago' },
    { Code: 'TN', Name: 'Tunisia' },
    { Code: 'TR', Name: 'Turkey' },
    { Code: 'TM', Name: 'Turkmenistan' },
    { Code: 'TC', Name: 'Turks and Caicos Islands' },
    { Code: 'TV', Name: 'Tuvalu' },
    { Code: 'UG', Name: 'Uganda' },
    { Code: 'UA', Name: 'Ukraine' },
    { Code: 'AE', Name: 'United Arab Emirates' },
    { Code: 'GB', Name: 'United Kingdom' },
    { Code: 'US', Name: 'United States' },
    { Code: 'UM', Name: 'United States Minor Outlying Islands' },
    { Code: 'UY', Name: 'Uruguay' },
    { Code: 'UZ', Name: 'Uzbekistan' },
    { Code: 'VU', Name: 'Vanuatu' },
    { Code: 'VE', Name: 'Venezuela, Bolivarian Republic of' },
    { Code: 'VN', Name: 'Viet Nam' },
    { Code: 'VG', Name: 'Virgin Islands, British' },
    { Code: 'VI', Name: 'Virgin Islands, U.S.' },
    { Code: 'WF', Name: 'Wallis and Futuna' },
    { Code: 'EH', Name: 'Western Sahara' },
    { Code: 'YE', Name: 'Yemen' },
    { Code: 'ZM', Name: 'Zambia' },
    { Code: 'ZW', Name: 'Zimbabwe' }
];
export type FieldError = { fieldName: string, code?: string, error?: string };
