import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-preauthorization-transactions',
  templateUrl: './preauthorization-transactions.component.html',
  styles: []
})
export class PreauthorizationTransactionsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openDetailsDialog() {
    // const dialogRef = this.dialog.open(ViewEligibilityDetailsComponent,
    //   {
    //     panelClass: ['primary-dialog', 'dialog-xl']
    //   });
  }

}
