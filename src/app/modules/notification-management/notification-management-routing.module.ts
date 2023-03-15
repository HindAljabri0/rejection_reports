import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationManagementComponent } from './notification-management/notification-management.component';

const routes: Routes = [
  { path: '', component: NotificationManagementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationManagementRoutingModule { }
