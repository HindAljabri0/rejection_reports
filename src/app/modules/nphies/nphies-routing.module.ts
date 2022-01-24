import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { AddPreauthorizationComponent } from './add-preauthorization/add-preauthorization.component';
import { EligibilityTransactionsComponent } from './eligibility-transactions/eligibility-transactions.component';
import { EligibilityComponent } from './eligibility/eligibility.component';
import { InsurancePlanComponent } from './insurance-plan/insurance-plan.component';
import { PreauthorizationTransactionsComponent } from './preauthorization-transactions/preauthorization-transactions.component';
import { PaymentReconciliationComponent } from './payment-reconciliation/payment-reconciliation.component';
import { PaymentReconciliationDetailsComponent } from './payment-reconciliation-details/payment-reconciliation-details.component';
import { SearchBeneficiaryComponent } from './search-beneficiary/search-beneficiary.component';
import { NphiesUploadsComponent } from './nphies-uploads/nphies-uploads.component';
import { UploadClaimComponent } from './upload-claim/upload-claim.component';
import { UploadsHistoryComponent } from './uploads-history/uploads-history.component';

const routes: Routes = [
  { path: 'eligibility', component: EligibilityComponent },
  { path: 'eligibility-transactions', component: EligibilityTransactionsComponent },
  { path: 'beneficiary/:beneficiaryId/edit' ,component: BeneficiaryComponent },
  { path: 'beneficiary/:beneficiaryId', component: BeneficiaryComponent },
  { path: 'beneficiary/add', component: BeneficiaryComponent },
  { path: 'add-preauthorization', component: AddPreauthorizationComponent },
  { path: 'preauthorization-transactions', component: PreauthorizationTransactionsComponent },
  { path: 'insurance-plans', component: InsurancePlanComponent },
  { path: 'payment-reconciliation', component: PaymentReconciliationComponent },
  { path: 'payment-reconciliation-details/:reconciliationId', component: PaymentReconciliationDetailsComponent },
  { path: 'beneficiary', component: SearchBeneficiaryComponent },
  { path: 'uploads', component: NphiesUploadsComponent},
  { path: 'upload-claim', component: UploadClaimComponent},
  { path: 'upload/history', component:UploadsHistoryComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NphiesRoutingModule { }
