import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinalSettlementReportDetailsComponent } from './final-settlement-report-details/final-settlement-report-details.component';
import { FinalSettlementReportListComponent } from './final-settlement-report-list/final-settlement-report-list.component';
import { RegularPaymentDetailsComponent } from './regular-payment-details/regular-payment-details.component';
import { RegularPaymentListComponent } from './regular-payment-list/regular-payment-list.component';
import { CollectionSummaryListComponent } from './collection-summary-list/collection-summary-list.component';
import { CollectionSummaryCreateComponent } from './collection-summary-create/collection-summary-create.component';
import { CollectionSummaryDetailsComponent } from './collection-summary-details/collection-summary-details.component';
import { VatPaymentReportListComponent } from './vat-payment-report-list/vat-payment-report-list.component';
import { VatPaymentReportDetailsComponent } from './vat-payment-report-details/vat-payment-report-details.component';

const routes: Routes = [
  { path: 'regular-payment-list', component: RegularPaymentListComponent },
  { path: 'regular-payment-details', component: RegularPaymentDetailsComponent },
  { path: 'final-settlement-report-list', component: FinalSettlementReportListComponent },
  { path: 'final-settlement-report-details', component: FinalSettlementReportDetailsComponent },
  { path: 'collection-summary-list', component: CollectionSummaryListComponent },
  { path: 'collection-summary-details', component: CollectionSummaryDetailsComponent },
  { path: 'collection-summary-create', component: CollectionSummaryCreateComponent },
  { path: 'vat-payment-list', component: VatPaymentReportListComponent },
  { path: 'vat-payment-details', component: VatPaymentReportDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionManagementRoutingModule { }
