import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddEditNotificationDialogComponent } from '../add-edit-notification-dialog/add-edit-notification-dialog.component';
import { ViewNotificationDetailsDialogComponent } from '../view-notification-details-dialog/view-notification-details-dialog.component';

@Component({
  selector: 'app-notification-management',
  templateUrl: './notification-management.component.html',
  styles: []
})
export class NotificationManagementComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openAddCreateNotificationDialog() {
    const dialogRef = this.dialog.open(AddEditNotificationDialogComponent, {
      panelClass: ['primary-dialog'],
      autoFocus: false
    })
  }

  openViewNotificationDialog() {
    const dialogRef = this.dialog.open(ViewNotificationDetailsDialogComponent, {
      panelClass: ['primary-dialog'],
      autoFocus: false
    })
  }

}
