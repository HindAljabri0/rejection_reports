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
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { AddPreauthorizationComponent } from './add-preauthorization/add-preauthorization.component';
import { EligibilityTransactionsComponent } from './eligibility-transactions/eligibility-transactions.component';
import { InsurancePlanComponent } from './insurance-plan/insurance-plan.component';
import { PreauthorizationTransactionsComponent } from './preauthorization-transactions/preauthorization-transactions.component';
import { AddEditPreauthorizationItemComponent } from './add-edit-preauthorization-item/add-edit-preauthorization-item.component';
import { AddInsurancePlanDialogComponent } from './add-insurance-plan-dialog/add-insurance-plan-dialog.component';
import { EligibilityDetailsComponent } from './eligibility-details/eligibility-details.component';
import { ViewPreauthorizationDetailsComponent } from './view-preauthorization-details/view-preauthorization-details.component';
import { AddEditCareTeamModalComponent } from './add-preauthorization/add-edit-care-team-modal/add-edit-care-team-modal.component';
import { PaymentReconciliationComponent } from './payment-reconciliation/payment-reconciliation.component';
import { PaymentReconciliationDetailsComponent } from './payment-reconciliation-details/payment-reconciliation-details.component';
// tslint:disable-next-line:max-line-length
import { AddEditDiagnosisModalComponent } from './add-preauthorization/add-edit-diagnosis-modal/add-edit-diagnosis-modal.component';
// tslint:disable-next-line:max-line-length
import { AddEditSupportingInfoModalComponent } from './add-preauthorization/add-edit-supporting-info-modal/add-edit-supporting-info-modal.component';
import { SearchBeneficiaryComponent } from './search-beneficiary/search-beneficiary.component';
// tslint:disable-next-line:max-line-length
import { AddEditVisionLensSpecificationsComponent } from './add-edit-vision-lens-specifications/add-edit-vision-lens-specifications.component';

@NgModule({
  declarations: [
    EligibilityComponent,
    ViewEligibilityDetailsComponent,
    BeneficiaryComponent,
    AddPreauthorizationComponent,
    EligibilityTransactionsComponent,
    InsurancePlanComponent,
    AddInsurancePlanDialogComponent,
    AddEditPreauthorizationItemComponent,
    PreauthorizationTransactionsComponent,
    EligibilityDetailsComponent,
    AddEditCareTeamModalComponent,
    ViewPreauthorizationDetailsComponent,
    PaymentReconciliationComponent,
    PaymentReconciliationDetailsComponent,
    AddEditDiagnosisModalComponent,
    AddEditSupportingInfoModalComponent,
    SearchBeneficiaryComponent,
    AddEditVisionLensSpecificationsComponent
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
    ViewEligibilityDetailsComponent,
    AddInsurancePlanDialogComponent,
    AddEditPreauthorizationItemComponent,
    ViewPreauthorizationDetailsComponent,
    AddEditCareTeamModalComponent,
    AddEditDiagnosisModalComponent,
    AddEditVisionLensSpecificationsComponent,
    AddEditSupportingInfoModalComponent
  ]
})
export class NphiesModule { }
