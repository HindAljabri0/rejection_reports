import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { PolicyManagementRoutingModule } from './policy-management-routing.module';
import { AddEditViewPolicyComponent } from './add-edit-view-policy/add-edit-view-policy.component';
import { PoliciesComponent } from './policies/policies.component';



@NgModule({
  declarations: [
    AddEditViewPolicyComponent,
    PoliciesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    SmoothScrollModule,
    PolicyManagementRoutingModule
  ]
})
export class PolicyManagementModule { }
