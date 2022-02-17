import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { MatDialog, MatPaginator } from '@angular/material';

import { SharedServices } from 'src/app/services/shared.services';
import { ContractService } from 'src/app/services/contractService/contract.service';
import { Contract } from 'src/app/models/contractModels/Contract';
import { ContractSearchModel } from 'src/app/models/contractModels/ContractSearchModel';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
@Component({
    selector: 'app-contracts',
    templateUrl: './contracts.component.html',
    styles: []
})
export class ContractsComponent implements OnInit {
    contracts: Contract[];
    payersList = [];
    selectedPayer: string;
    search: ContractSearchModel = new ContractSearchModel();
    constructor(private sharedServices: SharedServices,
        private contractService: ContractService,
        private beneficiaryService: ProvidersBeneficiariesService,
        private dialog: MatDialog) { }
    length = 100;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 50, 100];
    showFirstLastButtons = true;


    insuranceCompanyController: FormControl = new FormControl();

    ngOnInit() {
        this.insuranceCompanyController.setValue("0");
        this.fillSearchData();
        this.getPayerList();
        this.contractService.getContractBySearchParam(this.search, this.sharedServices.providerId).subscribe(event => {
            if (event instanceof HttpResponse) {
                if (event.body != null && event.body instanceof Array)
                    this.contracts = event.body;
                //this.length = event.body["totalElements"]
            }
        }
            , err => {
                if (err instanceof HttpErrorResponse) {
                    console.log(err.message)
                    this.contracts = null;
                }
            });
    }
    handlePageEvent(event: PageEvent) {

        this.length = event.length;
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;

        localStorage.setItem('pagesize', event.pageSize + '');
        this.searchByCriteria();

    }
    fillSearchData() {
        this.search = new ContractSearchModel();
        this.search.insCompCode = this.insuranceCompanyController.value == "0" ? null : this.insuranceCompanyController.value;
        this.search.providerId = this.sharedServices.providerId;
        this.search.withPagination = true;
        this.search.page = this.pageIndex;
        this.search.size = this.pageSize;

    }
    searchByCriteria() {
        this.fillSearchData();
        this.contractService.getContractBySearchParam(this.search, this.sharedServices.providerId).subscribe(event => {
            if (event instanceof HttpResponse) {
                console.log(event.body);
                if (event.body != null && event.body instanceof Array)
                    this.contracts = event.body;
                //this.length = event.body["totalElements"]
            }
        }
            , err => {

                if (err instanceof HttpErrorResponse) {
                    console.log(err.message)
                    this.contracts = null;
                }
            });
    }
    getPayerList() {
        this.beneficiaryService.getPayers().subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (body instanceof Array) {
                    this.payersList = body;
                }
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        });
    }
}
