import { Component, OnInit, ViewChild } from '@angular/core';
import { ClaimProcessedTransactionsComponent } from './claim-processed-transactions/claim-processed-transactions.component';
import { ClaimCommunicationRequestsComponent } from './claim-communication-requests/claim-communication-requests.component';
import { SharedServices } from 'src/app/services/shared.services';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-claim-transactions',
  templateUrl: './claim-transactions.component.html',
  styleUrls: ['./claim-transactions.component.css']
})
export class ClaimTransactionsComponent implements OnInit {

  @ViewChild('processedTransactions', { static: false }) processedTransactions: ClaimProcessedTransactionsComponent;
  @ViewChild('communicationRequests', { static: false }) communicationRequests: ClaimCommunicationRequestsComponent;

  payersList = [];
  hoverText: string = '';

  constructor(
    public sharedServices: SharedServices,
    private beneficiaryService: ProvidersBeneficiariesService,
  ) { }

  ngOnInit() {
    this.getPayerList();
  }

  getPayerList(isFromUrl: boolean = false) {
    this.sharedServices.loadingChanged.next(true);
    this.beneficiaryService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        if (body instanceof Array) {
          this.payersList = body;
          this.processedTransactions.getProcessedTransactions();
        }
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  tabChange($event) {
    if ($event && $event.index === 0) {
      this.processedTransactions.getProcessedTransactions();
    } else if ($event && $event.index === 1) {
      this.communicationRequests.getCommunicationRequests();
    }
  }

  get NewClaimTransactionProcessed() {
    return this.sharedServices.unReadClaimProcessedTotalCount;
  }

  get NewClaimComunicationRequests() {
    return this.sharedServices.unReadClaimComunicationRequestTotalCount;
  }
  get NewClaimComunicationNonReAdjudicationRequests() {
    return this.sharedServices.unReadClaimComunicationRequestNonReAdjudicationCount;
  }
  get NewClaimComunicationReAdjudicationRequests() {
    return this.sharedServices.unReadClaimComunicationRequestReAdjudicationCount;
  }

}
