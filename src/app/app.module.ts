import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClaimfileuploadComponent } from './claimpage/claimfileupload/claimfileupload.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { UploadService } from './claimpage/claimfileuploadservice/upload.service';
import { HttpClientModule } from '@angular/common/http';
import { ClaimsummaryComponent } from './claimpage/claimsummary/claimsummary.component';
import { NotuploadedsummaryComponent } from './claimpage/claimsummary/notuploadedsummary/notuploadedsummary.component';
import { DetailscardComponent } from './detailscard/detailscard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { ClaimpageComponent } from './claimpage/claimpage.component';
import { AbstractcardComponent } from './abstractcard/abstractcard.component';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    ClaimfileuploadComponent,
    SidebarComponent,
    HeaderComponent,
    ClaimsummaryComponent,
    NotuploadedsummaryComponent,
    DetailscardComponent,
    ClaimpageComponent,
    AbstractcardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatExpansionModule,
  ],
  providers: [UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
