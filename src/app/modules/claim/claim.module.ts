import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
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
import { MatTabsModule, MatButtonToggleModule } from '@angular/material';
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
    CreateClaimNphiesComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: ':id', component: MainClaimPageComponent }
    ]),
    StoreModule.forFeature('claimState', claimReducer),
    EffectsModule.forFeature([ClaimEffects]),
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    MatTabsModule,
    MatButtonToggleModule
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
    OnSavingDoneComponent
  ],
  providers: [
    DatePipe
  ]
})
export class ClaimModule { }
