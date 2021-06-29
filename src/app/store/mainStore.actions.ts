import { HttpEvent } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';


export const hideHeaderAndSideMenu = createAction('[ Main ] Hide Main Header and Side Menu');
export const showHeaderAndSideMenu = createAction('[ Main ] Show Main Header and Side Menu');
export const changePageTitle = createAction('[ Main ] change the title that appears in the browser tab',
  props<{ title: string }>());

export const showSnackBarMessage = createAction('[ Main ] show a message in snack bar at the bottom of the screen',
  props<{ message: string }>());