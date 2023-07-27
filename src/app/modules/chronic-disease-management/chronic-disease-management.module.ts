import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChronicPatientsComponent } from './chronic-patients/chronic-patients.component';
import { ChronicPatientDetailsComponent } from './chronic-patient-details/chronic-patient-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { ChronicDiseaseManagementRoutingModule } from './chronic-disease-management-routing.module';



@NgModule({
  declarations: [
    ChronicPatientsComponent,
    ChronicPatientDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    SmoothScrollModule,
    ChronicDiseaseManagementRoutingModule
  ],
  entryComponents: [
    ChronicPatientDetailsComponent
  ]
})
export class ChronicDiseaseManagementModule { }
