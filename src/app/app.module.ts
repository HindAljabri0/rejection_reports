import { LoginComponent } from './pages/loginpage/login.component';
import { LoginWithTokenComponent } from './pages/loginpage-with-token/login-with-token.component';
import { ReportsComponent } from './pages/reports/reports-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppComponent } from './app.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SearchClaimsComponent } from './pages/searchClaimsPage/search-claims.component';
import { ClaimfileuploadComponent } from './pages/claimUploadignPage/claimfileupload/claimfileupload.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { ClaimsummaryComponent } from './pages/claimUploadignPage/claimsummary/claimsummary.component';
import { ClaimpageComponent } from './pages/claimUploadignPage/claimpage.component';
import { AbstractcardComponent } from './components/reusables/abstractcard/abstractcard.component';
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
import {
    RejectionReportClaimDialogComponent
} from './components/dialogs/rejection-report-claim-dialog/rejection-report-claim-dialog.component';
import { UploadsCenterComponent } from './components/uploads-center/uploads-center.component';
import { UploadsHistoryComponent } from './pages/uploads-history/uploads-history.component';
import { RejectionReportComponent } from './pages/reports/rejection-report/rejection-report.component';
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

import { SummaryComponent } from './pages/reports/globmed/summary/summary.component';
import { GmReportsPageComponent } from './pages/reports/globmed/gm-reports-page.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import {
    UploadSummaryDialogComponent
} from './pages/claimUploadignPage/claimsummary/upload-summary-dialog/upload-summary-dialog.component';
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
import { ChangeLogDialogComponent } from './components/change-log-dialog/change-log-dialog.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AttachmentViewDialogComponent } from './components/dialogs/attachment-view-dialog/attachment-view-dialog.component';
import { ConfiguartionModalComponent } from './pages/configuartion-modal/configuartion-modal.component';
import { UploadsPageComponent } from './pages/uploads-page/uploads-page.component';
import { UploadCardComponent } from './pages/uploads-page/components/upload-card/upload-card.component';
import { JsonViewDialogComponent } from './components/dialogs/json-view-dialog/json-view-dialog.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { DownloadOverlayComponent } from './components/reusables/download-overlay/download-overlay.component';
import { DownloadProgressViewComponent } from './components/download-progress-view/download-progress-view.component';
import { ConfirmAdminDeleteDialogComponent } from './components/dialogs/confirm-admin-delete-dialog/confirm-admin-delete-dialog.component';
import { XmlViewDialogComponent } from './components/dialogs/xml-view-dialog/xml-view-dialog.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { EditClaimComponent } from './pages/edit-claim/edit-claim.component';
import { ClaimModule } from './modules/claim/claim.module';
import { ConfirmationAlertDialogComponent } from './components/confirmation-alert-dialog/confirmation-alert-dialog.component';
import { GeneralSummaryStatementReportComponent } from './pages/reports/general-summary-statement-report/general-summary-statement-report.component';
import { NphiesSearchClaimsComponent } from './modules/nphies/nphies-search-claims/nphies-search-claims.component';
import { CertificateConfigurationComponent } from './pages/certificate-configuration/certificate-configuration.component';
import { CertificateConfigurationModelComponent } from './pages/certificate-configuration-model/certificate-configuration-model.component';
import { UploadClaimComponent } from './modules/nphies/upload-claim/upload-claim.component';
import { NphiesClaimSummaryComponent } from './modules/nphies/upload-claim/nphies-claim-summary/nphies-claim-summary.component';
import { MultiSheetFileUploadComponent } from './modules/nphies/upload-claim/multi-sheet-file-upload/multi-sheet-file-upload.component';
import { NphiesClaimUploaderService } from './services/nphiesClaimUploaderService/nphies-claim-uploader.service';
import { AlertDialogComponent } from './components/dialogs/alert-dialog/alert-dialog.component';
import { UpcomingFeatureDialogComponent } from './components/dialogs/upcoming-feature-dialog/upcoming-feature-dialog.component';
import { FeedbackDialogComponent } from './components/dialogs/feedback-dialog/feedback-dialog.component';
import { ChooseAttachmentUploadDialogComponent } from './modules/nphies/choose-attachment-upload-dialog/choose-attachment-upload-dialog.component';
import { HttpRequestExceptionHandler } from './components/reusables/feedbackExceptionHandling/HttpRequestExceptionHandler';
import { SafeHTMLPipe } from './safe-html.pipe';


@NgModule({
    declarations: [
        AppComponent,
        ClaimfileuploadComponent,
        SidebarComponent,
        HeaderComponent,
        ClaimsummaryComponent,
        UploadSummaryDialogComponent,
        ClaimpageComponent,
        AbstractcardComponent,
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
        LoginWithTokenComponent,
        ReportsComponent,
        DashboardComponent,
        SearchWithAdvanceComponent,
        PaymentReferenceReportComponent,
        GeneralSummaryStatementReportComponent,
        PaymentClaimDetailDailogComponent,
        PaymentClaimSummaryReportComponent,
        SubmittedInvoicesComponent,
        RejectionReportClaimDialogComponent,
        UploadsCenterComponent,
        UploadsHistoryComponent,
        // ScrollableDirective,
        RejectionReportComponent,
        LanguageSwitcherComponent,
        SearchCriteriaComponent,
        NonSubmittedClaimsComponent,
        SubmittedClaimsComponent,
        TopFiveRejectionsComponent,
        RejectionCardComponent,
        ClaimAttachmentsManagementComponent,
        ImageToolTipDirective,
        ImageTooltipComponent,
        SummaryComponent,
        GmReportsPageComponent,
        ChangeLogDialogComponent,
        MainLayoutComponent,
        AttachmentViewDialogComponent,
        ConfiguartionModalComponent,
        UploadsPageComponent,
        UploadCardComponent,
        JsonViewDialogComponent,
        DownloadOverlayComponent,
        DownloadProgressViewComponent,
        ConfirmAdminDeleteDialogComponent,
        XmlViewDialogComponent,
        EditClaimComponent,
        ConfirmationAlertDialogComponent,
        NphiesSearchClaimsComponent,
        CertificateConfigurationComponent,
        CertificateConfigurationModelComponent,
        UploadClaimComponent,
        MultiSheetFileUploadComponent,
        NphiesClaimSummaryComponent,
        AlertDialogComponent,
        UpcomingFeatureDialogComponent,
        FeedbackDialogComponent,
        ChooseAttachmentUploadDialogComponent,
        SafeHTMLPipe
    ],
    imports: [
        AppRoutingModule,
        StoreModule.forRoot({ mainState: mainReducer, dashboardState: dashboardReducer, searchState: searchReducer }),
        EffectsModule.forRoot([DashboardEffects, MainStoreEffects, SearchEffects]),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ScrollingModule,
        InfiniteScrollModule,
        MaterialModule,
        SharedModule,
        ChartsModule,
        CarouselModule,
        NgScrollbarModule,
        SmoothScrollModule,
        GuidedTourModule,
        BsDatepickerModule.forRoot(),
        NgxJsonViewerModule,
        ClipboardModule,
        MonacoEditorModule.forRoot(),
        ClaimModule
    ],
    providers: [
        ThemeService,
        UploadService,
        NphiesClaimUploaderService,
        ClipboardService,
        HttpRequestExceptionHandler,
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
        GuidedTourService
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
        DownloadOverlayComponent,
        ConfirmAdminDeleteDialogComponent,
        AlertDialogComponent
    ],
    entryComponents: [
        MessageDialogComponent,
        ClaimDialogComponent,
        AlertDialogComponent,
        PaymentClaimDetailDailogComponent,
        RejectionReportClaimDialogComponent,
        NonSubmittedClaimsComponent,
        SubmittedClaimsComponent,
        TopFiveRejectionsComponent,
        ImageTooltipComponent,
        UploadSummaryDialogComponent,
        ChangeLogDialogComponent,
        AttachmentViewDialogComponent,
        JsonViewDialogComponent,
        ConfiguartionModalComponent,
        DownloadOverlayComponent,
        ConfirmAdminDeleteDialogComponent,
        XmlViewDialogComponent,
        EditClaimComponent,
        ConfirmationAlertDialogComponent,
        CertificateConfigurationModelComponent,
        UpcomingFeatureDialogComponent,
        FeedbackDialogComponent,
        ChooseAttachmentUploadDialogComponent
    ],
})
export class AppModule { }
// platformBrowserDynamic().bootstrapModule(AppModule);
