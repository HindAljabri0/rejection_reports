import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBeneficiaryComponent } from './add-beneficiary/add-beneficiary.component';
import { EligibilityComponent } from './eligibility/eligibility.component';

const routes: Routes = [
  { path: 'eligibility', component: EligibilityComponent },
  { path: 'add-beneficiary', component: AddBeneficiaryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NphiesRoutingModule { }
