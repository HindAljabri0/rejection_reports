import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ViewPreauthorizationDetailsComponent } from '../view-preauthorization-details/view-preauthorization-details.component';

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
    const dialogRef = this.dialog.open(ViewPreauthorizationDetailsComponent,
      {
        panelClass: ['primary-dialog', 'dialog-xl']
      });
  }

}
