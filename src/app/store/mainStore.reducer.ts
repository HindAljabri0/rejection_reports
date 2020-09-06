import { createReducer, createFeatureSelector, createSelector, on } from '@ngrx/store'
import * as actions from './mainStore.actions';


export interface MainState {
    headerAndSideMenuIsHidden: boolean;
}

const initState: MainState = {
    headerAndSideMenuIsHidden: false,
}

const _mainReducer = createReducer(
    initState,
    on(actions.hideHeaderAndSideMenu, (state) => ({...state, headerAndSideMenuIsHidden: true})),
    on(actions.showHeaderAndSideMenu, (state) => ({...state, headerAndSideMenuIsHidden: false})),
);

export function mainReducer(state, action) {
    return _mainReducer(state, action);
}

export const MainStateSelector = createFeatureSelector<MainState>('mainState');

export const isHeaderAndSideMenuHidden = createSelector(MainStateSelector, (state) => state.headerAndSideMenuIsHidden);