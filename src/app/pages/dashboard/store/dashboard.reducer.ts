import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as actions from './dashboard.actions';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { RejectionCardData } from '../components/rejection-card/rejectionCardData';


export type DashboardCardData = { loading: boolean, data: SearchStatusSummary | RejectionCardData, error?: string, title?: string };

export interface DashboardStatus {
    searchCriteria: SearchCriteria;
    notSubmittedClaims: DashboardCardData;
    submittedClaims: DashboardCardData;
    acceptedClaims: DashboardCardData;
    notAcceptedClaims: DashboardCardData;
    underSubmissionClaims: DashboardCardData;
    paidClaims: DashboardCardData;
    partiallyPaidClaims: DashboardCardData;
    rejectedClaims: DashboardCardData;
    underProcessingClaims: DashboardCardData;
    rejectionByDepartment: DashboardCardData;
    rejectionByDoctor: DashboardCardData;
    rejectionByService: DashboardCardData;
    departmentNames: any;
}

const initState: DashboardStatus = {
    searchCriteria: {
        fromDate: null,
        toDate: null,
        payerId: null
    },
    notSubmittedClaims: {
        loading: false,
        data: SearchStatusSummary.emptySummaryWithStatuses(['Accepted', 'Failed', 'NotAccepted', 'Batched'])
    },
    submittedClaims: {
        loading: false,
        data: SearchStatusSummary.emptySummaryWithStatuses([
            'PAID',
            'PARTIALLY_PAID',
            'REJECTED',
            'INVALID',
            'DUPLICATE',
            'OUTSTANDING',
            'PENDING',
            'UNDER_PROCESS'])
    },
    acceptedClaims: { loading: false, data: SearchStatusSummary.emptySummaryWithStatuses(['Accepted', 'Failed']) },
    notAcceptedClaims: { loading: false, data: SearchStatusSummary.emptySummaryWithStatuses(['NotAccepted']) },
    underSubmissionClaims: { loading: false, data: SearchStatusSummary.emptySummaryWithStatuses(['Batched']) },
    paidClaims: { loading: false, data: SearchStatusSummary.emptySummaryWithStatuses(['PAID', 'SETTLED']) },
    partiallyPaidClaims: { loading: false, data: SearchStatusSummary.emptySummaryWithStatuses(['PARTIALLY_PAID']) },
    rejectedClaims: { loading: false, data: SearchStatusSummary.emptySummaryWithStatuses(['REJECTED', 'INVALID', 'DUPLICATE']) },
    underProcessingClaims: {
        loading: false,
        data: SearchStatusSummary.emptySummaryWithStatuses(['OUTSTANDING', 'PENDING', 'UNDER_PROCESS'])
    },
    rejectionByDepartment: { loading: false, data: new RejectionCardData('Department') },
    rejectionByDoctor: { loading: false, data: new RejectionCardData('Doctor') },
    rejectionByService: { loading: false, data: new RejectionCardData('Service') },
    departmentNames: null
};

const _dashboardReducer = createReducer(
    initState,
    on(actions.updateSearchCriteria, (state, criteria) => ({ ...state, searchCriteria: criteria })),
    on(actions.setCardIsLoading, (state, { name, loading }) => {
        const newState = { ...state };
        newState[name] = { loading: loading, data: state[name].data, error: state[name].error };
        return newState;
    }),
    on(actions.setCardSummary, (state, { name, data: summary }) => {
        const newState = { ...state };
        newState[name] = { loading: state[name].loading, data: summary };
        return newState;
    }),
    on(actions.setCardError, (state, { name, error }) => {
        const newState = { ...state };
        const data = state[name].data;
        if (data['statuses'] != null) {
            newState[name] = {
                loading: state[name].loading,
                data: SearchStatusSummary.emptySummaryWithStatuses(data['statuses']), error: error
            };
        } else {
            newState[name] = { loading: state[name].loading, data: new RejectionCardData(data['rejectionBy']), error: error };
        }
        return newState;
    }),
    on(actions.setDepartmentNames, (state, response) => {
        if (response.body == null) {
            return ({ ...state });
        }
        return ({ ...state, departmentNames: response.body['Departments'] });
    })
);

export function dashboardReducer(state, action) {
    return _dashboardReducer(state, action);
}

export const dashboardSelector = createFeatureSelector<DashboardStatus>('dashboardState');
export const getSummaryByName = (name: actions.DashboardCardNames) => createSelector(dashboardSelector, (state) => state[name]);
export const getNonSubmittedClaims = createSelector(dashboardSelector, (state) => state.notSubmittedClaims);
export const getSubmittedClaims = createSelector(dashboardSelector, (state) => state.submittedClaims);
export const getAcceptedClaims = createSelector(dashboardSelector, (state) => state.acceptedClaims);
export const getNotAcceptedClaims = createSelector(dashboardSelector, (state) => state.notAcceptedClaims);
export const getUnderSubmissionClaims = createSelector(dashboardSelector, (state) => state.underSubmissionClaims);
export const getPaidClaims = createSelector(dashboardSelector, (state) => state.paidClaims);
export const getPartiallyPaidClaims = createSelector(dashboardSelector, (state) => state.partiallyPaidClaims);
export const getRejectedClaims = createSelector(dashboardSelector, (state) => state.rejectedClaims);
export const getUnderProcessingClaims = createSelector(dashboardSelector, (state) => state.underProcessingClaims);
export const getRejectionByDepartment = createSelector(dashboardSelector, (state) => state.rejectionByDepartment);
export const getRejectionByDoctor = createSelector(dashboardSelector, (state) => state.rejectionByDoctor);
export const getRejectionByService = createSelector(dashboardSelector, (state) => state.rejectionByService);

export const getDepartments = createSelector(dashboardSelector, (state) => state.departmentNames);

export type SearchCriteria = {
    fromDate: string;
    toDate: string;
    payerId: number;
};
