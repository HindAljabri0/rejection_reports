import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import * as actions from './dashboard.actions';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';

export interface DashboardStatus {
    searchCriteria: SearchCriteria,
    notSubmittedClaims: { loading: boolean, summary: SearchStatusSummary, error?:string },
    submittedClaims: { loading: boolean, summary: SearchStatusSummary, error?:string },
    acceptedClaims: { loading: boolean, summary: SearchStatusSummary, error?:string },
    notAcceptedClaims: { loading: boolean, summary: SearchStatusSummary, error?:string },
    underSubmissionClaims: { loading: boolean, summary: SearchStatusSummary, error?:string },
    paidClaims: { loading: boolean, summary: SearchStatusSummary, error?:string },
    partiallyPaidClaims: { loading: boolean, summary: SearchStatusSummary, error?:string },
    rejectedClaims: { loading: boolean, summary: SearchStatusSummary, error?:string },
    underProcessingClaims: { loading: boolean, summary: SearchStatusSummary, error?:string }
}

const initState: DashboardStatus = {
    searchCriteria: {
        fromDate: null,
        toDate: null,
        payerId: null
    },
    notSubmittedClaims: { loading: false, summary: SearchStatusSummary.emptySummaryWithStatuses(['Accepted', 'Failed', 'NotAccepted', 'Batched']) },
    submittedClaims: { loading: false, summary: SearchStatusSummary.emptySummaryWithStatuses(['PAID', 'PARTIALLY_PAID', 'REJECTED', 'INVALID', 'DUPLICATE', 'OUTSTANDING', 'PENDING']) },
    acceptedClaims: { loading: false, summary: SearchStatusSummary.emptySummaryWithStatuses(['Accepted', 'Failed']) },
    notAcceptedClaims: { loading: false, summary: SearchStatusSummary.emptySummaryWithStatuses(['NotAccepted']) },
    underSubmissionClaims: { loading: false, summary: SearchStatusSummary.emptySummaryWithStatuses(['Batched']) },
    paidClaims: { loading: false, summary: SearchStatusSummary.emptySummaryWithStatuses(['PAID', 'SETTLED']) },
    partiallyPaidClaims: { loading: false, summary: SearchStatusSummary.emptySummaryWithStatuses(['PARTIALLY_PAID']) },
    rejectedClaims: { loading: false, summary: SearchStatusSummary.emptySummaryWithStatuses(['REJECTED', 'INVALID', 'DUPLICATE']) },
    underProcessingClaims: { loading: false, summary: SearchStatusSummary.emptySummaryWithStatuses(['OUTSTANDING', 'PENDING', 'UNDER_PROCESS']) },
}

const _dashboardReducer = createReducer(
    initState,
    on(actions.updateSearchCriteria, (state, criteria) => ({ ...state, searchCriteria: criteria })),
    on(actions.setCardIsLoading, (state, { name, loading }) => {
        let newState = { ...state };
        newState[name] = { loading: loading, summary: state[name].summary, error: state[name].error };
        return newState;
    }),
    on(actions.setCardSummary, (state, { name, summary }) => {
        let newState = { ...state };
        newState[name] = { loading: state[name].loading, summary: summary };
        return newState;
    }),
    on(actions.setCardError, (state, { name, error }) => {
        let newState = { ...state };
        newState[name] = { loading: state[name].loading, summary: SearchStatusSummary.emptySummaryWithStatuses(state[name].summary.statuses), error:error };
        return newState;
    })
)

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

export type SearchCriteria = {
    fromDate: string;
    toDate: string;
    payerId: number;
}