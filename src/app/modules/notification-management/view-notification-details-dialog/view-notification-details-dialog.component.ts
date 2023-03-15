import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-notification-details-dialog',
  templateUrl: './view-notification-details-dialog.component.html',
  styles: []
})
export class ViewNotificationDetailsDialogComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<ViewNotificationDetailsDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
