import { createAction, props } from '@ngrx/store';
import { CategorizedCodeValue, ModifyingCodeValueRequest } from './configurations.reducer';


export const nphiesLoadProviderMappingValues = createAction('[ NphiesConfigurations ] [ Nphies Code Value Management ] load values from backend');
export const nphiesStoreProviderMappingValues = createAction('[ NphiesConfigurations ] [ Nphies Code Value Management ] store incoming values',
  props<{ values: CategorizedCodeValue }>());
export const nphiesSetCodeValueManagementLoading = createAction('[ NphiesConfigurations ] [ Nphies Code Value Management ] set component is loading',
  props<{ isLoading: boolean }>());
export const nphiesSetCodeValueManagementError = createAction('[ NphiesConfigurations ] [ Nphies Code Value Management ] set component error', props<any>());
export const nphiesSaveChangesOfCodeValueManagement = createAction('[ NphiesConfigurations ] [ Nphies Code Value Management ] save changes');
export const nphiesStoreSaveChangesResponsesOfCodeValueManagement =
  createAction('[ NphiesConfigurations ] [ Nphies Code Value Management ] store responses after saving changes',
    props<{ responses: { request: string, status: string, error?}[] }>());
export const nphiesCancelChangesOfCodeValueManagement = createAction('[ NphiesConfigurations ] [ Nphies Code Value Management ] cancel changes');
export const nphiesAddNewMappingValue = createAction('[ NphiesConfigurations ] [ Nphies Code Value Management ] add new mapping value',
  props<{ value: ModifyingCodeValueRequest }>());
export const nphiesDeleteMappingValue = createAction('[ NphiesConfigurations ] [ Nphies Code Value Management ] delete mapping value ',
  props<{ value: ModifyingCodeValueRequest }>());
