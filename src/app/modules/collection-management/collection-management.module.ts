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
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { CollectionSummaryListComponent } from './collection-summary-list/collection-summary-list.component';
import { CollectionSummaryCreateComponent } from './collection-summary-create/collection-summary-create.component';
import { CollectionSummaryDetailsComponent } from './collection-summary-details/collection-summary-details.component';
import { VatPaymentReportListComponent } from './vat-payment-report-list/vat-payment-report-list.component';
import { VatPaymentReportDetailsComponent } from './vat-payment-report-details/vat-payment-report-details.component';
import { AccountsReceivableListComponent } from './accounts-receivable-list/accounts-receivable-list.component';
import { AccountReceivableAddPaymentComponent } from './account-receivable-add-payment/account-receivable-add-payment.component';

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
    AccountReceivableAddPaymentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ChartsModule,
    CollectionManagementRoutingModule
  ],
  entryComponents: [FileUploadDialogComponent, AccountReceivableAddPaymentComponent]
})
export class CollectionManagementModule { }
