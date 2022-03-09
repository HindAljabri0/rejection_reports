import { createAction, props } from '@ngrx/store';
import { CategorizedCodeValue, ModifyingCodeValueRequest } from './configurations.reducer';


export const loadProviderMappingValues = createAction('[ Configurations ] [ Code Value Management ] load values from backend');
export const storeProviderMappingValues = createAction('[ Configurations ] [ Code Value Management ] store incoming values',
  props<{ values: CategorizedCodeValue }>());
export const setCodeValueManagementLoading = createAction('[ Configurations ] [ Code Value Management ] set component is loading',
  props<{ isLoading: boolean }>());
export const setCodeValueManagementError = createAction('[ Configurations ] [ Code Value Management ] set component error', props<any>());
export const saveChangesOfCodeValueManagement = createAction('[ Configurations ] [ Code Value Management ] save changes');
export const storeSaveChangesResponsesOfCodeValueManagement =
  createAction('[ Configurations ] [ Code Value Management ] store responses after saving changes',
    props<{ responses: { request: string, status: string, error?}[] }>());
export const cancelChangesOfCodeValueManagement = createAction('[ Configurations ] [ Code Value Management ] cancel changes');
export const addNewMappingValue = createAction('[ Configurations ] [ Code Value Management ] add new mapping value',
  props<{ value: ModifyingCodeValueRequest }>());
export const deleteMappingValue = createAction('[ Configurations ] [ Code Value Management ] delete mapping value ',
  props<{ value: ModifyingCodeValueRequest }>());
