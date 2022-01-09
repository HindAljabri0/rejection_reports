import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingComponent } from './billing/billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { BillingManagementRoutingModule } from './billing-management-routing.module';
import { SearchBillingPatientDialogComponent } from './search-billing-patient-dialog/search-billing-patient-dialog.component';
import { BillDetailsComponent } from './bill-details/bill-details.component';
import { AddBillServiceDialogComponent } from './add-bill-service-dialog/add-bill-service-dialog.component';
import { GenerateBillInvoiceComponent } from './generate-bill-invoice/generate-bill-invoice.component';



@NgModule({
  declarations: [BillingComponent, SearchBillingPatientDialogComponent, BillDetailsComponent, AddBillServiceDialogComponent, GenerateBillInvoiceComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    SmoothScrollModule,
    BillingManagementRoutingModule
  ],
  entryComponents: [
    SearchBillingPatientDialogComponent,
    AddBillServiceDialogComponent
  ]
})
export class BillingManagementModule { }
