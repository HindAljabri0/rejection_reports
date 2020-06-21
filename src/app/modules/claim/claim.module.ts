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

@NgModule({
  declarations: [
    MainClaimPageComponent,
    ClaimPatientInfo,
    PhysicianComponent,
    GdpnCalculationComponent,
  ],
  imports: [
    RouterModule.forChild([
      {path: ':id', component: MainClaimPageComponent}
    ]),
    StoreModule.forFeature('claim', claimReducer),
    CommonModule,
    MatiralModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule
  ]
})
export class ClaimModule { }
