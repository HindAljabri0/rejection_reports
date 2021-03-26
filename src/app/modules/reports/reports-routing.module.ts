import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaimSubmissionsComponent } from './components/claim-submissions/claim-submissions.component';

import { CleanClaimProgressReportComponent } from './components/clean-claim-progress-report/clean-claim-progress-report.component';
import { CreditReportCreateComponent } from './components/credit-report-create/credit-report-create.component';
import { CreditReportListComponent } from './components/credit-report-list/credit-report-list.component';
import { CreditReportSummaryDetailsComponent } from './components/credit-report-summary-details/credit-report-summary-details.component';
import { CreditReportSummaryComponent } from './components/credit-report-summary/credit-report-summary.component';
import { RejectedClaimProgressReportComponent } from './components/rejected-claim-progress-report/rejected-claim-progress-report.component';
import { TawuniyaCreditReportDetailsComponent } from './components/tawuniya-credit-report-details/tawuniya-credit-report-details.component';

const routes: Routes = [
  { path: 'creditReportCreate', component: CreditReportCreateComponent },
  { path: 'clean-claim-progress-reports', component: CleanClaimProgressReportComponent },
  { path: 'rejected-claim-progress-reports', component: RejectedClaimProgressReportComponent },
  { path: 'creditReportList', component: CreditReportListComponent },
  { path: 'creditReportSummary', component: CreditReportSummaryComponent },
  { path: 'creditReportSummaryDetails', component: CreditReportSummaryDetailsComponent },
  { path: 'tawuniya-credit-report-details', component: TawuniyaCreditReportDetailsComponent },
  { path: 'claim-submissions', component: ClaimSubmissionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
