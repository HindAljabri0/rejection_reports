import { createAction, props } from '@ngrx/store';
import { SearchCriteria } from './dashboard.reducer';
import { RejectionCardData } from '../components/rejection-card/rejectionCardData';
import { ClaimsSummary } from 'src/app/models/ClaimsSummary';

export const getDepartmentNames = createAction('[ Dashboard ] get department name');

export const setDepartmentNames = createAction('[ Dashboard ] set deaprtment name', props<any>());

export const updateSearchCriteria = createAction('[ Dashboard ] update search criteria', props<SearchCriteria>());

export const setCardIsLoading = createAction('[ Dashboard ] set one card loading status',
  props<{ name: DashboardCardNames, loading: boolean }>());

export const setCardSummary = createAction('[ Dashboard ] set one card summary',
  props<{ name: DashboardCardNames, data: ClaimsSummary | RejectionCardData }>());

export const setCardError = createAction('[ Dashboard ] set one card error', props<{ name: DashboardCardNames, error: string }>());

export const dashboardCardNames: DashboardCardNames[] = [
  'notSubmittedClaims',
  'submittedClaims',
  ];
export type DashboardCardNames = 'notSubmittedClaims' |
  'submittedClaims';




