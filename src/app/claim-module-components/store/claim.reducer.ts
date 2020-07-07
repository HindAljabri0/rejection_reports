import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as actions from './claim.actions';
import { Claim } from '../models/claim.model';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { GDPN } from '../models/GDPN.model';

export interface ClaimState {
    claim: Claim;
    claimErrors: { claimGDPN:FieldError[], patientInfoErrors: FieldError[], physicianErrors: FieldError[], genInfoErrors: FieldError[], diagnosisErrors: FieldError[], invoicesErrors: FieldError[] };
    LOVs: { Departments: any[], IllnessCode: any[], VisitType: any[], PhysicianCategory: any[] };
    error: any;
    loading: boolean;
    selectedTab: number;
    selectedGDPN: { invoiceIndex?: number, serviceIndex?: number };
}

const initState: ClaimState = {
    claim: null,
    claimErrors: { claimGDPN: [], patientInfoErrors: [], diagnosisErrors: [], genInfoErrors: [], physicianErrors: [], invoicesErrors: [] },
    LOVs: { Departments: [], IllnessCode: [], VisitType: [], PhysicianCategory: [] },
    error: null,
    loading: true,
    selectedTab: 0,
    selectedGDPN: {}
}

const _claimReducer = createReducer(
    initState,
    on(actions.startCreatingNewClaim, (state, { caseType }) => {
        let claim = new Claim(caseType);
        return { ...state, claim: claim };
    }),
    on(actions.loadLOVs, (state) => ({ ...state, loading: true })),
    on(actions.setLOVs, (state, { LOVs }) => ({ ...state, LOVs: extractLOVsFromHttpResponse(LOVs), loading: false })),
    on(actions.setLoading, (state, { loading }) => ({ ...state, loading: loading })),
    on(actions.setError, (state, { error }) => ({ ...state, error: error, loading: false })),
    on(actions.cancelClaim, (state) => ({ ...initState, loading: false })),
    on(actions.changeSelectedTab, (state, { tab }) => ({ ...state, selectedTab: tab })),
    on(actions.addClaimErrors, (state, { module, errors }) => {
        let claimErrors = initState.claimErrors;
        switch (module) {
            case 'patientInfoErrors':
                claimErrors = { ...state.claimErrors, patientInfoErrors: errors };
                break;
            case 'diagnosisErrors':
                claimErrors = { ...state.claimErrors, diagnosisErrors: errors };
                break;
            case 'genInfoErrors':
                claimErrors = { ...state.claimErrors, genInfoErrors: errors };
                break;
            case 'physicianErrors':
                claimErrors = { ...state.claimErrors, physicianErrors: errors };
                break;
            case 'invoiceErrors':
                claimErrors = { ...state.claimErrors, invoicesErrors: errors };
                break;
            case 'claimGDPN':
                claimErrors = {...state.claimErrors, claimGDPN: errors};
                break;
        }
        return { ...state, claimErrors: claimErrors };
    }),

    on(actions.updatePatientName, (state, { name }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, patient: { ...state.claim.caseInformation.patient, fullName: name } } } })),
    on(actions.updatePatientGender, (state, { gender }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, patient: { ...state.claim.caseInformation.patient, gender: gender } } } })),
    on(actions.updatePayer, (state, { payerId }) => ({ ...state, claim: { ...state.claim, claimIdentities: { ...state.claim.claimIdentities, payerID: `${payerId}` } } })),
    on(actions.updateVisitType, (state, { visitType }) => ({ ...state, claim: { ...state.claim, visitInformation: { ...state.claim.visitInformation, visitType: visitType } } })),
    on(actions.updateNationality, (state, { nationality }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, patient: { ...state.claim.caseInformation.patient, nationality: nationality } } } })),
    on(actions.updatePatientMemberId, (state, { memberId }) => ({ ...state, claim: { ...state.claim, member: { ...state.claim.member, memberID: memberId } } })),
    on(actions.updateNationalId, (state, { nationalId }) => ({ ...state, claim: { ...state.claim, member: { ...state.claim.member, idNumber: nationalId } } })),
    on(actions.updatePolicyNum, (state, { policyNo }) => ({ ...state, claim: { ...state.claim, member: { ...state.claim.member, policyNumber: policyNo } } })),
    on(actions.updateApprovalNum, (state, { approvalNo }) => ({ ...state, claim: { ...state.claim, claimIdentities: { ...state.claim.claimIdentities, approvalNumber: approvalNo } } })),

    on(actions.updatePhysicianId, (state, { physicianId }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, physician: { ...state.claim.caseInformation.physician, physicianID: physicianId } } } })),
    on(actions.updatePhysicianName, (state, { physicianName }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, physician: { ...state.claim.caseInformation.physician, physicianName: physicianName } } } })),
    on(actions.updatePhysicianCategory, (state, { physicianCategory }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, physician: { ...state.claim.caseInformation.physician, physicianCategory: physicianCategory } } } })),
    on(actions.updateDepartment, (state, { department }) => ({ ...state, claim: { ...state.claim, visitInformation: { ...state.claim.visitInformation, departmentCode: department } } })),

    on(actions.updateDiagnosisList, (state, { list }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, caseDescription: { ...state.claim.caseInformation.caseDescription, diagnosis: list } } } })),

    on(actions.updateIllnesses, (state, { list }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, caseDescription: { ...state.claim.caseInformation.caseDescription, illnessCategory: { inllnessCode: list } } } } })),

    on(actions.updateClaimDate, (state, { claimDate }) => ({ ...state, claim: { ...state.claim, visitInformation: { ...state.claim.visitInformation, visitDate: claimDate } } })),
    on(actions.updateClaimType, (state, { claimType }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, caseType: claimType } } })),
    on(actions.updateFileNumber, (state, { fileNumber }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, patient: { ...state.claim.caseInformation.patient, patientFileNumber: fileNumber } } } })),
    on(actions.updateMemberDob, (state, { memberDob }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, patient: { ...state.claim.caseInformation.patient, dob: memberDob } } } })),
    on(actions.updateIllnessDuration, (state, { illnessDuration }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, caseDescription: { ...state.claim.caseInformation.caseDescription, illnessDuration: illnessDuration } } } })),
    on(actions.updateAge, (state, { age }) => ({ ...state, claim: { ...state.claim, caseInformation: { ...state.claim.caseInformation, patient: { ...state.claim.caseInformation.patient, age: age } } } })),

    on(actions.updateInvoices_Services, (state, { invoices }) => {
        let GDPN: GDPN = {
            discount: { value: invoices.map(invoice => invoice.invoiceGDPN.discount.value).reduce((pre, cur) => pre + cur), type: 'SAR' },
            gross: { value: invoices.map(invoice => invoice.invoiceGDPN.gross.value).reduce((pre, cur) => pre + cur), type: 'SAR' },
            net: { value: invoices.map(invoice => invoice.invoiceGDPN.net.value).reduce((pre, cur) => pre + cur), type: 'SAR' },
            netVATamount: { value: invoices.map(invoice => invoice.invoiceGDPN.netVATamount.value).reduce((pre, cur) => pre + cur), type: 'SAR' },
            netVATrate: { value: invoices.map(invoice => invoice.invoiceGDPN.netVATrate.value).reduce((pre, cur) => pre + cur), type: 'PERCENT' },
            patientShare: { value: invoices.map(invoice => invoice.invoiceGDPN.patientShare.value).reduce((pre, cur) => pre + cur), type: 'SAR' },
            patientShareVATamount: { value: invoices.map(invoice => invoice.invoiceGDPN.patientShareVATamount.value).reduce((pre, cur) => pre + cur), type: 'SAR' },
            patientShareVATrate: { value: invoices.map(invoice => invoice.invoiceGDPN.patientShareVATrate.value).reduce((pre, cur) => pre + cur), type: 'PERCENT' },
        };
        return ({ ...state, claim: { ...state.claim, invoice: invoices, claimGDPN: GDPN } });
    }),
    on(actions.selectGDPN, (state, { invoiceIndex, serviceIndex }) => ({ ...state, selectedGDPN: { invoiceIndex: invoiceIndex, serviceIndex: serviceIndex } }))
);

export function claimReducer(state, action) {
    return _claimReducer(state, action);
}

export const claimSelector = createFeatureSelector<ClaimState>('claimState');
export const getClaim = createSelector(claimSelector, (state) => state.claim);
export const getClaimType = createSelector(claimSelector, (state) => state.claim.caseInformation.caseType);
export const getSelectedPayer = createSelector(claimSelector, (state) => state.claim.claimIdentities.payerID);
export const getVistType = createSelector(claimSelector, (state) => state.LOVs.VisitType);
export const getVisitDate = createSelector(claimSelector, (state) => state.claim.visitInformation.visitDate);
export const getSelectedTab = createSelector(claimSelector, (state) => state.selectedTab);
export const getDepartments = createSelector(claimSelector, (state) => state.LOVs.Departments);
export const getIllnessCode = createSelector(claimSelector, (state) => state.LOVs.IllnessCode);
export const getPhysicianCategory = createSelector(claimSelector, (state) => state.LOVs.PhysicianCategory);
export const getClaimModuleError = createSelector(claimSelector, (state) => state.error);
export const getClaimModuleIsLoading = createSelector(claimSelector, (state) => state.loading);
export const getClaimObjectErrors = createSelector(claimSelector, (state) => state.claimErrors);
export const getPatientErrors = createSelector(claimSelector, (state) => state.claimErrors.patientInfoErrors);
export const getDiagnosisErrors = createSelector(claimSelector, (state) => state.claimErrors.diagnosisErrors);
export const getGenInfoErrors = createSelector(claimSelector, (state) => state.claimErrors.genInfoErrors);
export const getPhysicianErrors = createSelector(claimSelector, (state) => state.claimErrors.physicianErrors);
export const getInvoicesErrors = createSelector(claimSelector, (state) => state.claimErrors.invoicesErrors);
export const getClaimGDPNErrors = createSelector(claimSelector, (state) => state.claimErrors.claimGDPN);
export const getSelectedGDPN = createSelector(claimSelector, (state) => state.selectedGDPN);



function extractLOVsFromHttpResponse(response: HttpEvent<any>) {
    if (response instanceof HttpResponse) {
        return response.body;
    }
}


export const nationalities: { Code: string, Name: string }[] = [{ Code: "SA", Name: "Saudi Arabia" }, { Code: "AF", Name: "Afghanistan" }, { Code: "AX", Name: "\u00c5land Islands" }, { Code: "AL", Name: "Albania" }, { Code: "DZ", Name: "Algeria" }, { Code: "AS", Name: "American Samoa" }, { Code: "AD", Name: "Andorra" }, { Code: "AO", Name: "Angola" }, { Code: "AI", Name: "Anguilla" }, { Code: "AQ", Name: "Antarctica" }, { Code: "AG", Name: "Antigua and Barbuda" }, { Code: "AR", Name: "Argentina" }, { Code: "AM", Name: "Armenia" }, { Code: "AW", Name: "Aruba" }, { Code: "AU", Name: "Australia" }, { Code: "AT", Name: "Austria" }, { Code: "AZ", Name: "Azerbaijan" }, { Code: "BS", Name: "Bahamas" }, { Code: "BH", Name: "Bahrain" }, { Code: "BD", Name: "Bangladesh" }, { Code: "BB", Name: "Barbados" }, { Code: "BY", Name: "Belarus" }, { Code: "BE", Name: "Belgium" }, { Code: "BZ", Name: "Belize" }, { Code: "BJ", Name: "Benin" }, { Code: "BM", Name: "Bermuda" }, { Code: "BT", Name: "Bhutan" }, { Code: "BO", Name: "Bolivia, Plurinational State of" }, { Code: "BQ", Name: "Bonaire, Sint Eustatius and Saba" }, { Code: "BA", Name: "Bosnia and Herzegovina" }, { Code: "BW", Name: "Botswana" }, { Code: "BV", Name: "Bouvet Island" }, { Code: "BR", Name: "Brazil" }, { Code: "IO", Name: "British Indian Ocean Territory" }, { Code: "BN", Name: "Brunei Darussalam" }, { Code: "BG", Name: "Bulgaria" }, { Code: "BF", Name: "Burkina Faso" }, { Code: "BI", Name: "Burundi" }, { Code: "KH", Name: "Cambodia" }, { Code: "CM", Name: "Cameroon" }, { Code: "CA", Name: "Canada" }, { Code: "CV", Name: "Cape Verde" }, { Code: "KY", Name: "Cayman Islands" }, { Code: "CF", Name: "Central African Republic" }, { Code: "TD", Name: "Chad" }, { Code: "CL", Name: "Chile" }, { Code: "CN", Name: "China" }, { Code: "CX", Name: "Christmas Island" }, { Code: "CC", Name: "Cocos (Keeling) Islands" }, { Code: "CO", Name: "Colombia" }, { Code: "KM", Name: "Comoros" }, { Code: "CG", Name: "Congo" }, { Code: "CD", Name: "Congo, the Democratic Republic of the" }, { Code: "CK", Name: "Cook Islands" }, { Code: "CR", Name: "Costa Rica" }, { Code: "CI", Name: "C\u00f4te d'Ivoire" }, { Code: "HR", Name: "Croatia" }, { Code: "CU", Name: "Cuba" }, { Code: "CW", Name: "Cura\u00e7ao" }, { Code: "CY", Name: "Cyprus" }, { Code: "CZ", Name: "Czech Republic" }, { Code: "DK", Name: "Denmark" }, { Code: "DJ", Name: "Djibouti" }, { Code: "DM", Name: "Dominica" }, { Code: "DO", Name: "Dominican Republic" }, { Code: "EC", Name: "Ecuador" }, { Code: "EG", Name: "Egypt" }, { Code: "SV", Name: "El Salvador" }, { Code: "GQ", Name: "Equatorial Guinea" }, { Code: "ER", Name: "Eritrea" }, { Code: "EE", Name: "Estonia" }, { Code: "ET", Name: "Ethiopia" }, { Code: "FK", Name: "Falkland Islands (Malvinas)" }, { Code: "FO", Name: "Faroe Islands" }, { Code: "FJ", Name: "Fiji" }, { Code: "FI", Name: "Finland" }, { Code: "FR", Name: "France" }, { Code: "GF", Name: "French Guiana" }, { Code: "PF", Name: "French Polynesia" }, { Code: "TF", Name: "French Southern Territories" }, { Code: "GA", Name: "Gabon" }, { Code: "GM", Name: "Gambia" }, { Code: "GE", Name: "Georgia" }, { Code: "DE", Name: "Germany" }, { Code: "GH", Name: "Ghana" }, { Code: "GI", Name: "Gibraltar" }, { Code: "GR", Name: "Greece" }, { Code: "GL", Name: "Greenland" }, { Code: "GD", Name: "Grenada" }, { Code: "GP", Name: "Guadeloupe" }, { Code: "GU", Name: "Guam" }, { Code: "GT", Name: "Guatemala" }, { Code: "GG", Name: "Guernsey" }, { Code: "GN", Name: "Guinea" }, { Code: "GW", Name: "Guinea-Bissau" }, { Code: "GY", Name: "Guyana" }, { Code: "HT", Name: "Haiti" }, { Code: "HM", Name: "Heard Island and McDonald Islands" }, { Code: "VA", Name: "Holy See (Vatican City State)" }, { Code: "HN", Name: "Honduras" }, { Code: "HK", Name: "Hong Kong" }, { Code: "HU", Name: "Hungary" }, { Code: "IS", Name: "Iceland" }, { Code: "IN", Name: "India" }, { Code: "ID", Name: "Indonesia" }, { Code: "IR", Name: "Iran, Islamic Republic of" }, { Code: "IQ", Name: "Iraq" }, { Code: "IE", Name: "Ireland" }, { Code: "IM", Name: "Isle of Man" }, { Code: "IL", Name: "Israel" }, { Code: "IT", Name: "Italy" }, { Code: "JM", Name: "Jamaica" }, { Code: "JP", Name: "Japan" }, { Code: "JE", Name: "Jersey" }, { Code: "JO", Name: "Jordan" }, { Code: "KZ", Name: "Kazakhstan" }, { Code: "KE", Name: "Kenya" }, { Code: "KI", Name: "Kiribati" }, { Code: "KP", Name: "Korea, Democratic People's Republic of" }, { Code: "KR", Name: "Korea, Republic of" }, { Code: "KW", Name: "Kuwait" }, { Code: "KG", Name: "Kyrgyzstan" }, { Code: "LA", Name: "Lao People's Democratic Republic" }, { Code: "LV", Name: "Latvia" }, { Code: "LB", Name: "Lebanon" }, { Code: "LS", Name: "Lesotho" }, { Code: "LR", Name: "Liberia" }, { Code: "LY", Name: "Libya" }, { Code: "LI", Name: "Liechtenstein" }, { Code: "LT", Name: "Lithuania" }, { Code: "LU", Name: "Luxembourg" }, { Code: "MO", Name: "Macao" }, { Code: "MK", Name: "Macedonia, the Former Yugoslav Republic of" }, { Code: "MG", Name: "Madagascar" }, { Code: "MW", Name: "Malawi" }, { Code: "MY", Name: "Malaysia" }, { Code: "MV", Name: "Maldives" }, { Code: "ML", Name: "Mali" }, { Code: "MT", Name: "Malta" }, { Code: "MH", Name: "Marshall Islands" }, { Code: "MQ", Name: "Martinique" }, { Code: "MR", Name: "Mauritania" }, { Code: "MU", Name: "Mauritius" }, { Code: "YT", Name: "Mayotte" }, { Code: "MX", Name: "Mexico" }, { Code: "FM", Name: "Micronesia, Federated States of" }, { Code: "MD", Name: "Moldova, Republic of" }, { Code: "MC", Name: "Monaco" }, { Code: "MN", Name: "Mongolia" }, { Code: "ME", Name: "Montenegro" }, { Code: "MS", Name: "Montserrat" }, { Code: "MA", Name: "Morocco" }, { Code: "MZ", Name: "Mozambique" }, { Code: "MM", Name: "Myanmar" }, { Code: "NA", Name: "Namibia" }, { Code: "NR", Name: "Nauru" }, { Code: "NP", Name: "Nepal" }, { Code: "NL", Name: "Netherlands" }, { Code: "NC", Name: "New Caledonia" }, { Code: "NZ", Name: "New Zealand" }, { Code: "NI", Name: "Nicaragua" }, { Code: "NE", Name: "Niger" }, { Code: "NG", Name: "Nigeria" }, { Code: "NU", Name: "Niue" }, { Code: "NF", Name: "Norfolk Island" }, { Code: "MP", Name: "Northern Mariana Islands" }, { Code: "NO", Name: "Norway" }, { Code: "OM", Name: "Oman" }, { Code: "PK", Name: "Pakistan" }, { Code: "PW", Name: "Palau" }, { Code: "PS", Name: "Palestine, State of" }, { Code: "PA", Name: "Panama" }, { Code: "PG", Name: "Papua New Guinea" }, { Code: "PY", Name: "Paraguay" }, { Code: "PE", Name: "Peru" }, { Code: "PH", Name: "Philippines" }, { Code: "PN", Name: "Pitcairn" }, { Code: "PL", Name: "Poland" }, { Code: "PT", Name: "Portugal" }, { Code: "PR", Name: "Puerto Rico" }, { Code: "QA", Name: "Qatar" }, { Code: "RE", Name: "R\u00e9union" }, { Code: "RO", Name: "Romania" }, { Code: "RU", Name: "Russian Federation" }, { Code: "RW", Name: "Rwanda" }, { Code: "BL", Name: "Saint Barth\u00e9lemy" }, { Code: "SH", Name: "Saint Helena, Ascension and Tristan da Cunha" }, { Code: "KN", Name: "Saint Kitts and Nevis" }, { Code: "LC", Name: "Saint Lucia" }, { Code: "MF", Name: "Saint Martin (French part)" }, { Code: "PM", Name: "Saint Pierre and Miquelon" }, { Code: "VC", Name: "Saint Vincent and the Grenadines" }, { Code: "WS", Name: "Samoa" }, { Code: "SM", Name: "San Marino" }, { Code: "ST", Name: "Sao Tome and Principe" }, { Code: "SN", Name: "Senegal" }, { Code: "RS", Name: "Serbia" }, { Code: "SC", Name: "Seychelles" }, { Code: "SL", Name: "Sierra Leone" }, { Code: "SG", Name: "Singapore" }, { Code: "SX", Name: "Sint Maarten (Dutch part)" }, { Code: "SK", Name: "Slovakia" }, { Code: "SI", Name: "Slovenia" }, { Code: "SB", Name: "Solomon Islands" }, { Code: "SO", Name: "Somalia" }, { Code: "ZA", Name: "South Africa" }, { Code: "GS", Name: "South Georgia and the South Sandwich Islands" }, { Code: "SS", Name: "South Sudan" }, { Code: "ES", Name: "Spain" }, { Code: "LK", Name: "Sri Lanka" }, { Code: "SD", Name: "Sudan" }, { Code: "SR", Name: "Suriname" }, { Code: "SJ", Name: "Svalbard and Jan Mayen" }, { Code: "SZ", Name: "Swaziland" }, { Code: "SE", Name: "Sweden" }, { Code: "CH", Name: "Switzerland" }, { Code: "SY", Name: "Syrian Arab Republic" }, { Code: "TW", Name: "Taiwan, Province of China" }, { Code: "TJ", Name: "Tajikistan" }, { Code: "TZ", Name: "Tanzania, United Republic of" }, { Code: "TH", Name: "Thailand" }, { Code: "TL", Name: "Timor-Leste" }, { Code: "TG", Name: "Togo" }, { Code: "TK", Name: "Tokelau" }, { Code: "TO", Name: "Tonga" }, { Code: "TT", Name: "Trinidad and Tobago" }, { Code: "TN", Name: "Tunisia" }, { Code: "TR", Name: "Turkey" }, { Code: "TM", Name: "Turkmenistan" }, { Code: "TC", Name: "Turks and Caicos Islands" }, { Code: "TV", Name: "Tuvalu" }, { Code: "UG", Name: "Uganda" }, { Code: "UA", Name: "Ukraine" }, { Code: "AE", Name: "United Arab Emirates" }, { Code: "GB", Name: "United Kingdom" }, { Code: "US", Name: "United States" }, { Code: "UM", Name: "United States Minor Outlying Islands" }, { Code: "UY", Name: "Uruguay" }, { Code: "UZ", Name: "Uzbekistan" }, { Code: "VU", Name: "Vanuatu" }, { Code: "VE", Name: "Venezuela, Bolivarian Republic of" }, { Code: "VN", Name: "Viet Nam" }, { Code: "VG", Name: "Virgin Islands, British" }, { Code: "VI", Name: "Virgin Islands, U.S." }, { Code: "WF", Name: "Wallis and Futuna" }, { Code: "EH", Name: "Western Sahara" }, { Code: "YE", Name: "Yemen" }, { Code: "ZM", Name: "Zambia" }, { Code: "ZW", Name: "Zimbabwe" }];
export type FieldError = { fieldName: string, error?: string };