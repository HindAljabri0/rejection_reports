import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BeneficiarySearch } from 'src/app/models/nphies/beneficiarySearch';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
  selector: 'app-search-beneficiary',
  templateUrl: './search-beneficiary.component.html'

})
export class SearchBeneficiaryComponent implements OnInit {
  Beneficiaries: BeneficiarySearch[];
  constructor(private sharedServices: SharedServices, private providersBeneficiariesService: ProvidersBeneficiariesService, private providerNphiesSearchService: ProviderNphiesSearchService, private dialogService: DialogService) { }

  ngOnInit() {

    this.providerNphiesSearchService.NphisBeneficiarySearchByCriteria(this.sharedServices.providerId, null, null, null, null, null).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array)
          this.Beneficiaries = event.body as BeneficiarySearch[];
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          console.log(err.message)


        }
      });

    }

}
