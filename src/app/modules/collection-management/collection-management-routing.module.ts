import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinalSettlementReportDetailsComponent } from './final-settlement-report-details/final-settlement-report-details.component';
import { FinalSettlementReportListComponent } from './final-settlement-report-list/final-settlement-report-list.component';
import { AccountsReceivableListComponent } from './accounts-receivable-list/accounts-receivable-list.component';
import { AccountReceivableDetailsComponent } from './account-receivable-details/account-receivable-details.component';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { StatementOfAccountsComponent } from './statement-of-accounts/statement-of-accounts.component';
import { StatementOfAccountsDetailsComponent } from './statement-of-accounts-details/statement-of-accounts-details.component';
import { CreateBatchComponent } from './create-batch/create-batch.component';
import { AccountReceivableDetailsPayerComponent } from './account-receivable-details-payer/account-receivable-details-payer.component';

const routes: Routes = [
  { path: 'final-settlement-report-list', component: FinalSettlementReportListComponent },
  { path: 'final-settlement-report-details', component: FinalSettlementReportDetailsComponent },
  { path: 'accounts-receivable-list', component: AccountsReceivableListComponent },
  { path: 'accounts-receivable-details', component: AccountReceivableDetailsComponent },
  { path: 'accounts-receivable-details-payer', component: AccountReceivableDetailsPayerComponent },
  { path: 'aging-report', component: AgingReportComponent },
  { path: 'statement-of-accounts', component: StatementOfAccountsComponent },
  { path: 'statement-of-accounts-details', component: StatementOfAccountsDetailsComponent },
  { path: 'create-batch', component: CreateBatchComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionManagementRoutingModule { }
