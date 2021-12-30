import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditViewClassComponent } from './add-edit-view-class/add-edit-view-class.component';
import { AddEditViewPolicyComponent } from './add-edit-view-policy/add-edit-view-policy.component';
import { PoliciesComponent } from './policies/policies.component';

const routes: Routes = [
  { path: '', component: PoliciesComponent },
  { path: 'add', component: AddEditViewPolicyComponent },
  { path: 'edit', component: AddEditViewPolicyComponent },
  { path: 'view', component: AddEditViewPolicyComponent },
  { path: 'add-class', component: AddEditViewClassComponent },
  { path: 'edit-class', component: AddEditViewClassComponent },
  { path: 'view-class', component: AddEditViewClassComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyManagementRoutingModule { }
