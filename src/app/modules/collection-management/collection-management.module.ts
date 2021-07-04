import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionManagementRoutingModule } from './collection-management-routing.module';
import { FileUploadDialogComponent } from 'src/app/components/file-upload-dialog/file-upload-dialog.component';
import { FinalSettlementReportDetailsComponent } from './final-settlement-report-details/final-settlement-report-details.component';
import { FinalSettlementReportListComponent } from './final-settlement-report-list/final-settlement-report-list.component';
import { RegularPaymentDetailsComponent } from './regular-payment-details/regular-payment-details.component';
import { RegularPaymentListComponent } from './regular-payment-list/regular-payment-list.component';
import { SharedModule } from '../shared.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { CollectionSummaryListComponent } from './collection-summary-list/collection-summary-list.component';
import { CollectionSummaryCreateComponent } from './collection-summary-create/collection-summary-create.component';
import { CollectionSummaryDetailsComponent } from './collection-summary-details/collection-summary-details.component';
import { VatPaymentReportListComponent } from './vat-payment-report-list/vat-payment-report-list.component';
import { VatPaymentReportDetailsComponent } from './vat-payment-report-details/vat-payment-report-details.component';
import { AccountsReceivableListComponent } from './accounts-receivable-list/accounts-receivable-list.component';
import { AccountReceivableAddPaymentComponent } from './account-receivable-add-payment/account-receivable-add-payment.component';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { AccountReceivableDetailsComponent } from './account-receivable-details/account-receivable-details.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { AgingReportComponent } from './aging-report/aging-report.component';
import { StatementOfAccountsComponent } from './statement-of-accounts/statement-of-accounts.component';
import { StatementOfAccountsDetailsComponent } from './statement-of-accounts-details/statement-of-accounts-details.component';
import { CreateBatchComponent } from './create-batch/create-batch.component';
import { AddBatchDialogComponent } from './add-batch-dialog/add-batch-dialog.component';
import { AddEditPaymentDialogComponent } from './add-edit-payment-dialog/add-edit-payment-dialog.component';
import { AddStatementOfAccountsDialogComponent } from './add-statement-of-accounts-dialog/add-statement-of-accounts-dialog.component';

@NgModule({
  declarations: [
    RegularPaymentListComponent,
    RegularPaymentDetailsComponent,
    FinalSettlementReportListComponent,
    FinalSettlementReportDetailsComponent,
    FileUploadDialogComponent,
    CollectionSummaryListComponent,
    CollectionSummaryCreateComponent,
    CollectionSummaryDetailsComponent,
    VatPaymentReportListComponent,
    VatPaymentReportDetailsComponent,
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
  ]
})
export class CollectionManagementModule { }
