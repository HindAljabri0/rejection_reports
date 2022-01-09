import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { ContractManagementRoutingModule } from './contract-management-routing.module';
import { ContractsComponent } from './contracts/contracts.component';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { AddEditViewContractComponent } from './add-edit-view-contract/add-edit-view-contract.component';



@NgModule({
  declarations: [
    ContractsComponent,
    AddEditViewContractComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ContractManagementRoutingModule,
    NgScrollbarModule,
    SmoothScrollModule
  ],
  entryComponents: [
  ]
})
export class ContractManagementModule { }
