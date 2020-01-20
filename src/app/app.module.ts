import { LoginComponent } from './pages/loginpage/login.component';
import { ReportsComponent } from './pages/reports/reports-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AppComponent } from './app.component';
import { StepperProgressBarModule } from 'stepper-progress-bar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { SearchClaimsComponent } from './pages/searchClaimsPage/search-claims.component'
import { ClaimfileuploadComponent } from './pages/claimUploadignPage/claimfileupload/claimfileupload.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ClaimsummaryComponent } from './pages/claimUploadignPage/claimsummary/claimsummary.component';
import { DetailscardComponent } from './components/reusables/detailscard/detailscard.component';
import { ClaimpageComponent } from './pages/claimUploadignPage/claimpage.component';
import { AbstractcardComponent } from './components/reusables/abstractcard/abstractcard.component';
import { DragdropDirective } from './pages/claimUploadignPage/claimfileupload/dragdrop.directive';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { MessageDialogComponent } from './components/dialogs/message-dialog/message-dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UploadService } from './services/claimfileuploadservice/upload.service';
import { NotificationCenterComponent } from './components/notification-center/notification-center.component';
import { NotificationCardComponent } from './components/reusables/notification-card/notification-card.component';
import { ClaimDialogComponent } from './components/dialogs/claim-dialog/claim-dialog.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { RequestInterceptorService } from './services/RequestInterceptorService/request-interceptor.service';
import { RouteCanActiveService } from './services/routeCanActive/route-can-active.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SearchWithAdvanceComponent } from './components/search-with-advance/search-with-advance.component';
import { from } from 'rxjs';
import { PaymentReferenceReportComponent } from './pages/reports/payment-reference-report/payment-reference-report.component';
import { PaymentClaimDetailDailogComponent } from './components/dialogs/payment-claim-detail-dailog/payment-claim-detail-dailog.component';
import { PaymentClaimSummaryReportComponent } from './pages/reports/payment-claim-summary-report/payment-claim-summary-report.component';
import { SubmittedInvoicesComponent } from './pages/reports/submitted-invoices/submitted-invoices.component';

import { RejectionReportClaimDialogComponent } from './components/dialogs/rejection-report-claim-dialog/rejection-report-claim-dialog.component';
import { UploadHistoryCenterComponent } from './components/upload-history-center/upload-history-center.component';
import { UploadHistoryCardComponent } from './components/reusables/upload-history-card/upload-history-card.component';
import { UploadsHistoryComponent } from './pages/uploads-history/uploads-history.component';
import { ScrollableDirective } from './directives/scrollable/scrollable.directive';
import { RejectionReportComponent } from './pages/reports/rejection-report/rejection-report.component';
import { ReusableSearchBarComponent } from './components/reusables/reusable-search-bar/reusable-search-bar.component';
import { MatiralModule } from './modules/matiral/matiral.module';




@NgModule({
  declarations: [
    AppComponent,
    ClaimfileuploadComponent,
    SidebarComponent,
    HeaderComponent,
    ClaimsummaryComponent,
    DetailscardComponent,
    ClaimpageComponent,
    AbstractcardComponent,
    DragdropDirective,
    SearchBarComponent,
    SearchClaimsComponent,
    MessageDialogComponent,
    NotificationCenterComponent,
    NotificationCardComponent,
    ClaimDialogComponent,
    NotificationsPageComponent,
    LoginComponent,
    ReportsComponent,
    DashboardComponent,
    SearchWithAdvanceComponent,
    PaymentReferenceReportComponent,
    PaymentClaimDetailDailogComponent,
    PaymentClaimSummaryReportComponent,
    SubmittedInvoicesComponent,
    RejectionReportClaimDialogComponent,
    UploadHistoryCenterComponent,
    UploadHistoryCardComponent,
    UploadsHistoryComponent,
    ScrollableDirective,
    RejectionReportComponent,
    ReusableSearchBarComponent,
  ],
  imports: [
    RouterModule.forRoot([
      { path: '', component: DashboardComponent, canActivate: [RouteCanActiveService] },
      { path: ':providerId/claims', component: SearchClaimsComponent, canActivate: [RouteCanActiveService] },
      { path: ':providerId/notifications', component: NotificationsPageComponent, canActivate: [RouteCanActiveService] },
      { path: 'login', component: LoginComponent },
      { path: 'upload', component: ClaimpageComponent, canActivate: [RouteCanActiveService] },
      { path: 'upload/history', component: UploadsHistoryComponent, canActivate: [RouteCanActiveService] },
      { path: 'summary', component: ClaimpageComponent, canActivate: [RouteCanActiveService] },
      { path: ':providerId/reports', component: ReportsComponent, canActivate: [RouteCanActiveService] },
      {
        path: 'administration',
        loadChildren: () => import('./modules/adminstration/adminstration.module').then(m => m.AdminstrationModule),
        canLoad: [RouteCanActiveService]
      }

    ]),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StepperProgressBarModule,
    ReactiveFormsModule,
    FormsModule,
    ScrollingModule,
    InfiniteScrollModule,
    MatiralModule,
  ],
  providers: [
    UploadService,
    
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true },
    {
      provide: 'RouteCanActiveService',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => true
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    MessageDialogComponent,
    ClaimDialogComponent,
    PaymentClaimDetailDailogComponent,
    RejectionReportClaimDialogComponent,
  ],
  entryComponents: [
    MessageDialogComponent,
    ClaimDialogComponent,
    PaymentClaimDetailDailogComponent,
    RejectionReportClaimDialogComponent,
  ],
})
export class AppModule { }
// platformBrowserDynamic().bootstrapModule(AppModule);
