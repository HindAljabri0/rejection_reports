import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { TawuniyaGssComponent } from './tawuniya-gss.component';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { TawuniyaGssReportDetailsComponent } from './tawuniya-gss-report-details/tawuniya-gss-report-details.component';
import { TawuniyaGssGenerateReportDialogComponent } from './tawuniya-gss-generate-report-dialog/tawuniya-gss-generate-report-dialog.component';



@NgModule({
  declarations: [TawuniyaGssComponent, TawuniyaGssReportDetailsComponent, TawuniyaGssGenerateReportDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: TawuniyaGssComponent },
      { path: ':gssReferenceNumber/report-details', component: TawuniyaGssReportDetailsComponent }
    ]),
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    NgScrollbarModule,
    SmoothScrollModule,
  ],
  entryComponents: [
    TawuniyaGssGenerateReportDialogComponent
  ]
})
export class TawuniyaGssModule { }
