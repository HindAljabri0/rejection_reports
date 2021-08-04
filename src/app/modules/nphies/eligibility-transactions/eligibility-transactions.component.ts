import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ViewEligibilityDetailsComponent } from '../view-eligibility-details/view-eligibility-details.component';

@Component({
  selector: 'app-eligibility-transactions',
  templateUrl: './eligibility-transactions.component.html',
  styles: []
})
export class EligibilityTransactionsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openDetailsDialog() {
    const dialogRef = this.dialog.open(ViewEligibilityDetailsComponent,
      {
        panelClass: ['primary-dialog', 'dialog-xl']
      });
  }

}
