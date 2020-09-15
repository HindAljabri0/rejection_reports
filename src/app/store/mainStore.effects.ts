import { Injectable } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { changePageTitle } from './mainStore.actions';



@Injectable({providedIn: 'root'})
export class MainStoreEffects {

    constructor(private actions$: Actions, private titleService: Title){}

    changePageTitle$ = createEffect(() => this.actions$.pipe(
        ofType(changePageTitle),
        tap(value => this.titleService.setTitle(`${value.title.length >= 13? '': 'Waseel Eclaims - '}${value.title}`))
    ), { dispatch: false });

}