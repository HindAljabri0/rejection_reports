import { createAction, props } from "@ngrx/store";
import { SearchCriteria } from './dashboard.reducer';
import { SearchStatusSummary } from 'src/app/models/searchStatusSummary';


export const updateSearchCriteria = createAction('[ Dashboard ] update search criteria', props<SearchCriteria>());

export const setCardIsLoading = createAction('[ Dashboard ] set one card loading status', props<{ name: DashboardCardNames, loading: boolean }>());

export const setCardSummary = createAction('[ Dashboard ] set one card summary', props<{ name: DashboardCardNames, summary: SearchStatusSummary }>());

export const setCardError = createAction('[ Dashboard ] set one card error', props<{ name: DashboardCardNames, error: string }>());

export const dashboardCardNames: DashboardCardNames[] = ['notSubmittedClaims', 'submittedClaims', 'acceptedClaims', 'notAcceptedClaims', 'underSubmissionClaims', 'paidClaims', 'partiallyPaidClaims', 'rejectedClaims', 'underProcessingClaims']
export type DashboardCardNames = 'notSubmittedClaims' | 'submittedClaims' | 'acceptedClaims' | 'notAcceptedClaims' | 'underSubmissionClaims' | 'paidClaims' | 'partiallyPaidClaims' | 'rejectedClaims' | 'underProcessingClaims';




