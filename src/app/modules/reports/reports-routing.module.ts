import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BupaRejectionReportComponent } from './components/bupa-rejection-report/bupa-rejection-report.component';


const routes: Routes = [
  { path: 'bupa-rejection-reports', component: BupaRejectionReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
