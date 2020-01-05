import { LoginComponent } from './pages/loginpage/login.component';
import { ReportsComponent } from './pages/reports/reports-page.component';
// import { JwtModule } from '@auth0/angular-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AppComponent } from './app.component';
import { StepperProgressBarModule } from 'stepper-progress-bar';
import { MatAutocompleteModule, MatMenuModule, MatChipsModule, MatRadioModule, MatDividerModule, MatTooltipModule, MatProgressSpinnerModule, MatDialogModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatIconModule, MatInputModule, MatCardModule, MatButtonModule, MatGridListModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatToolbarModule, MatRippleModule, MatCheckboxModule, MatExpansionModule } from '@angular/material';

import { SearchClaimsComponent } from './pages/searchClaimsPage/search-claims.component'
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
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

import { ScrollingModule} from '@angular/cdk/scrolling';
import { RequestInterceptorService } from './services/RequestInterceptorService/request-interceptor.service';
import { RouteCanActiveService } from './services/routeCanActive/route-can-active.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SearchWithAdvanceComponent } from './components/search-with-advance/search-with-advance.component';
import { from } from 'rxjs';
import { PaymentReferenceReportComponent } from './pages/reports/payment-reference-report/payment-reference-report.component';
import { PaymentClaimDetailDailogComponent } from './components/dialogs/payment-claim-detail-dailog/payment-claim-detail-dailog.component';
import { PaymentClaimSummaryReportComponent } from './pages/reports/payment-claim-summary-report/payment-claim-summary-report.component';

//https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD/MM/YYYY ',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DD/MM/YYYY',
  },
};

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
  ],
  imports: [
    RouterModule.forRoot([
      { path: '', component:  DashboardComponent, canActivate:[RouteCanActiveService]},
      { path: ':providerId/claims', component: SearchClaimsComponent, canActivate:[RouteCanActiveService] },
      { path: ':providerId/notifications', component: NotificationsPageComponent, canActivate:[RouteCanActiveService]},
      { path: 'login', component: LoginComponent },
      { path: 'upload', component: ClaimpageComponent , canActivate:[RouteCanActiveService]},
      { path: 'summary', component: ClaimpageComponent , canActivate:[RouteCanActiveService]},
      { path: ':providerId/reports', component: ReportsComponent , canActivate:[RouteCanActiveService]},

    ]),
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: function  tokenGetter() {
    //          return     localStorage.getItem('access_token');},
    //     whitelistedDomains: ['localhost:4200'],
    //     blacklistedRoutes: ['http://localhost:4200/validate/login']
    //   }
    // }),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRippleModule,
    StepperProgressBarModule,
    MatToolbarModule,
    MatMenuModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatChipsModule,
    MatProgressBarModule,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatAutocompleteModule,
  ],
  providers: [
    UploadService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
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
  ],
  entryComponents: [
    MessageDialogComponent,
    ClaimDialogComponent,
    PaymentClaimDetailDailogComponent,
  ],
})
export class AppModule { }
