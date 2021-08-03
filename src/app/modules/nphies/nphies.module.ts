import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EligibilityComponent } from './eligibility/eligibility.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NphiesRoutingModule } from './nphies-routing.module';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { ViewEligibilityDetailsComponent } from './view-eligibility-details/view-eligibility-details.component';
import { AddBeneficiaryComponent } from './add-beneficiary/add-beneficiary.component';

@NgModule({
  declarations: [
    EligibilityComponent,
    ViewEligibilityDetailsComponent,
    AddBeneficiaryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgScrollbarModule,
    SmoothScrollModule,
    NphiesRoutingModule
  ],
  entryComponents: [
    ViewEligibilityDetailsComponent
  ]
})
export class NphiesModule { }
