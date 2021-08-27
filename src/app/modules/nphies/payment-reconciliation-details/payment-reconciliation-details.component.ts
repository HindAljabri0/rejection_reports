import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-reconciliation-details',
  templateUrl: './payment-reconciliation-details.component.html',
  styles: []
})
export class PaymentReconciliationDetailsComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back()
  }

}
