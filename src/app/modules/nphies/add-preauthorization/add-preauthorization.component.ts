import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddEditPreauthorizationItemComponent } from '../add-edit-preauthorization-item/add-edit-preauthorization-item.component';

@Component({
  selector: 'app-add-preauthorization',
  templateUrl: './add-preauthorization.component.html',
  styles: []
})
export class AddPreauthorizationComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddEditItemDialog(e) {
    e.preventDefault();
    this.dialog.open(AddEditPreauthorizationItemComponent, {
      panelClass: ['primary-dialog', 'dialog-xl']
    });
  }

}
