import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';
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
  beneficiaries: BeneficiarySearch[] ;
  constructor(private sharedServices: SharedServices, private providersBeneficiariesService: ProvidersBeneficiariesService, private providerNphiesSearchService: ProviderNphiesSearchService, private dialogService: DialogService) { }

  length = 100;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 50, 100];
  showFirstLastButtons = true;


  nameController: FormControl = new FormControl();
  nationalIdController: FormControl = new FormControl();
  contactNoController: FormControl = new FormControl();
  fileIdController: FormControl = new FormControl();
  memberCardidController: FormControl = new FormControl();


  handlePageEvent(event: PageEvent) {
   // this.beneficiaries = [];
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    localStorage.setItem('pagesize', event.pageSize + '');
    this.searchByCriteria();

  }

  ngOnInit() {

    this.providerNphiesSearchService.NphisBeneficiarySearchByCriteria(this.sharedServices.providerId, null, null, null, null, null, 0, 10).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.body != null && event.body instanceof Array)
          this.beneficiaries = [];
         
        this.beneficiaries = event.body["content"] as BeneficiarySearch[];
        this.length = event.body["totalElements"]
      }
    }
      , err => {

        if (err instanceof HttpErrorResponse) {
          console.log(err.message)


        }
      });

  }

  searchByCriteria() {

      this.providerNphiesSearchService.NphisBeneficiarySearchByCriteria(this.sharedServices.providerId,
      this.nationalIdController.value, this.nameController.value, this.memberCardidController.value,
      this.fileIdController.value, this.contactNoController.value, this.pageIndex, this.pageSize).subscribe(event => {
        if (event instanceof HttpResponse) {
          if (event.body != null && event.body instanceof Array)
            this.beneficiaries = [];
          this.beneficiaries = event.body["content"] as BeneficiarySearch[];
          this.length = event.body["totalElements"]
        }
      }
        , err => {

          if (err instanceof HttpErrorResponse) {
            console.log(err.message)


          }
        });

  }

}
