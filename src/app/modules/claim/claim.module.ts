import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MainClaimPageComponent } from 'src/app/claim-module-components/main-claim-page/main-claim-page.component';
import { StoreModule } from '@ngrx/store';
import { claimReducer } from 'src/app/claim-module-components/store/claim.reducer';
import { GdpnCalculationComponent } from 'src/app/claim-module-components/gdpn-calculation/gdpn-calculation.component';
import { EffectsModule } from '@ngrx/effects';
import { ClaimEffects } from 'src/app/claim-module-components/store/claim.effects';
import { ClaimDataComponent } from 'src/app/claim-module-components/claim-data/claim-data.component';
import { MatTabsModule, MatButtonToggleModule, MatDatepickerModule } from '@angular/material';
import { ClaimDiagnosisComponent } from 'src/app/claim-module-components/claim-diagnosis/claim-diagnosis.component';
import { ClaimIllnessesComponent } from 'src/app/claim-module-components/claim-illnesses/claim-illnesses.component';
import { GenInfoComponent } from 'src/app/claim-module-components/gen-info/gen-info.component';
import { InvoicesServicesComponent } from 'src/app/claim-module-components/invoices-services/invoices-services.component';
import {
  CreateByApprovalFormComponent
} from 'src/app/claim-module-components/dialogs/create-by-approval-form/create-by-approval-form.component';
import {
  SelectServiceDialogComponent
} from 'src/app/claim-module-components/dialogs/select-service-dialog/select-service-dialog.component';
import { OnSavingDoneComponent } from 'src/app/claim-module-components/dialogs/on-saving-done/on-saving-done.component';
import { VitalSignsComponent } from 'src/app/claim-module-components/vital-signs/vital-signs.component';
import { AdmissionComponent } from 'src/app/claim-module-components/admission/admission.component';
import { AttachmentsComponent } from 'src/app/claim-module-components/attachments/attachments.component';
import { ClaimErrorsComponent } from 'src/app/claim-module-components/claim-errors/claim-errors.component';
import { LabResultsComponent } from 'src/app/claim-module-components/lab-results/lab-results.component';
import { PbmCommentsComponent } from 'src/app/claim-module-components/pbm-comments/pbm-comments.component';
import { CreateClaimNphiesComponent } from '../nphies/create-claim-nphies/create-claim-nphies.component';
import { AddEditPreauthorizationItemComponent } from '../nphies/add-edit-preauthorization-item/add-edit-preauthorization-item.component';
import { AddEditCareTeamModalComponent } from '../nphies/add-preauthorization/add-edit-care-team-modal/add-edit-care-team-modal.component';
import { AddEditDiagnosisModalComponent } from '../nphies/add-preauthorization/add-edit-diagnosis-modal/add-edit-diagnosis-modal.component';
import {
  AddEditVisionLensSpecificationsComponent
} from '../nphies/add-preauthorization/add-edit-vision-lens-specifications/add-edit-vision-lens-specifications.component';
import {
  AddEditSupportingInfoModalComponent
} from '../nphies/add-preauthorization/add-edit-supporting-info-modal/add-edit-supporting-info-modal.component';
import { AddEditItemDetailsModalComponent } from '../nphies/add-edit-item-details-modal/add-edit-item-details-modal.component';
import { TagInputModule } from 'ngx-chips';
import { NphiesSearchClaimsComponent } from '../nphies/nphies-search-claims/nphies-search-claims.component';
import { AddCommunicationDialogComponent } from '../nphies/add-communication-dialog/add-communication-dialog.component';
import { CancelReasonModalComponent } from '../nphies/preauthorization-transactions/cancel-reason-modal/cancel-reason-modal.component';
import { ClaimTransactionsComponent } from '../nphies/claim-transactions/claim-transactions.component';
import { BeneficiaryTabComponent } from '../nphies/create-claim-nphies/beneficiary-tab/beneficiary-tab.component';
import { JsonResponseComponent } from '../nphies/create-claim-nphies/json-response/json-response.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';


@NgModule({
  declarations: [
    MainClaimPageComponent,
    GdpnCalculationComponent,
    ClaimDataComponent,
    ClaimDiagnosisComponent,
    ClaimIllnessesComponent,
    GenInfoComponent,
    InvoicesServicesComponent,
    CreateByApprovalFormComponent,
    SelectServiceDialogComponent,
    OnSavingDoneComponent,
    VitalSignsComponent,
    AdmissionComponent,
    AttachmentsComponent,
    ClaimErrorsComponent,
    LabResultsComponent,
    PbmCommentsComponent,
    CreateClaimNphiesComponent,
    BeneficiaryTabComponent,
    JsonResponseComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: 'create-nphies', component: CreateClaimNphiesComponent },
      { path: 'transactions', component: ClaimTransactionsComponent },
      { path: 'nphies-claim', component: CreateClaimNphiesComponent, data: { routeMode: 'page' } },
      { path: 'nphies-search-claim', component: NphiesSearchClaimsComponent },
    ]),
    StoreModule.forFeature('claimState', claimReducer),
    EffectsModule.forFeature([ClaimEffects]),
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    MatTabsModule,
    MatButtonToggleModule,
    TagInputModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgScrollbarModule,
    SmoothScrollModule
  ],
  exports: [
    CreateByApprovalFormComponent,
    SelectServiceDialogComponent,
    OnSavingDoneComponent,
    GdpnCalculationComponent,
    ClaimDataComponent,
    ClaimDiagnosisComponent,
    ClaimIllnessesComponent,
    GenInfoComponent,
    InvoicesServicesComponent,
    CreateByApprovalFormComponent,
    SelectServiceDialogComponent,
    OnSavingDoneComponent,
    VitalSignsComponent,
    AdmissionComponent,
    AttachmentsComponent,
    ClaimErrorsComponent,
    LabResultsComponent,
    PbmCommentsComponent
  ],
  entryComponents: [
    CreateByApprovalFormComponent,
    SelectServiceDialogComponent,
    OnSavingDoneComponent,
    AddEditPreauthorizationItemComponent,
    AddEditCareTeamModalComponent,
    AddEditDiagnosisModalComponent,
    AddEditVisionLensSpecificationsComponent,
    AddEditSupportingInfoModalComponent,
    AddEditItemDetailsModalComponent,
    AddCommunicationDialogComponent,
    CancelReasonModalComponent
  ],
  providers: [
    DatePipe,
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-IN' },

  ]
})

export class ClaimModule { }
