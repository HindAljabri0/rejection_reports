import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddEditViewClassComponent } from '../add-edit-view-class/add-edit-view-class.component';

@Component({
  selector: 'app-add-edit-view-policy',
  templateUrl: './add-edit-view-policy.component.html',
  styles: []
})
export class AddEditViewPolicyComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openAddClassDialog() {
    const dialogRef = this.dialog.open(AddEditViewClassComponent,
      {
        panelClass: ['primary-dialog', 'dialog-xl']
      })
  }

}
