import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { PolicyManagementRoutingModule } from './policy-management-routing.module';
import { AddEditViewPolicyComponent } from './add-edit-view-policy/add-edit-view-policy.component';
import { PoliciesComponent } from './policies/policies.component';
import { AddEditViewClassComponent } from './add-edit-view-class/add-edit-view-class.component';
import { ClassesComponent } from './classes/classes.component';



@NgModule({
  declarations: [
    AddEditViewPolicyComponent,
    PoliciesComponent,
    AddEditViewClassComponent,
    ClassesComponent
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
  ],
  entryComponents: [
    //AddEditViewClassComponent
  ]
})
export class PolicyManagementModule { }
