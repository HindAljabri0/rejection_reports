import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedServices } from 'src/app/services/shared.services';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { HttpResponse } from '@angular/common/http';
import { SearchPageQueryParams } from 'src/app/models/searchPageQueryParams';
import { CreateClaimNphiesComponent } from '../create-claim-nphies/create-claim-nphies.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-payment-reconciliation-details',
  templateUrl: './payment-reconciliation-details.component.html',
  styles: []
})
export class PaymentReconciliationDetailsComponent implements OnInit {

  reconciliationId: number;
  reconciliationDetails: any;

  currentOpenRecord = -1;
  params: SearchPageQueryParams = new SearchPageQueryParams();

  claimId: string;
  uploadId: string;
  claimResponseId: string;

  claimDialogRef: MatDialogRef<any, any>;

  constructor(
    public dialog: MatDialog,
    private location: Location,
    public router: Router,
    public routeActive: ActivatedRoute,
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

    if (this.activatedRoute.snapshot.queryParams.claimId) {
      this.claimId = this.activatedRoute.snapshot.queryParams.claimId;
    }

    if (this.activatedRoute.snapshot.queryParams.uploadId) {
      this.uploadId = this.activatedRoute.snapshot.queryParams.uploadId;
    }

    if (this.activatedRoute.snapshot.queryParams.claimResponseId) {
      this.claimResponseId = this.activatedRoute.snapshot.queryParams.claimResponseId;
    }

    if (this.claimId && this.uploadId) {
      this.showClaim(this.claimId, this.uploadId, this.claimResponseId);
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
    setTimeout(() => {
      if (window.location.href.includes('payment-reconciliation-details')) {
        this.location.back();
      }
    }, 200);

  }

  toggleRow(index) {
    this.currentOpenRecord = (index === this.currentOpenRecord) ? -1 : index;
  }

  showClaim(claimId: string, uploadId: string, claimResponseId: string) {
    this.params.claimId = claimId;
    this.params.uploadId = uploadId;
    this.params.claimResponseId = claimResponseId;
    this.resetURL();
    this.claimDialogRef = this.dialog.open(CreateClaimNphiesComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false, data: { claimId }
    });

    this.claimDialogRef.afterClosed().subscribe(result => {
      this.claimDialogRef = null;
      this.params.claimId = null;
      this.params.editMode = null;
      this.resetURL();
    });
  }

  resetURL() {
    this.router.navigate([], {
      relativeTo: this.routeActive,
      queryParams: { ...this.params, editMode: null, size: null }
    });
  }

}
