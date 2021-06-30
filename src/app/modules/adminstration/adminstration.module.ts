import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { AuditTrailComponent } from 'src/app/pages/audit-trail/audit-trail.component';
import { ProviderMappingComponent } from 'src/app/pages/provider-mapping/provider-mapping.component';
import { ProvidersConfigComponent } from 'src/app/pages/providers-config/providers-config.component';
import { RequestInterceptorService } from 'src/app/services/RequestInterceptorService/request-interceptor.service';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';
import { ProviderContractComponent } from './provider-contract/provider-contract.component';
import { AddProviderContractDialogComponent } from './add-provider-contract-dialog/add-provider-contract-dialog.component';

@NgModule({
  declarations: [
    AuditTrailComponent,
    ProvidersConfigComponent,
    ProviderMappingComponent,
    ProviderContractComponent,
    AddProviderContractDialogComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: 'auditLogs' },
      { path: 'auditLogs', component: AuditTrailComponent },
      { path: 'config/providers', component: ProvidersConfigComponent },
      { path: 'config/providerMapping', component: ProviderMappingComponent },
      { path: 'config/providers/:providerId', component: ProvidersConfigComponent },
      { path: 'config/payer-payment-contract', component: ProviderContractComponent }
    ]),
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    NgScrollbarModule,
    SmoothScrollModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true },
  ],
  entryComponents: [
    AddProviderContractDialogComponent
  ]
})
export class AdminstrationModule { }
