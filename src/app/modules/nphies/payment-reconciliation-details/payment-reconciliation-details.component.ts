import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-reconciliation-details',
  templateUrl: './payment-reconciliation-details.component.html',
  styles: []
})
export class PaymentReconciliationDetailsComponent implements OnInit {

  currentOpenRecord = -1;
  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back()
  }

  toggleRow(index) {
    this.currentOpenRecord = (index == this.currentOpenRecord) ? -1 : index;
  }

}
