import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditViewPolicyComponent } from './add-edit-view-policy/add-edit-view-policy.component';
import { ClassesComponent } from './classes/classes.component';
import { PoliciesComponent } from './policies/policies.component';

const routes: Routes = [
  { path: '', component: PoliciesComponent },
  { path: 'add', component: AddEditViewPolicyComponent },
  { path: 'edit/:policyId', component: AddEditViewPolicyComponent },
  { path: 'view/:policyId', component: AddEditViewPolicyComponent },
  { path: 'class-management', component: ClassesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyManagementRoutingModule { }
