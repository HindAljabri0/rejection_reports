import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as actions from './dashboard.actions';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';
import { RejectionCardData } from '../components/rejection-card/rejectionCardData';
import { ClaimsSummary } from 'src/app/models/ClaimsSummary';


export type DashboardCardData = { loading: boolean, data: ClaimsSummary | RejectionCardData | any, error?: string, title?: string };

export interface DashboardStatus {
    searchCriteria: SearchCriteria;
    notSubmittedClaims: DashboardCardData;
    submittedClaims: DashboardCardData;
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
        data: ClaimsSummary.emptySummaryWithStatuses(['Accepted', 'Failed', 'NotAccepted'])
    },
    submittedClaims: {
        loading: false,
        data: ClaimsSummary.emptySummaryWithStatuses([
            'PAID',
            'PARTIALLY_PAID',
            'REJECTED',
            'INVALID',
            'DUPLICATE',
            'OUTSTANDING',
            'PENDING',
            'UNDER_PROCESS'])
    }, 
    departmentNames: null
};

const _dashboardReducer = createReducer(
    initState,
    on(actions.updateSearchCriteria, (state, criteria) => ({ ...state, searchCriteria: criteria })),
    on(actions.setCardIsLoading, (state, { name, loading }) => {
        const newState = { ...state };
        newState[name] = { loading, data: state[name].data, error: state[name].error };
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
                data: ClaimsSummary.emptySummaryWithStatuses(data['statuses']), error
            };
        } else {
            newState[name] = { loading: state[name].loading, data: new RejectionCardData(data['rejectionBy']), error };
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


export const getDepartments = createSelector(dashboardSelector, (state) => state.departmentNames);

export type SearchCriteria = {
    fromDate: string;
    toDate: string;
    payerId: number;
};
