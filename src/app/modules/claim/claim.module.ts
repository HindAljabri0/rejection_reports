import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatTabsModule } from '@angular/material';
import { ClaimDignosisComponent } from 'src/app/claim-module-components/claim-dignosis/claim-dignosis.component';
import { ClaimIllnessesComponent } from 'src/app/claim-module-components/claim-illnesses/claim-illnesses.component';


@NgModule({
  declarations: [
    MainClaimPageComponent,
    ClaimPatientInfo,
    PhysicianComponent,
    GdpnCalculationComponent,
    ClaimDataComponent,
    ClaimDignosisComponent,
    ClaimIllnessesComponent
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
    MatTabsModule
  ]
})
export class ClaimModule { }
