import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Payer } from 'src/app/models/nphies/payer';
import { TransactionLog } from 'src/app/models/nphies/transactionLog';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-transactions-log',
  templateUrl: './transactions-log.component.html',
  styleUrls: ['./transactions-log.component.css']
})
export class TransactionsLogComponent implements OnInit, AfterContentInit {

  payers:Payer[] = [];
  transactions: TransactionLog[] = [];

  constructor(private searchService: ProviderNphiesSearchService, private sharedServices: SharedServices, private beneficiaryService: ProvidersBeneficiariesService) { }
  

  ngOnInit() {
    this.sharedServices.loadingChanged.next(true);
    this.beneficiaryService.getPayers().subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        const body = event.body;
        if (body instanceof Array) {
          this.payers = body;
        }
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {

      }
    });
  }

  ngAfterContentInit(): void {
    this.sharedServices.loadingChanged.next(true);
    this.searchService.searchTransactionsLog().subscribe(event => {
      if (event instanceof HttpResponse) {
        this.sharedServices.loadingChanged.next(false);
        const body = event.body;
        if (body instanceof Array) {
          this.transactions = body;
        }
      }
    }, errorEvent => {
      this.sharedServices.loadingChanged.next(false);
      if (errorEvent instanceof HttpErrorResponse) {
        if (errorEvent.status == 404) {

        } else {

        }
      }
    });
  }

  getPayerName(id){
    const index = this.payers.findIndex(payer => payer.nphiesId == `${id}`);
    if(index != -1){
      return this.payers[index].englistName;
    }
    return id;
  }

}
