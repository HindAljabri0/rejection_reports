import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { classRequest } from 'src/app/models/contractModels/classModels/classRequest';
import { classResponseTemplate } from 'src/app/models/contractModels/classModels/classResponseTemplate';
import { Contract } from 'src/app/models/contractModels/Contract';
import { ContractSearchModel } from 'src/app/models/contractModels/ContractSearchModel';
import { Policy } from 'src/app/models/contractModels/PolicyModels/Policy';
import { PolicySearchModel } from 'src/app/models/contractModels/PolicyModels/PolicySearchModel';
import { ContractClassService } from 'src/app/services/classService/contractClassService.service';
import { ContractService } from 'src/app/services/contractService/contract.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { PolicyService } from 'src/app/services/policyService/policyService.service';
import { SharedServices } from 'src/app/services/shared.services';
import { AddEditViewClassComponent } from '../add-edit-view-class/add-edit-view-class.component';

@Component({
    selector: 'app-add-edit-view-policy',
    templateUrl: './add-edit-view-policy.component.html',
    styles: []
})
export class AddEditViewPolicyComponent implements OnInit {
    contracts: Contract[];
    policy: Policy;
    classes: classResponseTemplate[];
    search: classRequest;

    length = 100;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 50, 100];
    showFirstLastButtons = true;


    d = new Date();
    oneyear = this.d.setDate(this.d.getDate() + 364);
    ContractController: FormControl = new FormControl();
    PolicyNoController: FormControl = new FormControl();
    PolicyNameController: FormControl = new FormControl();
    StartDateController: FormControl = new FormControl(new Date());
    EndDateController: FormControl = new FormControl(this.d);
    IsActiveController: FormControl = new FormControl(true);
    PolicyIdController: FormControl = new FormControl();

    errors = {
        contractId: "",
        PolicyNo: "",
        PolicyName: "",
        IsActive: "",
        StartDate: "",
        EndDate: ""

    }
    addMode: boolean = false;
    EditMode: boolean = false;
    param: PolicySearchModel = new PolicySearchModel();
    messageError = "";

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private sharedServices: SharedServices,
        private policyService: PolicyService,
        private dialogService: DialogService,
        private contractService: ContractService,
        private classService: ContractClassService
    ) { }

    ngOnInit() {
        this.getContractList();
        this.param.policyId = this.activatedRoute.snapshot.paramMap.get("policyId");
        this.param.withpagenation = false;

        var url = this.router.url;
        //console.log("Contract Id= "+this.param.contractId);

        if (url.endsWith('add') || this.param.policyId == null) {
            this.addMode = true;
        }
        else {
            this.getPolicy(this.param)
            this.EditMode = true;
            this.LoadPolicyClasses(this.param.policyId);
        }
    }
    fillSearchData(PolicyId) {
        this.search = new classRequest();
        this.search.policyId = PolicyId;
        this.search.providerId = this.sharedServices.providerId;
        this.search.className = "";
        this.search.insuranceCompCode = null;
        this.search.page = this.pageIndex;
        this.search.size = this.pageSize;
        this.search.withpagenation = true;

    }
    LoadPolicyClasses(PolicyId) {
        this.fillSearchData(PolicyId);
        console.log(this.search);
        this.classService.getClassBySearchParam(this.search).subscribe(event => {
            if (event instanceof HttpResponse) {
                console.log(event.body);
                if (event.body != null && event.body instanceof Array)
                    this.classes = event.body;
                //this.length = event.body["totalElements"]
            }
        }
            , err => {

                if (err instanceof HttpErrorResponse) {
                    console.log(err.message)
                    this.classes = null;
                }
            });
    }
    getPolicy(param) {
        this.policyService.getPolicyBySearchParam(param).subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;

                if (body instanceof Array) {
                    this.fillEditData(body[0]);
                }
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        });
    }
    handlePageEvent(event: PageEvent) {

        this.length = event.length;
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        localStorage.setItem('pagesize', event.pageSize + '');
        this.LoadPolicyClasses(this.PolicyIdController.value);

    }
    fillEditData(result) {
        this.ContractController.setValue(result.contractId);
        this.PolicyIdController.setValue(result.policyId);
        this.PolicyNoController.setValue(result.policyNo);
        this.PolicyNameController.setValue(result.policyName);
        this.StartDateController.setValue(result.startDate);
        this.EndDateController.setValue(result.endDate);
        this.IsActiveController.setValue(result.isActive == 'Y' ? true : false);
    }

    checkError() {
        let thereIsError = false;
        this.errors.contractId = "";
        this.errors.PolicyNo = "";
        this.errors.PolicyName = "";
        this.errors.StartDate = "";
        this.errors.EndDate = "";

        if (this.ContractController == null || this.ContractController.value == null) {
            this.errors.contractId = "Contract must be specified"
            thereIsError = true;
        }
        if (this.PolicyNoController == null || this.PolicyNoController.value == null) {
            this.errors.PolicyNo = "Policy No must be specified"
            thereIsError = true;
        }
        if (this.PolicyNameController == null || this.PolicyNameController.value == null) {
            this.errors.PolicyName = "Contract Name must be specified"
            thereIsError = true;
        }

        if (this.StartDateController == null || this.StartDateController.value == null) {
            this.errors.StartDate = "Start Date must be specified"
            thereIsError = true;
        }
        if (this.EndDateController == null || this.EndDateController.value == null) {
            this.errors.EndDate = "End Date must be specified"
            thereIsError = true;
        }
        if (this.EndDateController != null && this.StartDateController != null && this.StartDateController.value > this.EndDateController.value) {
            this.errors.EndDate = "End Date must be greater than start date"
            thereIsError = true;
        }

        return thereIsError;
    }
    SaveData() {
        if (this.checkError()) { return }
        this.policy = new Policy();
        this.policy.policyId = this.addMode ? 0 : this.PolicyIdController.value;
        this.policy.contractId = this.ContractController.value;
        this.policy.policyNo = this.PolicyNoController.value;
        this.policy.policyName = this.PolicyNameController.value;
        this.policy.startDate = this.StartDateController.value;
        this.policy.endDate = this.EndDateController.value;
        this.policy.isActive = this.IsActiveController.value ? "Y" : "N";
        console.log(this.policy);
        this.policyService.ManipulatePolicy(this.policy).subscribe(event => {
            if (event instanceof HttpResponse) {
                console.log(event.body);
                if (event.body != null) {
                    this.sharedServices.loadingChanged.next(false);
                    this.dialogService.showMessage('Success', 'Policy Saved Successfully', 'success', true, 'OK');
                }
            }
        }
            , err => {

                if (err instanceof HttpErrorResponse) {
                    if (err.status == 500) {
                        this.messageError = "could not reach server Please try again later "

                    } else {
                        this.messageError = err.message;
                    }

                    this.dialogService.showMessage(err.error.message, '', 'alert', true, 'OK', err.error.errors);
                    this.sharedServices.loadingChanged.next(false);
                }
            });
    }
    getContractList() {
        let _search = new ContractSearchModel();
        _search.providerId = this.sharedServices.providerId;
        _search.withPagination = false;
        this.contractService.getContractBySearchParam(_search).subscribe(event => {
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

}
