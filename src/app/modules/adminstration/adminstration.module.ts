import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AuditTrailComponent } from 'src/app/pages/audit-trail/audit-trail.component';
import { MatiralModule } from '../matiral/matiral.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProvidersConfigComponent } from 'src/app/pages/providers-config/providers-config.component';
import { SharedModule } from '../shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SuperAdminService } from 'src/app/services/administration/superAdminService/super-admin.service';
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
    MatiralModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true },
  ]
})
export class AdminstrationModule { }
