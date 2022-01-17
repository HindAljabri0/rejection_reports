import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditViewContractComponent } from './add-edit-view-contract/add-edit-view-contract.component';
import { ContractsComponent } from './contracts/contracts.component';

const routes: Routes = [
  { path: '', component: ContractsComponent },
  { path: 'add', component: AddEditViewContractComponent },
  { path: 'edit/:contractId', component: AddEditViewContractComponent },
  { path: 'view/:contractId', component: AddEditViewContractComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManagementRoutingModule { }
