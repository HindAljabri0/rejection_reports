import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ViewEligibilityDetailsComponent } from '../view-eligibility-details/view-eligibility-details.component';

@Component({
  selector: 'app-eligibility',
  templateUrl: './eligibility.component.html',
  styles: []
})
export class EligibilityComponent implements OnInit {
  showDetails = false;
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

}
