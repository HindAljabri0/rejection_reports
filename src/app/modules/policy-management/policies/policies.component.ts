import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, PageEvent } from '@angular/material';
import { Contract } from 'src/app/models/contractModels/Contract';
import { ContractSearchModel } from 'src/app/models/contractModels/ContractSearchModel';
import { Policy } from 'src/app/models/contractModels/PolicyModels/Policy';
import { PolicySearchModel } from 'src/app/models/contractModels/PolicyModels/PolicySearchModel';
import { ContractService } from 'src/app/services/contractService/contract.service';
import { PolicyService } from 'src/app/services/policyService/policyService.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
    selector: 'app-policies',
    templateUrl: './policies.component.html',
    styles: []
})
export class PoliciesComponent implements OnInit {
    constructor(private sharedServices: SharedServices,
        private contractService: ContractService,
        private policyService: PolicyService,
        private dialog: MatDialog) { }
    length = 100;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 50, 100];
    showFirstLastButtons = true;
    selectedContract: string;
    selectedPolicy: string;
    purposeRadioButton: string = "0";


    search: PolicySearchModel = new PolicySearchModel();
    policyLoad: PolicySearchModel = new PolicySearchModel();

    contracts: Contract[];
    policies: Policy[];
    policyList: Policy[];

    ContractController: FormControl = new FormControl();
    StartDateController: FormControl = new FormControl();
    EndDateController: FormControl = new FormControl();
    PolicyController: FormControl = new FormControl();

    ngOnInit() {
        this.getContractList();
        this.getPolicyList();
        this.searchByCriteria();
        this.OptionChanged('0');
        //this.MapContractName();
    }
    filterOptions() {
        console.log(this.PolicyController.value);
        const filterValue = this.PolicyController.value.toLowerCase;
        this.policyList = this.policyList.filter(op => op.policyName.toLowerCase().match(filterValue));
    }
    handlePageEvent(event: PageEvent) {

        this.length = event.length;
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        localStorage.setItem('pagesize', event.pageSize + '');
        this.searchByCriteria();

    }
    selectPolicy(policy) {
        this.search.policyId = policy.policyId;
        this.PolicyController.setValue(policy.policyNo + '-' + '(' + policy.policyName + ')');
        //this.PolicyController.setValue(policy.policyId);
    }
    OptionChanged(value) {
        console.log("value=" + value);
        if (value == '0') {
            //this.PolicyController.disable();
            this.PolicyController.setValue(null);
            this.StartDateController.setValue(null);
            this.EndDateController.setValue(null);
            this.ContractController.setValue(null);

        } else if (value == '1') {
            //this.PolicyController.disable();
            this.PolicyController.setValue(null);
            this.StartDateController.setValue("");
            this.EndDateController.setValue("");

        } else if (value == '2') {

            //this.PolicyController.disable();
            this.PolicyController.setValue(null);
            this.ContractController.setValue(null);
        } else if (value == '3') {
            //this.PolicyController.enable();
            this.ContractController.setValue(null);
            this.StartDateController.setValue("");
            this.EndDateController.setValue("");

        }
    }
    searchByCriteria() {

        //this.search.startDate = this.StartDateController.value;
        this.search.endDate = this.EndDateController.value;
        this.search.contractId = this.ContractController.value;
        this.search.policyName = this.PolicyController.value;

        this.search.providerId = this.sharedServices.providerId;
        this.search.page = this.pageIndex;
        this.search.size = this.pageSize;
        this.search.withpagenation = true;
        console.log(this.search);
        this.policyService.getPolicyBySearchParam(this.search).subscribe(event => {
            if (event instanceof HttpResponse) {
                //console.log(event.body);
                if (event.body != null && event.body instanceof Array) {
                    this.policies = event.body;

                }
                //this.length = event.body["totalElements"]
            }
        }
            , err => {

                if (err instanceof HttpErrorResponse) {
                    console.log(err.message)
                    this.policies = null;
                }
            });
    }
    getContractList() {
        let _search = new ContractSearchModel();
        _search.providerId = this.sharedServices.providerId;
        _search.withPagination = false;
        console.log(_search);
        this.contractService.getContractBySearchParam(_search).subscribe(event => {
            if (event instanceof HttpResponse) {
                //console.log(event.body);
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
    MapContractName() {
        this.policies.forEach(element => {
            element.contractName = this.contracts.find(x => x.contractId == element.contractId).contactName;
            console.log(" Contract Name " + element.contractName);
        });
    }
    getPolicyList() {
        this.policyLoad.withpagenation = false;
        this.policyLoad.providerId = this.sharedServices.providerId;
        this.policyService.getPolicyBySearchParam(this.policyLoad).subscribe(event => {
            if (event instanceof HttpResponse) {
                console.log(event.body);
                if (event.body != null && event.body instanceof Array)
                    this.policyList = event.body;
                //this.length = event.body["totalElements"]
            }
        }
            , err => {

                if (err instanceof HttpErrorResponse) {
                    console.log(err.message)
                    this.policyList = null;
                }
            });
    }
}
