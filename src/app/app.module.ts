import { LoginComponent } from './pages/loginpage/login.component';
// import { JwtModule } from '@auth0/angular-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component';
import { StepperProgressBarModule } from 'stepper-progress-bar';
import { MatDividerModule, MatProgressSpinnerModule, MatDialogModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatIconModule, MatInputModule, MatCardModule, MatButtonModule, MatGridListModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatToolbarModule, MatRippleModule, MatCheckboxModule, MatExpansionModule } from '@angular/material';

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

//https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD'
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
  ],
  imports: [
    RouterModule.forRoot([
      { path: '', component:  ClaimpageComponent},
      { path: ':providerId/claims', component: SearchClaimsComponent },
      { path: ':providerId/notifications', component: NotificationsPageComponent},
      { path: 'login', component: LoginComponent },
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
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    ScrollingModule,
    MatProgressSpinnerModule,
       
  ],
  providers: [
    UploadService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
  exports: [
    MessageDialogComponent,
    ClaimDialogComponent,
  ],
  entryComponents: [
    MessageDialogComponent,
    ClaimDialogComponent
  ],
})
export class AppModule { }
