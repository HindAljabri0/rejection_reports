import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment-reconciliation-details',
  templateUrl: './payment-reconciliation-details.component.html',
  styles: []
})
export class PaymentReconciliationDetailsComponent implements OnInit {

  reconciliationId: number;
  reconciliationDetails: any;

  currentOpenRecord = -1;
  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private sharedServices: SharedServices,
    private providerNphiesSearchService: ProviderNphiesSearchService) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.params.reconciliationId) {
      // tslint:disable-next-line:radix
      this.reconciliationId = parseInt(this.activatedRoute.snapshot.params.reconciliationId);
    }

    if (this.reconciliationId) {
      this.getPaymentReconciliationDetails();
    }

  }

  getPaymentReconciliationDetails() {
    this.sharedServices.loadingChanged.next(true);
    // tslint:disable-next-line:max-line-length
    this.providerNphiesSearchService.getPaymentReconciliationDetails(this.sharedServices.providerId, this.reconciliationId).subscribe((event: any) => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        this.reconciliationDetails = body;
        this.sharedServices.loadingChanged.next(false);
      }
    }, err => {
      this.sharedServices.loadingChanged.next(false);
      console.log(err);
    });
  }

  goBack() {
    this.location.back();
  }

  toggleRow(index) {
    this.currentOpenRecord = (index === this.currentOpenRecord) ? -1 : index;
  }

}
