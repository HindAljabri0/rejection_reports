import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimSubmissionsComponent } from './components/claim-submissions/claim-submissions.component';

import { CleanClaimProgressReportComponent } from './components/clean-claim-progress-report/clean-claim-progress-report.component';
import { CreditReportCreateComponent } from './components/credit-report-create/credit-report-create.component';
import { CreditReportListComponent } from './components/credit-report-list/credit-report-list.component';
import { CreditReportSummaryDetailsComponent } from './components/credit-report-summary-details/credit-report-summary-details.component';
import { CreditReportSummaryComponent } from './components/credit-report-summary/credit-report-summary.component';
import { RejectedClaimProgressReportComponent } from './components/rejected-claim-progress-report/rejected-claim-progress-report.component';
import { RevenueBreakdownReportComponent } from './components/revenue-breakdown-report/revenue-breakdown-report.component';
import { RevenueComparativeReportComponent } from './components/revenue-comparative-report/revenue-comparative-report.component';
import { RevenueReportComponent } from './components/revenue-report/revenue-report.component';
import { RevenueTrackingReportComponent } from './components/revenue-tracking-report/revenue-tracking-report.component';
import { TawuniyaCreditReportDetailsComponent } from './components/tawuniya-credit-report-details/tawuniya-credit-report-details.component';
import { ClaimStatusSummaryReportComponent } from 'src/app/pages/reports/claim-summary-status-report/claim-status-summary-report.component';
import { RejectionTrackingReportComponent } from './components/rejection-tracking-report/rejection-tracking-report.component';
import { RejectionBreakdownReportComponent } from './components/rejection-breakdown-report/rejection-breakdown-report.component';
import { MedicalRejctionReportComponent } from 'src/app/pages/reports/medical-rejction-report/medical-rejction-report.component';
import { RejectionReportComponent } from 'src/app/pages/reports/rejection-report/rejection-report.component';
import { PaymentReferenceReportComponent } from 'src/app/pages/reports/payment-reference-report/payment-reference-report.component';
import { ReportsComponent } from 'src/app/pages/reports/reports-page.component';
import { GeneralSummaryStatementReportComponent } from 'src/app/pages/reports/general-summary-statement-report/general-summary-statement-report.component';
import { RejectionComparisonReportComponent } from './components/rejection-comparison-report/rejection-comparison-report.component';
import { ClaimsCoverLetterComponent } from './components/claims-cover-letter/claims-cover-letter.component';




const routes: Routes = [
  { path: 'creditReportCreate', component: CreditReportCreateComponent },
  { path: 'clean-claim-progress-reports', component: CleanClaimProgressReportComponent },
  { path: 'rejected-claim-progress-reports', component: RejectedClaimProgressReportComponent },
  { path: 'creditReports', component: CreditReportListComponent },
  { path: 'creditReportSummary', component: CreditReportSummaryComponent },
  { path: 'creditReportSummaryDetails', component: CreditReportSummaryDetailsComponent },
  { path: 'revenue-report', component: RevenueReportComponent },
  { path: 'creditReports/tawuniya/batch/:batchId', component: TawuniyaCreditReportDetailsComponent },
  { path: 'claim-submissions', component: ClaimSubmissionsComponent },
  { path: 'revenue-tracking-report', component: RevenueTrackingReportComponent },
  { path: 'revenue-report-breakdown', component: RevenueBreakdownReportComponent },
  { path: 'revenue-comparison-report', component: RevenueComparativeReportComponent },
  { path: 'claim-status-summary-report', component: ClaimStatusSummaryReportComponent },
  { path: 'rejection-tracking-report', component: RejectionTrackingReportComponent },
  { path: 'rejection-breakdown-report', component: RejectionBreakdownReportComponent },
  { path: 'medical-rejection-report', component: MedicalRejctionReportComponent },
  { path: 'rejection-comparison-report', component: RejectionComparisonReportComponent },
  { path: 'technical-rejection-report', component: RejectionReportComponent },
  { path: 'payment-report', component: PaymentReferenceReportComponent },
  { path: 'submission-report', component: ReportsComponent },
  { path: 'claims-cover-letter', component: ClaimsCoverLetterComponent },
  { path: 'general-summary-statement-report', component: GeneralSummaryStatementReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
