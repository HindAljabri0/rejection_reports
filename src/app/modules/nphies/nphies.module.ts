import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EligibilityComponent } from './eligibility/eligibility.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
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
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RecentReconciliationComponent } from './payment-reconciliation/recent-reconciliation/recent-reconciliation.component';
import { ClaimTransactionsComponent } from './claim-transactions/claim-transactions.component';
import {
  ClaimProcessedTransactionsComponent
} from './claim-transactions/claim-processed-transactions/claim-processed-transactions.component';
import {
  ClaimCommunicationRequestsComponent
} from './claim-transactions/claim-communication-requests/claim-communication-requests.component';
import { ReuseApprovalModalComponent } from './preauthorization-transactions/reuse-approval-modal/reuse-approval-modal.component';
import { UploadsHistoryComponent } from './uploads-history/uploads-history.component';
import { NphiesConfigurationsComponent } from './nphies-configurations/nphies-configurations.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { configurationReducer } from './nphies-configurations/store/configurations.reducer';
import { ConfigurationsEffects } from './nphies-configurations/store/configurations.effects';
import { UploadBeneficiaryComponent } from './upload-beneficiary/upload-beneficiary.component';
import { PhysiciansComponent } from './physicians/physicians.component';
import { UploadPhysiciansDialogComponent } from './upload-physicians-dialog/upload-physicians-dialog.component';
import { AddPhysicianDialogComponent } from './add-physician-dialog/add-physician-dialog.component';
import { TagInputModule } from 'ngx-chips';
import {
  NphiesUploadSummaryDialogComponent
} from './upload-claim/nphies-claim-summary/nphies-upload-summary-dialog/nphies-upload-summary-dialog.component';
import { PricelistComponent } from './pricelist/pricelist.component';
import { PricelistDetailsComponent } from './pricelist-details/pricelist-details.component';
import { PricelistUploadComponent } from './pricelist-upload/pricelist-upload.component';
import { AddPricelistDialogComponent } from './pricelist-details/add-pricelist-dialog/add-pricelist-dialog.component';
import { PreparePreAuthForClaimComponent } from './prepare-pre-auth-for-claim/prepare-pre-auth-for-claim.component';
import { ConvertPreAuthToClaimComponent } from './convert-pre-auth-to-claim/convert-pre-auth-to-claim.component';
import { EligiblityJsonResponseComponent } from './view-eligibility-details/eligiblity-json-response/eligiblity-json-response.component';
import { MatTabsModule } from '@angular/material';
import { ApprovalJsonResponseComponent } from './view-preauthorization-details/approval-json-response/approval-json-response.component';
import { DaysOfSupplyUploadComponent } from './days-of-supply-upload/days-of-supply-upload.component';
import { MedicationDaysUploadComponent } from './medication-days-upload/medication-days-upload.component';
import { AddMedicationSupplyDialogComponent } from './add-medication-supply-dialog/add-medication-supply-dialog.component';

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
    RecentReconciliationComponent,
    ClaimTransactionsComponent,
    ClaimProcessedTransactionsComponent,
    ClaimCommunicationRequestsComponent,
    ReuseApprovalModalComponent,
    UploadsHistoryComponent,
    NphiesConfigurationsComponent,
    UploadBeneficiaryComponent,
    PhysiciansComponent,
    UploadPhysiciansDialogComponent,
    AddPhysicianDialogComponent,
    NphiesUploadSummaryDialogComponent,
    PricelistComponent,
    PricelistDetailsComponent,
    PricelistUploadComponent,
    AddPricelistDialogComponent,
    PreparePreAuthForClaimComponent,
    ConvertPreAuthToClaimComponent,
    EligiblityJsonResponseComponent,
    ApprovalJsonResponseComponent,
    DaysOfSupplyUploadComponent,
    MedicationDaysUploadComponent,
    AddMedicationSupplyDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    NgScrollbarModule,
    SmoothScrollModule,
    NphiesRoutingModule,
    CarouselModule,
    StoreModule.forFeature('nphiesConfigurationState', configurationReducer),
    EffectsModule.forFeature([ConfigurationsEffects]),
    TagInputModule
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
    ReuseApprovalModalComponent,
    UploadPhysiciansDialogComponent,
    AddPhysicianDialogComponent,
    NphiesUploadSummaryDialogComponent,
    PricelistUploadComponent,
    AddPricelistDialogComponent,
    DaysOfSupplyUploadComponent,
    MedicationDaysUploadComponent,
    AddMedicationSupplyDialogComponent
  ],
  exports: [
    ApiErrorsDialogComponent
  ]
})
export class NphiesModule { }
