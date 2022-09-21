import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import {
    nphiesAddNewMappingValue,
    nphiesDeleteMappingValue,
    nphiesSetCodeValueManagementLoading,
    nphiesSetCodeValueManagementError,
    nphiesStoreProviderMappingValues,
    nphiesCancelChangesOfCodeValueManagement,
    nphiesStoreSaveChangesResponsesOfCodeValueManagement
} from './configurations.actions';


export interface ConfigurationState {
    codeValueManagement: CodeValueManagementState;
}

export interface CodeValueManagementState {
    currentValues: CategorizedCodeValue;
    newValues: ModifyingCodeValueRequest[];
    toDeleteValues: ModifyingCodeValueRequest[];
    loading: boolean;
    saveChangesResponses: { request: string, status: string, error?}[];
}

const initState: ConfigurationState = {
    codeValueManagement: {
        currentValues: new Map(),
        newValues: [],
        toDeleteValues: [],
        loading: false,
        saveChangesResponses: [],
    }
};

const _configurationReducer = createReducer(
    initState,
    on(nphiesStoreProviderMappingValues, (state, { values }) => ({
        ...state, codeValueManagement: {
            ...state.codeValueManagement,
            currentValues: values, loading: false, newValues: [], toDeleteValues: []
        }
    })),
    on(nphiesAddNewMappingValue, (state, { value }) => ({
        ...state, codeValueManagement: {
            ...state.codeValueManagement,
            newValues: state.codeValueManagement.newValues.concat([value])
        }
    })),
    on(nphiesDeleteMappingValue, (state, { value }) => {
        const index = state.codeValueManagement.currentValues.get(value.categoryId).codes.get(value.codeId).values.findIndex(v =>
            v == value.value);
        if (index != -1) {
            return {
                ...state, codeValueManagement: {
                    ...state.codeValueManagement,
                    toDeleteValues: state.codeValueManagement.toDeleteValues.concat([value])
                }
            };
        } else {
            const index = state.codeValueManagement.newValues.findIndex(item =>
                item.categoryId == value.categoryId && item.codeId == value.codeId && item.value == value.value);
            if (index != -1) {
                const newValues = [...state.codeValueManagement.newValues];
                newValues.splice(index, 1);
                return { ...state, codeValueManagement: { ...state.codeValueManagement, newValues } };
            }
        }
        return { ...state };
    }),
    on(nphiesSetCodeValueManagementLoading, (state, { isLoading }) => ({
        ...state, codeValueManagement: {
            ...state.codeValueManagement,
            loading: isLoading
        }
    })),
    on(nphiesSetCodeValueManagementError, (state, error) => ({
        ...state, codeValueManagement: {
            ...state.codeValueManagement,
            saveChangesResponses: error
        }
    })),
    on(nphiesCancelChangesOfCodeValueManagement, (state) => ({
        ...state, codeValueManagement: {
            ...initState.codeValueManagement,
            currentValues: state.codeValueManagement.currentValues
        }
    })),
    on(nphiesStoreSaveChangesResponsesOfCodeValueManagement, (state, { responses }) => ({
        ...state,
        codeValueManagement: { ...state.codeValueManagement, saveChangesResponses: responses }
    }))
);

export function configurationReducer(state, action) {
    return _configurationReducer(state, action);
}

export const configurationStateSelector = createFeatureSelector<ConfigurationState>('nphiesConfigurationState');

export module codeValueManagementSelectors {
    export const getCurrentValues = createSelector(configurationStateSelector, (state) => state.codeValueManagement.currentValues);
    export const getIsLoading = createSelector(configurationStateSelector, (state) => state.codeValueManagement.loading);
    export const getResponses = createSelector(configurationStateSelector, state => state.codeValueManagement.saveChangesResponses);
    export const hasNewChanges = createSelector(configurationStateSelector, state =>
        state.codeValueManagement.newValues.length > 0 || state.codeValueManagement.toDeleteValues.length > 0);
    export const getModificationsValues = createSelector(configurationStateSelector, state =>
        ({ newValues: state.codeValueManagement.newValues, toDeleteValues: state.codeValueManagement.toDeleteValues }));
}



export type CategorizedCodeValue = Map<string, {
    label: string,
    codes: Map<string, {
        label: string,
        values: string[]
    }>
}>;

export type ModifyingCodeValueRequest = {
    categoryId: string,
    codeId: string,
    value: string
};
