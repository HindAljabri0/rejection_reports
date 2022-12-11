import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/authService/authService.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { filter } from 'rxjs/operators';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login-with-token.component.html',
  styles: []
})

export class LoginWithTokenComponent implements OnInit {

  languageList = [ // <--- add this
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ar', label: 'عربى', dir: 'rtl' }
  ];

  activeLanguageLabel = 'English';

  iamToken = new FormControl();
  //password = new FormControl();

  isLoading = false;

  errors: string;

  expired: boolean;

  isRamadan = false;


  isEidFitr = false;
  isEidAdha = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    public routeActive: ActivatedRoute,
    public commen: SharedServices,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) protected locale: string
  ) {
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.routeActive.queryParams.subscribe(value => {
        if (value.expired != null && value.expired) {
          this.errors = 'Your session have been expired. Please sign in again.';
        } else if (value.hasClaimPrivileges != null && value.hasClaimPrivileges) {
          this.errors = `The user you used does not have the required privileges to use this system.`;
        }
      });
    });
    if (this.authService.loggedIn) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    if (this.locale.startsWith('ar')) {
      this.activeLanguageLabel = 'عربى';
      // this.dir = 'rtl';
    }

    this.document.documentElement.lang = this.locale;
  }

  login() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    if (this.iamToken.value == undefined || this.iamToken.value == '') {
      this.errors = 'Please provide a valid Token!';
      this.isLoading = false;
      return;
    }

    this.authService.loginWithToken(this.iamToken.value).subscribe(event => {
      if (event instanceof HttpResponse) {
        this.authService.isUserNameUpdated.subscribe(updated => {
          if (updated && location.href.includes('login') || location.href.endsWith('/en/') || location.href.endsWith('/ar/')) {
            const lastVisitedPath = localStorage.getItem('lastVisitedPath');
            if (lastVisitedPath != null && lastVisitedPath.trim().length > 0 && !lastVisitedPath.includes('login')) {
              this.router.navigate(lastVisitedPath.split('/'));
            } else {
              this.router.navigate(['/']);
            }
            this.isLoading = false;
          }
        });
        this.authService.setTokens(event.body);
      }
    }, errorEvent => {
      if (errorEvent instanceof HttpErrorResponse) {

        if (errorEvent.status == 403) {
          this.errors = 'Your account has been blocked, kindly contact Waseel Customer Care!';
        }
        else if (errorEvent.status < 500 && errorEvent.status >= 400) {
          this.errors = 'Token is invalid!';
        } else {
          this.errors = 'Could not reach server at the moment. Please try again later.';
        }
        this.isLoading = false;
      }
    });
  }

  getYear() {
    return new Date().getFullYear();
  }

  isCloseToNationalDay() {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    return (month == 9 && day >= 19 && day <= 25);
  }
}
