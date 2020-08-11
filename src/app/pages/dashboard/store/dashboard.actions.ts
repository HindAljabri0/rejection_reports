import { createAction, props } from "@ngrx/store";
import { SearchCriteria } from './dashboard.effects';


export const updateSearchCriteria = createAction('[ Dashboard ] update search criteria', props<SearchCriteria>());