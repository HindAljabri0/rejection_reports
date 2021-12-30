import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ExistingOrNewContractDialogComponent } from '../existing-or-new-contract-dialog/existing-or-new-contract-dialog.component';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styles: []
})
export class ContractsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddContractDialog() {
    const dialogRef = this.dialog.open(ExistingOrNewContractDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-md']
    });
  }

}
