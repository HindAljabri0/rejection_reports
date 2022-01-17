import { AuthService } from './services/authService/authService.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { VersionCheckService } from './services/versionCheckService/version-check.service';
import { environment } from 'src/environments/environment';
import { SharedServices } from './services/shared.services';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Waseel E-Claims';
  private ngUnsubscribe = new Subject<void>();

  constructor(
    public authService: AuthService,
    private sharedServices: SharedServices,
    private router: Router,
    readonly viewportScroller: ViewportScroller,
    private versionCheckService: VersionCheckService
  ) {

    if (environment.GA_TRACKING_ID) {
      this.addGAScript();
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        /** START : Code to Track Page View  */
        gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects
        });
        /** END */
      });
    }

    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event) => {
      this.viewportScroller.scrollToPosition([0, 0]);
      document.body.classList.remove('nav-open');
      document.getElementsByTagName('html')[0].classList.remove('nav-open');
    });
  }

  ngOnInit() {
    localStorage.setItem('lastVisitedPath', location.pathname.replace('/en/', '').replace('/ar/', ''));
    this.versionCheckService.initVersionCheck(environment.versionCheckURL + (location.pathname.includes('/en') ? '/en' : '/ar'));
    setInterval(() => this.authService.loggedIn, 1000 * 60);
  }

  /** Add Google Analytics Script Dynamically */
  addGAScript() {
    const gtagScript: HTMLScriptElement = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.GA_TRACKING_ID;
    document.head.prepend(gtagScript);

    // /** Disable automatic page view hit to fix duplicate page view count  **/
    gtag('config', environment.GA_TRACKING_ID, { send_page_view: false });
  }

  get isLoggedIn() {
    return this.authService.loggedIn;
  }

  get loading(): boolean {
    return this.sharedServices.loading;
  }

  ngOnDestroy() {
    // unsubscribe all the observable
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
