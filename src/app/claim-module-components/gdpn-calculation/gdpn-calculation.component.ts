import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Claim } from '../models/claim.model';
import { getClaim, getSelectedGDPN } from '../store/claim.reducer';

@Component({
  selector: 'gdpn-calculation',
  templateUrl: './gdpn-calculation.component.html',
  styleUrls: ['./gdpn-calculation.component.css']
})
export class GdpnCalculationComponent implements OnInit {

  claim: Claim;
  selectedInvoice: number;
  selectedService: number;

  constructor(private store: Store) {
    store.select(getClaim).subscribe(claim => this.claim = claim);
    store.select(getSelectedGDPN).subscribe(indexes => {
      this.selectedInvoice = indexes.invoiceIndex == null ? -1 : indexes.invoiceIndex;
      this.selectedService = indexes.serviceIndex == null ? -1 : indexes.serviceIndex;
    });
  }

  ngOnInit() {
  }

}
