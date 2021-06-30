import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddProviderContractDialogComponent } from '../add-provider-contract-dialog/add-provider-contract-dialog.component';

@Component({
  selector: 'app-provider-contract',
  templateUrl: './provider-contract.component.html',
  styles: []
})
export class ProviderContractComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddContractDialog() {
    let dialogRef = this.dialog.open(AddProviderContractDialogComponent,
      {
        panelClass: ['primary-dialog', 'dialog-lg']
      })
  }

}
