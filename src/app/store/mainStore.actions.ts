import { createAction, props } from "@ngrx/store";


export const hideHeaderAndSideMenu = createAction('[ Main ] Hide Main Header and Side Menu');
export const showHeaderAndSideMenu = createAction('[ Main ] Show Main Header and Side Menu');
export const changePageTitle = createAction('[ Main ] change the title that appears in the browser tab', props<{title: string}>());