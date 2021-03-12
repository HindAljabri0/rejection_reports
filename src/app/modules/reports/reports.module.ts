import { NgModule } from '@angular/core';
import { CommonModule, PercentPipe, DatePipe } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { BupaRejectionReportComponent } from './components/bupa-rejection-report/bupa-rejection-report.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { CleanClaimProgressReportComponent } from './components/clean-claim-progress-report/clean-claim-progress-report.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared.module';
import { BupaRejectionListComponent } from './components/bupa-rejection-list/bupa-rejection-list.component';
import { BupaRejectionUploadModalComponent } from './components/bupa-rejection-upload-modal/bupa-rejection-upload-modal.component';
import { BupaRejectionUploadSummaryComponent } from './components/bupa-rejection-upload-summary/bupa-rejection-upload-summary.component';
import { BupaRejectionUploadDetailsComponent } from './components/bupa-rejection-upload-details/bupa-rejection-upload-details.component';
import { UploadRejectionFileService } from 'src/app/services/uploadRejectionFileService/uploadRejectionFile.service';
import { RejectedClaimProgressReportComponent } from './components/rejected-claim-progress-report/rejected-claim-progress-report.component';

@NgModule({
  declarations: [
    BupaRejectionReportComponent,
    CleanClaimProgressReportComponent,
    BupaRejectionListComponent,
    BupaRejectionUploadModalComponent,
    BupaRejectionUploadSummaryComponent,
    BupaRejectionUploadDetailsComponent,
    RejectedClaimProgressReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule,
    MaterialModule,
    FormsModule,
    BsDatepickerModule,
    ChartsModule
  ],
  providers: [PercentPipe, DatePipe, UploadRejectionFileService],
  entryComponents: [BupaRejectionUploadModalComponent]
})
export class ReportsModule { }
