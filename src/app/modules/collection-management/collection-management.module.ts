import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionManagementRoutingModule } from './collection-management-routing.module';
import { FileUploadDialogComponent } from 'src/app/components/file-upload-dialog/file-upload-dialog.component';
import { SharedModule } from '../shared.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AccountsReceivableListComponent } from './accounts-receivable-list/accounts-receivable-list.component';
import { AccountReceivableAddPaymentComponent } from './account-receivable-add-payment/account-receivable-add-payment.component';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { AccountReceivableDetailsComponent } from './account-receivable-details/account-receivable-details.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { StatementOfAccountsComponent } from './statement-of-accounts/statement-of-accounts.component';
import { StatementOfAccountsDetailsComponent } from './statement-of-accounts-details/statement-of-accounts-details.component';
import { CreateBatchComponent } from './create-batch/create-batch.component';
import { AddBatchDialogComponent } from './add-batch-dialog/add-batch-dialog.component';
import { AddEditPaymentDialogComponent } from './add-edit-payment-dialog/add-edit-payment-dialog.component';
import { AddStatementOfAccountsDialogComponent } from './add-statement-of-accounts-dialog/add-statement-of-accounts-dialog.component';
import { AddIntialRejectionDialogComponent } from './add-intial-rejection-dialog/add-intial-rejection-dialog.component';
import { AddReconciliationDialogComponent } from './add-reconciliation-dialog/add-reconciliation-dialog.component';
import { ReconciliationReportComponent } from './reconciliation-report/reconciliation-report.component';
import { AccountReceivableDetailsPayerComponent } from './account-receivable-details-payer/account-receivable-details-payer.component';
import {
  AccountReceivableTrackingReportComponent
} from './account-receivable-tracking-report/account-receivable-tracking-report.component';
import {
  AccountReceivableBreakdownReportComponent
} from './account-receivable-breakdown-report/account-receivable-breakdown-report.component';
import { AddFinalRejectionDialogComponent } from './add-final-rejection-dialog/add-final-rejection-dialog.component';
import { ReconciliationAddPaymentComponent } from './reconciliation-add-payment/reconciliation-add-payment.component';

@NgModule({
  declarations: [
    FileUploadDialogComponent,
    AccountsReceivableListComponent,
    AccountReceivableAddPaymentComponent,
    AccountReceivableDetailsComponent,
    AgingReportComponent,
    StatementOfAccountsComponent,
    StatementOfAccountsDetailsComponent,
    CreateBatchComponent,
    AddBatchDialogComponent,
    AddEditPaymentDialogComponent,
    AddStatementOfAccountsDialogComponent,
    AccountReceivableDetailsPayerComponent,
    AccountReceivableBreakdownReportComponent,
    AddIntialRejectionDialogComponent,
    AddReconciliationDialogComponent,
    ReconciliationReportComponent,
    AccountReceivableTrackingReportComponent,
    AddFinalRejectionDialogComponent,
    ReconciliationAddPaymentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    CollectionManagementRoutingModule,
    NgScrollbarModule,
    SmoothScrollModule,
    BsDatepickerModule
  ],
  entryComponents: [
    FileUploadDialogComponent,
    AccountReceivableAddPaymentComponent,
    AddBatchDialogComponent,
    AddEditPaymentDialogComponent,
    AddStatementOfAccountsDialogComponent,
    AddIntialRejectionDialogComponent,
    AddFinalRejectionDialogComponent,
    ReconciliationAddPaymentComponent
  ]
})
export class CollectionManagementModule { }
