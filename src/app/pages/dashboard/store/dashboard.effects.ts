import { createReducer, on } from '@ngrx/store';
import * as actions from './dashboard.actions';

export interface DashboardStatus {
    searchCriteria:SearchCriteria,
}

const initState:DashboardStatus = {
    searchCriteria: {
        fromDate: null,
        toDate: null,
        payerId: null
    }
}

const _dashboardReducer = createReducer(
    initState,
    on(actions.updateSearchCriteria, (state, criteria) => ({...state, searchCriteria: criteria}))
)

export function dashboardReducer(state, action) {
    return _dashboardReducer(state, action);
}

export type SearchCriteria = {
    fromDate: string;
    toDate: string;
    payerId: number;
}