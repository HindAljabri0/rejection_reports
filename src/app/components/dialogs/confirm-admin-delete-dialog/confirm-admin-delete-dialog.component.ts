import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-admin-delete-dialog',
  templateUrl: './confirm-admin-delete-dialog.component.html',
  styleUrls: ['./confirm-admin-delete-dialog.component.css']
})
export class ConfirmAdminDeleteDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ConfirmAdminDeleteDialogComponent>) { }

  ngOnInit() {
  }

}
