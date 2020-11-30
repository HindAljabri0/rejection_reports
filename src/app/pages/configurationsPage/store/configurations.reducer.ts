import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store'
import { addNewMappingValue, deleteMappingValue, setCodeValueManagementLoading, setCodeValueManagementError, storeProviderMappingValues, cancelChangesOfCodeValueManagement } from './configurations.actions';


export interface ConfigurationState {
    codeValueManagement: CodeValueManagementState;
}

export interface CodeValueManagementState {
    currentValues: CategorizedCodeValue;
    newValues: ModifyingCodeValueRequest[];
    toDeleteValues: ModifyingCodeValueRequest[];
    loading: boolean;
    error;
}

const initState: ConfigurationState = {
    codeValueManagement: {
        currentValues: new Map(),
        newValues: [],
        toDeleteValues: [],
        loading: false,
        error: null,
    }
}

const _configurationReducer = createReducer(
    initState,
    on(storeProviderMappingValues, (state, { values }) => ({ ...state, codeValueManagement: { ...state.codeValueManagement, currentValues: values, loading: false } })),
    on(addNewMappingValue, (state, { value }) => ({ ...state, codeValueManagement: { ...state.codeValueManagement, newValues: state.codeValueManagement.newValues.concat([value]) } })),
    on(deleteMappingValue, (state, { value }) => {
        let index = state.codeValueManagement.currentValues.get(value.category).codes.get(value.code).values.findIndex(v => v == value.value);
        if (index != -1) {
            return { ...state, codeValueManagement: { ...state.codeValueManagement, toDeleteValues: state.codeValueManagement.toDeleteValues.concat([value]) } };
        } else {
            let index = state.codeValueManagement.newValues.findIndex(item => item.category == value.category && item.code == value.code && item.value == value.value);
            if (index != -1) {
                let newValues = [...state.codeValueManagement.newValues];
                newValues.splice(index, 1);
                return { ...state, codeValueManagement: { ...state.codeValueManagement, newValues: newValues } }
            }
        }
        return { ...state };
    }),
    on(setCodeValueManagementLoading, (state, { isLoading }) => ({ ...state, codeValueManagement: { ...state.codeValueManagement, loading: isLoading } })),
    on(setCodeValueManagementError, (state, error) => ({ ...state, codeValueManagement: { ...state.codeValueManagement, error: error } })),
    on(cancelChangesOfCodeValueManagement, (state) => ({ ...state, codeValueManagement: { ...initState.codeValueManagement, currentValues: state.codeValueManagement.currentValues } }))
)

export function configurationReducer(state, action) {
    return _configurationReducer(state, action);
}

export const configurationStateSelector = createFeatureSelector<ConfigurationState>('configurationState');

export module codeValueManagementSelectors {
    export const getCurrentValues = createSelector(configurationStateSelector, (state) => state.codeValueManagement.currentValues);
    export const getIsLoading = createSelector(configurationStateSelector, (state) => state.codeValueManagement.loading);
    export const getError = createSelector(configurationStateSelector, state => state.codeValueManagement.error);
}



export type CategorizedCodeValue = Map<string, {
    label: string,
    codes: Map<string, {
        label: string,
        values: string[]
    }>
}>;

export type ModifyingCodeValueRequest = {
    category: string,
    code: string,
    value: string
}