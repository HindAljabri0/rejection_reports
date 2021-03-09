import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BupaRejectionReportComponent } from './components/bupa-rejection-report/bupa-rejection-report.component';
import { CleanClaimProgressReportComponent } from './components/clean-claim-progress-report/clean-claim-progress-report.component';
import { BupaRejectionListComponent } from './components/bupa-rejection-list/bupa-rejection-list.component';
import { BupaRejectionUploadSummaryComponent } from './components/bupa-rejection-upload-summary/bupa-rejection-upload-summary.component';
import { BupaRejectionUploadDetailsComponent } from './components/bupa-rejection-upload-details/bupa-rejection-upload-details.component';


const routes: Routes = [
  { path: 'bupa-rejection-reports', component: BupaRejectionReportComponent },
  { path: 'clean-claim-progress-reports', component: CleanClaimProgressReportComponent },
  { path: 'upload-rejection-report', component: BupaRejectionListComponent },
  { path: 'upload-rejection-report-summary/:batchId', component: BupaRejectionUploadSummaryComponent },
  { path: 'upload-rejection-report-summaryDetail/:batchId/:summaryType', component: BupaRejectionUploadDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
