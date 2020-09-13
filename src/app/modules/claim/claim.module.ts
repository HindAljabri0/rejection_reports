import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatiralModule } from '../matiral/matiral.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MainClaimPageComponent } from 'src/app/claim-module-components/main-claim-page/main-claim-page.component';
import { StoreModule } from '@ngrx/store';
import { claimReducer } from 'src/app/claim-module-components/store/claim.reducer';
import { ClaimPatientInfo } from 'src/app/claim-module-components/claimPatientInfo/claim-patient-info.component';
import { PhysicianComponent } from 'src/app/claim-module-components/physician/physician.component';
import { GdpnCalculationComponent } from 'src/app/claim-module-components/gdpn-calculation/gdpn-calculation.component';
import { EffectsModule } from '@ngrx/effects';
import { ClaimEffects } from 'src/app/claim-module-components/store/claim.effects';
import { ClaimDataComponent } from 'src/app/claim-module-components/claim-data/claim-data.component';
import { MatTabsModule, MatButtonToggleModule } from '@angular/material';
import { ClaimDiagnosisComponent } from 'src/app/claim-module-components/claim-diagnosis/claim-diagnosis.component';
import { ClaimIllnessesComponent } from 'src/app/claim-module-components/claim-illnesses/claim-illnesses.component';
import { GenInfoComponent } from 'src/app/claim-module-components/gen-info/gen-info.component';
import { InvoicesServicesComponent } from 'src/app/claim-module-components/invoices-services/invoices-services.component';
import { CreateByApprovalFormComponent } from 'src/app/claim-module-components/dialogs/create-by-approval-form/create-by-approval-form.component';
import { SelectServiceDialogComponent } from 'src/app/claim-module-components/dialogs/select-service-dialog/select-service-dialog.component';
import { OnSavingDoneComponent } from 'src/app/claim-module-components/dialogs/on-saving-done/on-saving-done.component';
import { VitalSignsComponent } from 'src/app/claim-module-components/vital-signs/vital-signs.component';

@NgModule({
  declarations: [
    MainClaimPageComponent,
    ClaimPatientInfo,
    PhysicianComponent,
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
  ],
  imports: [
    RouterModule.forChild([
      {path: ':id', component: MainClaimPageComponent}
    ]),
    StoreModule.forFeature('claimState', claimReducer),
    EffectsModule.forFeature([ClaimEffects]),
    CommonModule,
    MatiralModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    MatTabsModule,
    MatButtonToggleModule
  ],
  exports: [
    CreateByApprovalFormComponent,
    SelectServiceDialogComponent,
    OnSavingDoneComponent
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
