import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinalSettlementReportDetailsComponent } from './final-settlement-report-details/final-settlement-report-details.component';
import { FinalSettlementReportListComponent } from './final-settlement-report-list/final-settlement-report-list.component';
import { RegularPaymentDetailsComponent } from './regular-payment-details/regular-payment-details.component';
import { RegularPaymentListComponent } from './regular-payment-list/regular-payment-list.component';


const routes: Routes = [
  { path: 'regular-payment-list', component: RegularPaymentListComponent },
  { path: 'regular-payment-details', component: RegularPaymentDetailsComponent },
  { path: 'final-settlement-report-list', component: FinalSettlementReportListComponent },
  { path: 'final-settlement-report-details', component: FinalSettlementReportDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionManagementRoutingModule { }
