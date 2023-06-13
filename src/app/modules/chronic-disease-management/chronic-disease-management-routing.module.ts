import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChronicPatientsComponent } from './chronic-patients/chronic-patients.component';

const routes: Routes = [
  { path: '', redirectTo: 'chronic-patients' },
  { path: 'chronic-patients', component: ChronicPatientsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChronicDiseaseManagementRoutingModule { }
