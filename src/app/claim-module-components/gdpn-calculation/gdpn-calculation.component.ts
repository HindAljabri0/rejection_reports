import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { SharedServices } from 'src/app/services/shared.services';
import { Claim } from '../models/claim.model';
import { RetrievedClaimProps } from '../models/retrievedClaimProps.model';
import { getClaim, getRetrievedClaimProps, getSelectedGDPN } from '../store/claim.reducer';

@Component({
  selector: 'gdpn-calculation',
  templateUrl: './gdpn-calculation.component.html',
  styleUrls: ['./gdpn-calculation.component.css']
})
export class GdpnCalculationComponent implements OnInit {

  claim: Claim;
  claimProp: RetrievedClaimProps;
  selectedInvoice: number;

  constructor(private store: Store, private sharedServices: SharedServices) {
    store.select(getClaim).subscribe(claim => this.claim = claim);
    store.select(getRetrievedClaimProps).subscribe(props => this.claimProp = props);
    store.select(getSelectedGDPN).subscribe(indexes => {
      this.selectedInvoice = indexes.invoiceIndex == null ? -1 : indexes.invoiceIndex;
    });
  }

  getSelectedInvoiceActualDeductedAmount() {
    if (this.selectedInvoice != -1 && this.claimProp.servicesDecision != null) {
      return this.claimProp.servicesDecision
        .filter(dec => dec.invoiceNumber == this.claim.invoice[this.selectedInvoice].invoiceNumber)
        .map(dec => dec.gdpn.rejection != null ? dec.gdpn.rejection.value : 0)
        .reduce((amount1, amount2) => amount1 + amount2);
    } else return -1;
  }

  getClaimActualDeductedAmount() {
    if (this.claimProp!= null && this.claimProp.servicesDecision != null) {
      return this.claimProp.servicesDecision
        .map(dec => dec.gdpn.rejection != null ? dec.gdpn.rejection.value : 0)
        .reduce((amount1, amount2) => amount1 + amount2);
    } else return -1;
  }

  ngOnInit() {
  }

  getStatusColorOfClaim() {
    return this.sharedServices.getCardAccentColor(this.claimProp.statusCode);
  }

  getStatusColorOfSelectedInvoice() {
    const acutalDeductedAmount = this.getSelectedInvoiceActualDeductedAmount();
    if (this.selectedInvoice != -1 && acutalDeductedAmount != -1) {
      if (this.claim.invoice[this.selectedInvoice].invoiceGDPN.net.value == acutalDeductedAmount) {
        return this.sharedServices.getCardAccentColor(ClaimStatus.REJECTED);
      } else if (this.claim.invoice[this.selectedInvoice].invoiceGDPN.net.value > acutalDeductedAmount && acutalDeductedAmount > 0) {
        return this.sharedServices.getCardAccentColor(ClaimStatus.PARTIALLY_PAID);
      } else if (this.claim.invoice[this.selectedInvoice].invoiceGDPN.net.value > acutalDeductedAmount && acutalDeductedAmount == 0) {
        return this.sharedServices.getCardAccentColor(ClaimStatus.PAID);
      }
    }
  }

}
