import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AuditTrailComponent } from 'src/app/pages/audit-trail/audit-trail.component';
import { MatiralModule } from '../matiral/matiral.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AuditTrailComponent,
  ],
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: 'auditLogs' },
      { path: 'auditLogs', component: AuditTrailComponent }
    ]),
    CommonModule,
    MatiralModule,
    ReactiveFormsModule,
  ]
})
export class AdminstrationModule { }
