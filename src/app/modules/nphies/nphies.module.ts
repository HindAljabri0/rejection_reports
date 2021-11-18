import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EligibilityComponent } from './eligibility/eligibility.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { BsDatepickerModule} from 'ngx-bootstrap/datepicker';
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
import {
  AddEditDiagnosisModalComponent
} from './add-preauthorization/add-edit-diagnosis-modal/add-edit-diagnosis-modal.component';
import {
  AddEditSupportingInfoModalComponent
} from './add-preauthorization/add-edit-supporting-info-modal/add-edit-supporting-info-modal.component';
import { SearchBeneficiaryComponent } from './search-beneficiary/search-beneficiary.component';
import { PreAuthorizationDetailsComponent } from './pre-authorization-details/pre-authorization-details.component';
import {
  AddEditVisionLensSpecificationsComponent
} from './add-preauthorization/add-edit-vision-lens-specifications/add-edit-vision-lens-specifications.component';
import { ApiErrorsDialogComponent } from './api-errors-dialog/api-errors-dialog.component';
import { ProcessedTransactionsComponent } from './preauthorization-transactions/processed-transactions/processed-transactions.component';
import { CommunicationRequestsComponent } from './preauthorization-transactions/communication-requests/communication-requests.component';
import { AddCommunicationDialogComponent } from './add-communication-dialog/add-communication-dialog.component';
import { NphiesUploadsComponent } from './nphies-uploads/nphies-uploads.component';
import { NphiesUploadCardComponent } from './nphies-uploads/nphies-upload-card/nphies-upload-card.component';
import { CancelReasonModalComponent } from './preauthorization-transactions/cancel-reason-modal/cancel-reason-modal.component';
import { AddEditItemDetailsModalComponent } from './add-edit-item-details-modal/add-edit-item-details-modal.component';
import { NphiesSearchClaimsComponent } from './nphies-search-claims/nphies-search-claims.component';

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
    NphiesSearchClaimsComponent,
    AddEditVisionLensSpecificationsComponent,
    PreAuthorizationDetailsComponent,
    ApiErrorsDialogComponent,
    ProcessedTransactionsComponent,
    CommunicationRequestsComponent,
    AddCommunicationDialogComponent,
    NphiesUploadsComponent,
    NphiesUploadCardComponent,
    CancelReasonModalComponent,
    AddEditItemDetailsModalComponent,
    
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
    AddEditSupportingInfoModalComponent,
    ApiErrorsDialogComponent,
    AddCommunicationDialogComponent,
    CancelReasonModalComponent,
    AddEditItemDetailsModalComponent,
   
  ],
  exports: [
    ApiErrorsDialogComponent
  ]
})
export class NphiesModule { }
