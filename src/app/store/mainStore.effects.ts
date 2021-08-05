import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { interval } from 'rxjs';
import { tap } from 'rxjs/operators';
import { changePageTitle, showSnackBarMessage } from './mainStore.actions';

@Injectable({ providedIn: 'root' })
export class MainStoreEffects {

    messages: string[] = [];
    constructor(
        private actions$: Actions,
        private titleService: Title,
        private snackBar: MatSnackBar,
    ) {
        interval(3000)
            .subscribe(() => {
                if (this.messages.length > 0) {
                    this.snackBar.open(this.messages.pop(), null, { duration: 3000 });
                }
            });
    }

    changePageTitle$ = createEffect(() => this.actions$.pipe(
        ofType(changePageTitle),
        tap(value => this.titleService.setTitle(`${value.title.length >= 13 ? '' : 'Waseel E-Claims - '}${value.title}`))
    ), { dispatch: false });

    onShowSnackBarMessage$ = createEffect(() => this.actions$.pipe(
        ofType(showSnackBarMessage),
        tap(data => this.messages.push(data.message))
    ), { dispatch: false });

}
