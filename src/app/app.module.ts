import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ClaimfileuploadComponent } from './app/claimfileupload/claimfileupload.component';

@NgModule({
  declarations: [
    AppComponent,
    ClaimfileuploadComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
