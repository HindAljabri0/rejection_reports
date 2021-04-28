import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuditTrailComponent } from 'src/app/pages/audit-trail/audit-trail.component';
import { ProviderMappingComponent } from 'src/app/pages/provider-mapping/provider-mapping.component';
import { ProvidersConfigComponent } from 'src/app/pages/providers-config/providers-config.component';
import { RequestInterceptorService } from 'src/app/services/RequestInterceptorService/request-interceptor.service';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [
    AuditTrailComponent,
    ProvidersConfigComponent,
    ProviderMappingComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: 'auditLogs' },
      { path: 'auditLogs', component: AuditTrailComponent },
      { path: 'config/providers', component: ProvidersConfigComponent },
      { path: 'config/providerMapping', component: ProviderMappingComponent },
      { path: 'config/providers/:providerId', component: ProvidersConfigComponent }
    ]),
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true },
  ],
})
export class AdminstrationModule { }
