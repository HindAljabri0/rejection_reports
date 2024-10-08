import { CommonModule, DatePipe, PercentPipe, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import {
  TawuniyaCreditReportErrorsDialogComponent
} from './components/tawuniya-credit-report-errors-dialog/tawuniya-credit-report-errors-dialog.component';
import { RevenueBreakdownReportComponent } from './components/revenue-breakdown-report/revenue-breakdown-report.component';
import { RevenueComparativeReportComponent } from './components/revenue-comparative-report/revenue-comparative-report.component';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { ClaimStatusSummaryReportComponent } from 'src/app/pages/reports/claim-summary-status-report/claim-status-summary-report.component';
import { RejectionTrackingReportComponent } from './components/rejection-tracking-report/rejection-tracking-report.component';
import { RejectionBreakdownReportComponent } from './components/rejection-breakdown-report/rejection-breakdown-report.component';
import { MedicalRejctionReportComponent } from 'src/app/pages/reports/medical-rejction-report/medical-rejction-report.component';
import { RejectionComparisonReportComponent } from './components/rejection-comparison-report/rejection-comparison-report.component';
import { ClaimsCoverLetterComponent } from './components/claims-cover-letter/claims-cover-letter.component';
import { PayerClaimsReportComponent } from './components/payer-claims-report/payer-claims-report.component';



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
    RejectionTrackingReportComponent,
    MedicalRejctionReportComponent,
    ClaimStatusSummaryReportComponent,
    RejectionBreakdownReportComponent,
    RejectionComparisonReportComponent,
    ClaimsCoverLetterComponent,
    PayerClaimsReportComponent,
  ],
  imports: [
   
    CommonModule,
    SharedModule,
    ReportsRoutingModule,
    MaterialModule,
    FormsModule,
    BsDatepickerModule,
    ChartsModule,
    NgScrollbarModule,
    SmoothScrollModule,
    ReactiveFormsModule
  ],
  providers: [PercentPipe, DatePipe, CreditReportService, CurrencyPipe],
  entryComponents: [
    
    CreditReportCreateConfirmDialogComponent,
    TawuniyaCreditReportDetailsDialogComponent,
    CreditReportUploadModalComponent,
    TawuniyaCreditReportErrorsDialogComponent
  ]
})
export class ReportsModule { }
