import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'
import { AppComponent } from './app.component';
import { ClaimfileuploadComponent } from './claimpage/claimfileupload/claimfileupload.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { UploadService } from './claimpage/claimfileuploadservice/upload.service';
import { HttpClientModule } from '@angular/common/http';
import { ClaimsummaryComponent } from './claimpage/claimsummary/claimsummary.component';
import { DetailscardComponent } from './detailscard/detailscard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClaimpageComponent } from './claimpage/claimpage.component';
import { AbstractcardComponent } from './abstractcard/abstractcard.component';
import { DragdropDirective } from './claimpage/claimfileupload/dragdrop.directive';
import { StepperProgressBarModule } from 'stepper-progress-bar';
import { MatDividerModule, MatDialogModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatIconModule, MatInputModule, MatCardModule, MatButtonModule, MatGridListModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatToolbarModule, MatRippleModule, MatCheckboxModule, MatExpansionModule } from '@angular/material';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchClaimsComponent } from './search-claims/search-claims.component'
import { from } from 'rxjs';
import { componentFactoryName } from '@angular/compiler';
import { MessageDialogComponent } from './dialogs/message-dialog/message-dialog.component';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


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
  ],
  imports: [
    RouterModule.forRoot([
      { path: '', component:  ClaimpageComponent},
      { path: ':providerId/claims', component: SearchClaimsComponent },
    ]),
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
  ],
  providers: [
    UploadService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  bootstrap: [AppComponent],
  exports: [
    MessageDialogComponent,
  ],
  entryComponents: [MessageDialogComponent],
})
export class AppModule { }
