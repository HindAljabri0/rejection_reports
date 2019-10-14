import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClaimfileuploadComponent } from './claimfileupload/claimfileupload.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { UploadService } from './claimfileuploadservice/upload.service';
import { HttpClientModule } from '@angular/common/http';
import { ClaimsummaryComponent } from './claimsummary/claimsummary.component';
import { NotuploadedsummaryComponent } from './claimsummary/notuploadedsummary/notuploadedsummary.component';

@NgModule({
  declarations: [
    AppComponent,
    ClaimfileuploadComponent,
    SidebarComponent,
    HeaderComponent,
    ClaimsummaryComponent,
    NotuploadedsummaryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
