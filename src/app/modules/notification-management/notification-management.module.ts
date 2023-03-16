import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationManagementComponent } from './notification-management/notification-management.component';
import { AddEditNotificationDialogComponent } from './add-edit-notification-dialog/add-edit-notification-dialog.component';
import { ViewNotificationDetailsDialogComponent } from './view-notification-details-dialog/view-notification-details-dialog.component';
import { SharedModule } from '../shared.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule, SmoothScrollModule } from 'ngx-scrollbar';
import { NotificationManagementRoutingModule } from './notification-management-routing.module';



@NgModule({
  declarations: [NotificationManagementComponent, AddEditNotificationDialogComponent, ViewNotificationDetailsDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    SmoothScrollModule,
    NotificationManagementRoutingModule
  ],
  entryComponents: [
    AddEditNotificationDialogComponent,
    ViewNotificationDetailsDialogComponent
  ]
})
export class NotificationManagementModule { }
