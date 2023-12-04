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
    styles: []
})
export class GdpnCalculationComponent implements OnInit {

    claim: Claim;
    claimProp: RetrievedClaimProps;
    selectedInvoice: number;
    currencyCode = "SAR";

    constructor(private store: Store, private sharedServices: SharedServices) {
        store.select(getClaim).subscribe(claim => this.claim = claim);
        store.select(getRetrievedClaimProps).subscribe(props => this.claimProp = props);
        store.select(getSelectedGDPN).subscribe(indexes => {
            this.selectedInvoice = indexes.invoiceIndex == null ? -1 : indexes.invoiceIndex;
        });
    }

    getSelectedInvoiceActualPaidVatAmount() {
        if (this.selectedInvoice != -1 && this.claim.invoice[this.selectedInvoice] !== undefined &&
            this.claim.invoice[this.selectedInvoice].service.some(service => service.hasOwnProperty('serviceDecision') &&
                service['serviceDecision'] != null)) {
            return this.claim.invoice[this.selectedInvoice].service
                .filter(service => service.hasOwnProperty('serviceDecision') &&
                    service['serviceDecision'] != null)
                .map(service => service['serviceDecision'].gdpn.netVATamount != null ? service['serviceDecision'].gdpn.netVATamount.value : 0)
                .reduce((amount1, amount2) => amount1 + amount2);
        } else {
            return -1;
        }
    }

    getSelectedInvoiceActualDeductedAmount() {
        if (this.selectedInvoice != -1 && this.claim.invoice[this.selectedInvoice] !== undefined &&
            this.claim.invoice[this.selectedInvoice].service.some(service => service.hasOwnProperty('serviceDecision') &&
                service['serviceDecision'] != null)) {
            return this.claim.invoice[this.selectedInvoice].service
                .filter(service => service.hasOwnProperty('serviceDecision') &&
                    service['serviceDecision'] != null)
                .map(service => service['serviceDecision'].gdpn.rejection != null ? service['serviceDecision'].gdpn.rejection.value : 0)
                .reduce((amount1, amount2) => amount1 + amount2);
        } else {
            return -1;
        }
    }

    getClaimActualPaidVatAmount() {
        if (this.claim.invoice.some(inv => inv.service.some(service => service.hasOwnProperty('serviceDecision') &&
            service['serviceDecision'] != null))) {
            let count = 0;
            this.claim.invoice.forEach(inv => {
                inv.service.forEach(ser => {
                    if (ser.hasOwnProperty('serviceDecision') &&
                        ser['serviceDecision'] != null &&
                        ser['serviceDecision'].gdpn != null &&
                        ser['serviceDecision'].gdpn.netVATamount != null) {
                        count += ser['serviceDecision'].gdpn.netVATamount.value;
                    }
                });
            });
            return count;
        } else {
            return -1;
        }
    }

    getClaimActualDeductedAmount() {
        if (this.claim.invoice.some(inv => inv.service.some(service => service.hasOwnProperty('serviceDecision') &&
            service['serviceDecision'] != null))) {
            let count = 0;
            this.claim.invoice.forEach(inv => {
                inv.service.forEach(ser => {
                    if (ser.hasOwnProperty('serviceDecision') &&
                        ser['serviceDecision'] != null &&
                        ser['serviceDecision'].gdpn != null &&
                        ser['serviceDecision'].gdpn.rejection != null) {
                        count += ser['serviceDecision'].gdpn.rejection.value;
                    }
                });
            });
            return count;
        } else {
            return -1;
        }
    }

    ngOnInit() {
        this.currencyCode = localStorage.getItem('currencyCode') !=null && localStorage.getItem('currencyCode')!= undefined?localStorage.getItem('currencyCode') : "SAR";
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

    getActualPaidAmount() {

        const actualPaidAmount = this.claim.claimGDPN.net.value - this.getClaimActualDeductedAmount();
        const actualPaidAmountAfterTwoNumberAfterComma = actualPaidAmount.toFixed(2);
        return actualPaidAmountAfterTwoNumberAfterComma;


    }

}
