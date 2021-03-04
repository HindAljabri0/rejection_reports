import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BupaRejectionReportComponent } from './components/bupa-rejection-report/bupa-rejection-report.component';
import { CleanClaimProgressReportComponent } from './components/clean-claim-progress-report/clean-claim-progress-report.component';


const routes: Routes = [
  { path: 'bupa-rejection-reports', component: BupaRejectionReportComponent },
  { path: 'clean-claim-progress-reports', component: CleanClaimProgressReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
