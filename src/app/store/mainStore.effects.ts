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

  onCheckingAlerts$ = createEffect(() => this.actions$.pipe(

    ofType(checkAlerts),
    tap(() => {
      const providerId = localStorage.getItem('provider_id');
      if (providerId != null && providerId != '101') {
        var stdDate = new Date();
        var endDt = new Date("2022-10-01");

        if (stdDate >= endDt) {
          const lastDateAlertAppeared = localStorage.getItem(`lastDateAlertAppeared:${providerId}`);
          let yearMonthDay = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

          if (lastDateAlertAppeared != null && lastDateAlertAppeared == yearMonthDay && !this.router.url.endsWith('/')) {
            return null;
          }
          this.searchService.getClaimAlerts(providerId).subscribe(event => {
            if (event instanceof HttpResponse) {
              const body: string[] = [];
              if (event.body && event.body[0] && event.body[0].indexOf('been a while since your') > -1) {
                
              }
              if (event.body && event.body[0]) {
                body.push(event.body[0]);
              }
              body.push("<span class='bold text-danger'>Public IP is changed to 141.147.136.15 from 10th March 12:00 AM. Please whitelist this IP to allow outgoing traffic from Desktop Application for Waseel and Waseel-Connect, in case if you have any firewalls configured.</span>");
              this.settingsService.checkCertificateExpiry(providerId).subscribe((event: any) => {
                if (event instanceof HttpResponse) {
                  if (event.body && event.body.message) {
                    if (event.body.message.indexOf('Your Provider Certificate is expiring') > -1) {
                      body.push(event.body.message.replace("Provider Certificate is expiring", '<span class="bold text-danger">Provider Certificate is expiring</span>'));
                    }
                    else if (event.body.message.indexOf('Your Provider Certificate has expired') > -1) {
                      body.push(event.body.message.replace("Provider Certificate has expired", '<span class="bold text-danger">Provider Certificate has expired</span>'));
                    }
                    else {
                      body.push(event.body.message);
                    }
                  }
                  this.dialogService.showAlerts(body);
                  localStorage.setItem(`lastDateAlertAppeared:${providerId}`, yearMonthDay);
                }
              });
            }
          }, error => {
            this.settingsService.checkCertificateExpiry(providerId).subscribe((event: any) => {
              if (event instanceof HttpResponse) {
                const body: string[] = [];
                if (event.body && event.body.message) {
                  if (event.body.message.indexOf('Your Provider Certificate is expiring') > -1) {
                    body.push(event.body.message.replace("Provider Certificate is expiring", '<span class="bold text-danger">Provider Certificate is expiring</span>'));
                  }
                  else if (event.body.message.indexOf('Your Provider Certificate has expired') > -1) {
                    body.push(event.body.message.replace("Provider Certificate has expired", '<span class="bold text-danger">Provider Certificate has expired</span>'));
                  }
                  else {
                    body.push(event.body.message);
                  }
                }
                this.dialogService.showAlerts(body);
                localStorage.setItem(`lastDateAlertAppeared:${providerId}`, yearMonthDay);
              }
            });
          });
        } else {
          const lastDateAlertAppeared = localStorage.getItem(`lastDateUpcomingAlertAppeared:${providerId}`);
          let yearMonthDay = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

          if (lastDateAlertAppeared != null && lastDateAlertAppeared == yearMonthDay) {
            return null;
          }

          this.dialogService.showUpcomingFeatures();
          localStorage.setItem(`lastDateUpcomingAlertAppeared:${providerId}`, yearMonthDay);
        }

      }
    })
  ), { dispatch: false });

}
