import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { interval, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogService } from '../services/dialogsService/dialog.service';
import { SearchService } from '../services/serchService/search.service';
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
    private datePipe: DatePipe
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

  onCheckingAlerts$ = createEffect(() => this.actions$.pipe(
    ofType(checkAlerts),
    tap(() => {
      const providerId = localStorage.getItem('provider_id');
      if (providerId != null && providerId != '101') {
        const lastDateAlertAppeared = localStorage.getItem(`lastDateAlertAppeared:${providerId}`);
        let yearMonthDay = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        if (lastDateAlertAppeared != null && lastDateAlertAppeared == yearMonthDay) {
          return null;
        }
        this.searchService.getClaimAlerts(providerId).subscribe(event => {
          if (event instanceof HttpResponse) {
            const body = event.body;
            if (body && body[0] && body[0].indexOf('been a while since your') > -1) {
              body[0] += '\n\nRejected By Waseel is now Validation Errors';
            }

            if (body instanceof Array) {
              this.dialogService.showAlerts(body);
              localStorage.setItem(`lastDateAlertAppeared:${providerId}`, yearMonthDay);
            }
          }
        });
      }
    })
  ), { dispatch: false });

}
