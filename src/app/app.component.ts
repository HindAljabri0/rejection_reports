import { AuthService } from './services/authService/authService.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

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
  ) {
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event) => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  ngOnInit() {
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
