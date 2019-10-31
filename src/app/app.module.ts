import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { MatDividerModule, MatProgressBarModule, MatSelectModule, MatIconModule, MatInputModule, MatCardModule, MatButtonModule, MatGridListModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatToolbarModule, MatRippleModule, MatCheckboxModule, MatExpansionModule } from '@angular/material';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchClaimsComponent } from './search-claims/search-claims.component'
import { from } from 'rxjs';
import { componentFactoryName } from '@angular/compiler';


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
  ],
  providers: [UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
