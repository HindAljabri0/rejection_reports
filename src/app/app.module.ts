import { LoginComponent } from './pages/loginpage/login.component';
import { ReportsComponent } from './pages/reports/reports-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AppComponent } from './app.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SearchClaimsComponent } from './pages/searchClaimsPage/search-claims.component'
import { ClaimfileuploadComponent } from './pages/claimUploadignPage/claimfileupload/claimfileupload.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ClaimsummaryComponent } from './pages/claimUploadignPage/claimsummary/claimsummary.component';
import { ClaimpageComponent } from './pages/claimUploadignPage/claimpage.component';
import { AbstractcardComponent } from './components/reusables/abstractcard/abstractcard.component';
import { DragdropDirective } from './pages/claimUploadignPage/claimfileupload/dragdrop.directive';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { MessageDialogComponent } from './components/dialogs/message-dialog/message-dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UploadService } from './services/claimfileuploadservice/upload.service';
import { NotificationCenterComponent } from './components/notification-center/notification-center.component';
import { NotificationCardComponent } from './components/reusables/notification-card/notification-card.component';
import { AnnouncementCenterComponent } from './components/announcement-center/announcement-center.component';
import { AnnouncementCardComponent } from './components/reusables/announcement-card/announcement-card.component';
import { ClaimDialogComponent } from './components/dialogs/claim-dialog/claim-dialog.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RequestInterceptorService } from './services/RequestInterceptorService/request-interceptor.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SearchWithAdvanceComponent } from './components/search-with-advance/search-with-advance.component';
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
import { MaterialModule } from './modules/material/material.module';
import { AnnouncementsPageComponent } from './pages/announcements-page/announcements-page.component';
import { SharedModule } from './modules/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { AppRoutingModule } from './modules/app-routing.module';
import { SearchCriteriaComponent } from './pages/dashboard/components/search-criteria/search-criteria.component';
import { NonSubmittedClaimsComponent } from './pages/dashboard/components/non-submitted-claims/non-submitted-claims.component';
import { SubmittedClaimsComponent } from './pages/dashboard/components/submitted-claims/submitted-claims.component';
import { dashboardReducer } from './pages/dashboard/store/dashboard.reducer';
import { DashboardEffects } from './pages/dashboard/store/dashboard.effects';
import { TopFiveRejectionsComponent } from './pages/dashboard/components/top-five-rejections/top-five-rejections.component';
import { RejectionCardComponent } from './pages/dashboard/components/rejection-card/rejection-card.component';
import { ChartsModule, ThemeService } from 'ng2-charts';
import { mainReducer } from './store/mainStore.reducer';
import { MainStoreEffects } from './store/mainStore.effects';
import { ClaimAttachmentsManagementComponent } from './components/claim-attachments-management/claim-attachments-management.component';
import { searchReducer } from './pages/searchClaimsPage/store/search.reducer';
import { SearchEffects } from './pages/searchClaimsPage/store/search.effects';
import { ImageTooltipComponent, ImageToolTipDirective } from './directives/imageToolTip/image-tool-tip.directive';


@NgModule({
  declarations: [
    AppComponent,
    ClaimfileuploadComponent,
    SidebarComponent,
    HeaderComponent,
    ClaimsummaryComponent,
    ClaimpageComponent,
    AbstractcardComponent,
    DragdropDirective,
    SearchBarComponent,
    SearchClaimsComponent,
    MessageDialogComponent,
    NotificationCenterComponent,
    NotificationCardComponent,
    AnnouncementCenterComponent,
    AnnouncementCardComponent,
    ClaimDialogComponent,
    NotificationsPageComponent,
    AnnouncementsPageComponent,
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
    LanguageSwitcherComponent,
    SearchCriteriaComponent,
    NonSubmittedClaimsComponent,
    SubmittedClaimsComponent,
    TopFiveRejectionsComponent,
    RejectionCardComponent,
    ClaimAttachmentsManagementComponent,
    ImageToolTipDirective,
    ImageTooltipComponent,
  ],
  imports: [
    AppRoutingModule,
    StoreModule.forRoot({ mainState: mainReducer, dashboardState: dashboardReducer, searchState: searchReducer }),
    EffectsModule.forRoot([DashboardEffects, MainStoreEffects, SearchEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ScrollingModule,
    InfiniteScrollModule,
    MaterialModule,
    SharedModule,
    ChartsModule,
  ],
  providers: [
    ThemeService,
    UploadService,
    // {
    //   provide: ApmService,
    //   useClass: ApmService,
    //   deps: [Router]
    // },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true },
    {
      provide: 'RouteCanActiveService',
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => true
    },
    // {
    //   provide: ErrorHandler,
    //   useClass: ApmErrorHandler
    // }
  ],
  bootstrap: [AppComponent],
  exports: [
    MessageDialogComponent,
    ClaimDialogComponent,
    PaymentClaimDetailDailogComponent,
    RejectionReportClaimDialogComponent,
    TopFiveRejectionsComponent,
  ],
  entryComponents: [
    MessageDialogComponent,
    ClaimDialogComponent,
    PaymentClaimDetailDailogComponent,
    RejectionReportClaimDialogComponent,
    NonSubmittedClaimsComponent,
    SubmittedClaimsComponent,
    TopFiveRejectionsComponent,
    ImageTooltipComponent
  ],
})
export class AppModule { }
// platformBrowserDynamic().bootstrapModule(AppModule);
