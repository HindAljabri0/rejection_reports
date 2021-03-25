import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuditTrailComponent } from 'src/app/pages/audit-trail/audit-trail.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProvidersConfigComponent } from 'src/app/pages/providers-config/providers-config.component';
import { SharedModule } from '../shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptorService } from 'src/app/services/RequestInterceptorService/request-interceptor.service';

@NgModule({
  declarations: [
    AuditTrailComponent,
    ProvidersConfigComponent,
  ],
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: 'auditLogs' },
      { path: 'auditLogs', component: AuditTrailComponent },
      { path: 'config/providers', component: ProvidersConfigComponent },
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
  ]
})
export class AdminstrationModule { }
