import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogConfig, MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { interval, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogService } from '../services/dialogsService/dialog.service';
import { SearchService } from '../services/serchService/search.service';
import { SettingsService } from '../services/settingsService/settings.service';
import { SharedServices } from '../services/shared.services';
import { changePageTitle, checkAlerts, showSnackBarMessage } from './mainStore.actions';

@Injectable({ providedIn: 'root' })
export class MainStoreEffects {

  messages: string[] = [];
  constructor(
    private actions$: Actions,
    private titleService: Title,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    private searchService: SearchService,
    private settingsService: SettingsService,
    private datePipe: DatePipe,
    private commenServices: SharedServices,
    private router: Router
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
