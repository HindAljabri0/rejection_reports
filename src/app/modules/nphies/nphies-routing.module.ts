import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBeneficiaryComponent } from './add-beneficiary/add-beneficiary.component';
import { AddPreauthorizationComponent } from './add-preauthorization/add-preauthorization.component';
import { EligibilityTransactionsComponent } from './eligibility-transactions/eligibility-transactions.component';
import { EligibilityComponent } from './eligibility/eligibility.component';
import { InsurancePlanComponent } from './insurance-plan/insurance-plan.component';
import { PreauthorizationTransactionsComponent } from './preauthorization-transactions/preauthorization-transactions.component';

const routes: Routes = [
  { path: 'eligibility', component: EligibilityComponent },
  { path: 'eligibility-transactions', component: EligibilityTransactionsComponent },
  { path: 'add-beneficiary', component: AddBeneficiaryComponent },
  { path: 'add-preauthorization', component: AddPreauthorizationComponent },
  { path: 'preauthorization-transactions', component: PreauthorizationTransactionsComponent },
  { path: 'insurance-plans', component: InsurancePlanComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NphiesRoutingModule { }
