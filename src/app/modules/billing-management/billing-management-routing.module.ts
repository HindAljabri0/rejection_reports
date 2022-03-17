import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillDetailsComponent } from './bill-details/bill-details.component';
import { BillingComponent } from './billing/billing.component';
import { GenerateBillInvoiceComponent } from './generate-bill-invoice/generate-bill-invoice.component';
import { InvoicesComponent } from './invoices/invoices.component';

const routes: Routes = [
    { path: '', component: BillingComponent },
    { path: 'bill-details/add', component: BillDetailsComponent },
    { path: 'bill-details/edit/:billId', component: BillDetailsComponent },
    { path: 'bill-details/generate-bill-invoice/:billId', component: BillDetailsComponent },
    { path: 'invoice', component: InvoicesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingManagementRoutingModule { }
