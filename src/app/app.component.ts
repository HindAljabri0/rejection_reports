import { AuthService } from './services/authService/authService.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { VersionCheckService } from './services/versionCheckService/version-check.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Waseele';
  private ngUnsubscribe = new Subject<void>();

  constructor(
    public authService: AuthService,
    private router: Router,
    readonly viewportScroller: ViewportScroller,
    private versionCheckService: VersionCheckService
  ) {
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event) => {
      this.viewportScroller.scrollToPosition([0, 0]);
      document.body.classList.remove('nav-open');
      document.getElementsByTagName('html')[0].classList.remove('nav-open');
    });
  }

  ngOnInit() {
    localStorage.setItem('lastVisitedPath', location.pathname.replace('/en/', '').replace('/ar/', ''));
    this.versionCheckService.initVersionCheck(environment.versionCheckURL);
  }

  get isLoggedIn() {
    return this.authService.loggedIn;
  }

  ngOnDestroy() {
    // unsubscribe all the observable
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
