import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsReceivableListComponent } from './accounts-receivable-list/accounts-receivable-list.component';
import { AccountReceivableDetailsComponent } from './account-receivable-details/account-receivable-details.component';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { StatementOfAccountsComponent } from './statement-of-accounts/statement-of-accounts.component';
import { StatementOfAccountsDetailsComponent } from './statement-of-accounts-details/statement-of-accounts-details.component';
import { CreateBatchComponent } from './create-batch/create-batch.component';
import { AccountReceivableDetailsPayerComponent } from './account-receivable-details-payer/account-receivable-details-payer.component';
import { ReconciliationComponent } from './reconciliation/reconciliation.component';
import { ReconciliationReportComponent } from './reconciliation-report/reconciliation-report.component';
import {
  AccountReceivableTrackingReportComponent
} from './account-receivable-tracking-report/account-receivable-tracking-report.component';
import {
  AccountReceivableBreakdownReportComponent
} from './account-receivable-breakdown-report/account-receivable-breakdown-report.component';

const routes: Routes = [
  { path: 'accounts-receivable-list', component: AccountsReceivableListComponent },
  { path: 'accounts-receivable-details', component: AccountReceivableDetailsComponent },
  { path: 'accounts-receivable-details-payer', component: AccountReceivableDetailsPayerComponent },
  { path: 'aging-report', component: AgingReportComponent },
  { path: 'statement-of-accounts', component: StatementOfAccountsComponent },
  { path: 'statement-of-accounts-details', component: StatementOfAccountsDetailsComponent },
  { path: 'create-batch', component: CreateBatchComponent },
  { path: 'accounts-receivable-breakdown-report', component: AccountReceivableBreakdownReportComponent },
  { path: 'accounts-receivable-tracking-report', component: AccountReceivableTrackingReportComponent },
  { path: 'reconciliation', component: ReconciliationComponent },
  { path: 'reconciliation-report', component: ReconciliationReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionManagementRoutingModule { }
