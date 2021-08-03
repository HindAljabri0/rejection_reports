import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EligibilityComponent } from './eligibility/eligibility.component';

const routes: Routes = [
  { path: 'eligibility', component: EligibilityComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NphiesRoutingModule { }
