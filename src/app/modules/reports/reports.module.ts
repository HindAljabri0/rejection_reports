import { CommonModule, DatePipe, PercentPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CreditReportService } from 'src/app/services/creditReportService/creditReport.service';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { CleanClaimProgressReportComponent } from './components/clean-claim-progress-report/clean-claim-progress-report.component';
import { RejectedClaimProgressReportComponent } from './components/rejected-claim-progress-report/rejected-claim-progress-report.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { TawuniyaCreditReportDetailsComponent } from './components/tawuniya-credit-report-details/tawuniya-credit-report-details.component';
import {
  TawuniyaCreditReportDetailsDialogComponent
} from './components/tawuniya-credit-report-details-dialog/tawuniya-credit-report-details-dialog.component';
import {
  CreditReportCreateConfirmDialogComponent
} from './components/credit-report-create-confirm-dialog/credit-report-create-confirm-dialog.component';
import { CreditReportCreateComponent } from './components/credit-report-create/credit-report-create.component';
import { CreditReportListComponent } from './components/credit-report-list/credit-report-list.component';
import { CreditReportSummaryDetailsComponent } from './components/credit-report-summary-details/credit-report-summary-details.component';
import { CreditReportSummaryComponent } from './components/credit-report-summary/credit-report-summary.component';
import { CreditReportUploadModalComponent } from './components/credit-report-upload-modal/credit-report-upload-modal.component';
import { ClaimSubmissionsComponent } from './components/claim-submissions/claim-submissions.component';
import { RevenueReportComponent } from './components/revenue-report/revenue-report.component';
import { RevenueTrackingReportComponent } from './components/revenue-tracking-report/revenue-tracking-report.component';
import { TawuniyaCreditReportErrorsDialogComponent } from './components/tawuniya-credit-report-errors-dialog/tawuniya-credit-report-errors-dialog.component';
import { RevenueBreakdownReportComponent } from './components/revenue-breakdown-report/revenue-breakdown-report.component';
import { RevenueComparativeReportComponent } from './components/revenue-comparative-report/revenue-comparative-report.component';
import { RevenueComparativeReportCostClaimComponent } from './components/revenue-comparative-report-cost-claim/revenue-comparative-report-cost-claim.component';

@NgModule({
  declarations: [
    CreditReportCreateComponent,
    CleanClaimProgressReportComponent,
    CreditReportListComponent,
    CreditReportUploadModalComponent,
    CreditReportSummaryComponent,
    CreditReportSummaryDetailsComponent,
    RejectedClaimProgressReportComponent,
    CreditReportCreateConfirmDialogComponent,
    TawuniyaCreditReportDetailsComponent,
    TawuniyaCreditReportDetailsDialogComponent,
    ClaimSubmissionsComponent,
    RevenueReportComponent,
    RevenueTrackingReportComponent,
    TawuniyaCreditReportErrorsDialogComponent,
    RevenueBreakdownReportComponent,
    RevenueComparativeReportComponent,
    RevenueComparativeReportCostClaimComponent
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
  providers: [PercentPipe, DatePipe, CreditReportService],
  entryComponents: [
    CreditReportCreateConfirmDialogComponent,
    TawuniyaCreditReportDetailsDialogComponent,
    CreditReportUploadModalComponent,
    TawuniyaCreditReportErrorsDialogComponent
  ]
})
export class ReportsModule { }
