import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Console } from 'console';
import { benefit } from 'src/app/models/contractModels/classModels/benefit';
import { classCrudRequest } from 'src/app/models/contractModels/classModels/classCrudRequest';
import { classRequest } from 'src/app/models/contractModels/classModels/classRequest';
import { contractClass } from 'src/app/models/contractModels/classModels/contractClass';
import { subbenefit } from 'src/app/models/contractModels/classModels/subbenefits';
import { Policy } from 'src/app/models/contractModels/PolicyModels/Policy';
import { PolicySearchModel } from 'src/app/models/contractModels/PolicyModels/PolicySearchModel';
import { ContractClassService } from 'src/app/services/classService/contractClassService.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { PolicyService } from 'src/app/services/policyService/policyService.service';
import { SharedServices } from 'src/app/services/shared.services';

@Component({
    selector: 'app-add-edit-view-class',
    templateUrl: './add-edit-view-class.component.html',
    styles: []
})
export class AddEditViewClassComponent implements OnInit {
    benefits: {
        departmentId: number,
        departmentName: string,
        benefitId: number;
        maxLimitController: FormControl;
        isExcludedController: FormControl;
        contractDeptId: number;
    }[] = [];
    subbenefits: {
        subId: number;
        contractServiceId: number;
        serviceId: number;
        serviceCode: string;
        serviceName: string;
        departmentId: number;
        departmentName: string;
        maxLimitController: FormControl;
        isExcludedController: FormControl;
    }[] = [];

    errors = {
        policyId: "",
        className: "",
        visitLimit: "",
        patientShare: "",
        shareType: "",
        maxLimit: "",
        benefits: "",
        subbenefits: "",
    }

    addMode: boolean = false;
    EditMode: boolean = false;
    policyId: string = '0';
    param: classRequest = new classRequest();

    messageError = "";
    contractId: number = 0;
    policyList: Policy[];
    policyLoad: PolicySearchModel = new PolicySearchModel();
    contract_departments: benefit[];
    contract_services: subbenefit[];
    classTemplate: classCrudRequest;
    contract_class: contractClass;

    PolicyController: FormControl = new FormControl("0");
    IsActiveController: FormControl = new FormControl(true);
    ClassIdController: FormControl = new FormControl();
    ClassNameController: FormControl = new FormControl();
    PatientShareController: FormControl = new FormControl();
    ShareTypeController: FormControl = new FormControl("SR");
    MaxLimitController: FormControl = new FormControl();
    ThresholdController: FormControl = new FormControl();
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private sharedServices: SharedServices,
        private policyService: PolicyService,
        private classService: ContractClassService,
        private dialogService: DialogService
    ) { }

    ngOnInit() {
        this.param.classId = this.activatedRoute.snapshot.paramMap.get("classId")
        var url = this.router.url;
        //console.log("Class Id= "+this.param.classId);
        this.policyId = this.activatedRoute.snapshot.paramMap.get("policyId");
        this.getPolicyList();
        //console.log("policy Id= "+this.policyId);
        if (url.endsWith('add') || this.param.classId == null) {
            this.addMode = true;
            this.fillData(null);
        }
        else {
            this.getClass(this.param)
            this.EditMode = true;
            this.param.providerId = this.sharedServices.providerId;
            this.param.withpagenation = false;
        }

    }

    getClass(param) {

        this.classService.getClassBySearchParam(param).subscribe(event => {
            if (event instanceof HttpResponse) {
                //console.log(event.body);
                if (event.body != null && event.body instanceof Array)
                    this.fillData(event.body[0]);
                //this.length = event.body["totalElements"]
            }
        }
            , err => {

                if (err instanceof HttpErrorResponse) {
                    console.log(err.message)

                }
            });
    }
    updateContractId(value) {

        if (value != null && this.policyList != null) {
            //this.contractId = value;
            this.PolicyController.setValue(value);
            let policy: Policy[] = this.policyList.filter(x => x.policyId == value);
            console.log("policy = " + value);
            this.contractId = policy[0].contractId;
            console.log("contractId = " + this.contractId);
            this.fillData(null);
        }
    }
    IncludeServ() {
        if (this.PolicyController == null || this.PolicyController.value == null) {
            this.errors.policyId = "Policy must be specified"
            return;
        }
        for (let dept of this.benefits) {
            //console.log("deptId = " + dept.departmentId + " dept discount = " + dept.isExcludedController.value );
            if (dept.isExcludedController.value != null) {
                for (let service of this.subbenefits) {
                    if (service.departmentId == dept.departmentId) {
                        service.isExcludedController.setValue(dept.isExcludedController.value);
                    }
                }
            }
        }
    }
    fillData(EditData) {
        if (this.EditMode && EditData != null) {
            let contractclass: contractClass = EditData.contract_class;
            this.PolicyController.setValue(contractclass.policyId);
            this.ClassIdController.setValue(contractclass.classId);
            this.ClassNameController.setValue(contractclass.className);
            this.PatientShareController.setValue(contractclass.patientShare);

            this.ShareTypeController.setValue(contractclass.shareType);
            this.IsActiveController.setValue(contractclass.isActive == 'Y' ? true : false);
            this.ThresholdController.setValue(contractclass.visitThreshold);
            this.MaxLimitController.setValue(contractclass.maxLimit);

            this.updateContractId(contractclass.policyId);
            this.policyId = contractclass.policyId;
            console.log("if policyId = " + this.PolicyController.value);
        } /*else {
            console.log("else policyId = " + this.PolicyController.value);
            this.PolicyController.setValue(this.policyId);
        }*/
        console.log("PolicyController = " + this.PolicyController.value);
        if (this.PolicyController.value != 0) {
            this.classService.getContractDeparmentsByProviderId(this.sharedServices.providerId, this.contractId, this.ClassIdController.value == null ? 0 : this.ClassIdController.value).subscribe(event => {
                if (event instanceof HttpResponse) {
                    //console.log(event.body);
                    if (event.body != null && event.body instanceof Array) {
                        this.contract_departments = event.body;
                        this.SetBenefitsData();
                    }
                    //this.length = event.body["totalElements"]
                }
            }
                , err => {

                    if (err instanceof HttpErrorResponse) {
                        console.log(err.message)
                        this.contract_departments = null;
                    }
                });
            this.classService.getContractServicesByProviderId(this.sharedServices.providerId, this.contractId, this.ClassIdController.value == null ? 0 : this.ClassIdController.value).subscribe(event => {
                if (event instanceof HttpResponse) {
                    //console.log(event.body);
                    if (event.body != null && event.body instanceof Array) {
                        this.contract_services = event.body;
                        this.SetSubBenefits();
                    }
                    //this.length = event.body["totalElements"]
                }
            }
                , err => {

                    if (err instanceof HttpErrorResponse) {
                        console.log(err.message)
                        this.contract_services = null;
                    }
                });
        }
    }
    SetBenefitsData() {
        this.benefits = [];
        //console.log(this.departments);
        for (let dept of this.contract_departments) {
            this.benefits.push(
                {
                    departmentId: dept.departmentId,
                    departmentName: dept.departmentName,
                    benefitId: dept.benefitId,
                    maxLimitController: new FormControl(dept.maxLimit),
                    isExcludedController: new FormControl((dept.isExcluded == null || dept.isExcluded == 'Y') ? true : false),
                    contractDeptId: dept.contractDeptId
                }
            )
        }
    }
    SetSubBenefits() {
        this.subbenefits = [];
        //console.log(this.departments);
        for (let serv of this.contract_services) {
            console.log(" isExcluded = " + serv.isExcluded);
            this.subbenefits.push(
                {
                    subId: serv.subId,
                    contractServiceId: serv.contractServiceId,
                    serviceId: serv.serviceId,
                    serviceCode: serv.serviceCode,
                    serviceName: serv.serviceName,
                    departmentId: serv.departmentId,
                    departmentName: serv.departmentName,
                    maxLimitController: new FormControl(serv.maxLimit),
                    isExcludedController: new FormControl((serv.isExcluded == null || serv.isExcluded == 'Y') ? true : false),
                }
            )
        }
        //this.IncludeServ();
    }
    getPolicyList() {
        this.policyLoad.withpagenation = false;
        this.policyLoad.providerId = this.sharedServices.providerId;
        this.policyService.getPolicyBySearchParam(this.policyLoad).subscribe(event => {
            if (event instanceof HttpResponse) {
                console.log(event.body);
                if (event.body != null && event.body instanceof Array) {
                    this.policyList = event.body;
                    //this.PolicyController.setValue(this.policyId);

                    this.updateContractId(this.policyId);
                }//this.length = event.body["totalElements"]
            }
        }
            , err => {

                if (err instanceof HttpErrorResponse) {
                    console.log(err.message)
                    this.policyList = null;
                }
            });
    }
    checkError() {
        let thereIsError = false;
        this.errors.policyId = "";
        this.errors.className = "";
        this.errors.visitLimit = "";
        this.errors.patientShare = "",
            this.errors.shareType = "";
        this.errors.maxLimit = "";
        this.errors.subbenefits = "";
        this.errors.benefits = "";


        if (this.PolicyController == null || this.PolicyController.value == null) {
            this.errors.policyId = "Policy must be specified"
            thereIsError = true;
        }

        if (this.ClassNameController == null || this.ClassNameController.value == null) {
            this.errors.className = "Class Name must be specified"
            thereIsError = true;
        }
        if (this.ThresholdController == null || this.ThresholdController.value == null) {
            this.errors.visitLimit = "Visit Threshold must be specified"
            thereIsError = true;
        }
        if (this.PatientShareController == null || this.PatientShareController.value == null) {
            this.errors.patientShare = "Patient Share must be specified"
            thereIsError = true;
        }
        if (this.ShareTypeController == null || this.ShareTypeController.value == null) {
            this.errors.shareType = "Share Type must be specified"
            thereIsError = true;
        }
        if (this.MaxLimitController == null || this.MaxLimitController.value == null) {
            this.errors.maxLimit = "Max Limit must be specified"
            thereIsError = true;
        }
        if (this.benefits != null && this.benefits.filter(function (obj) {
            return obj.isExcludedController.value == false && obj.maxLimitController.value == null;
        }).length > 0) {
            this.errors.benefits = "You must Enter limit for included Benefits"
            thereIsError = true;
        }
        if (this.subbenefits != null && this.subbenefits.filter(function (obj) {
            return obj.isExcludedController.value == false && obj.maxLimitController.value == null;
        }).length > 0) {
            this.errors.subbenefits = "You must Enter limit for included Sub Benefits"
            thereIsError = true;
        }

        return thereIsError;

    }

    SaveData() {

        if (this.checkError()) { return }
        this.classTemplate = new classCrudRequest();
        this.classTemplate.policyId = this.PolicyController.value;
        this.classTemplate.providerId = this.sharedServices.providerId;

        this.contract_class = new contractClass();
        this.contract_class.classId = this.addMode ? 0 : this.ClassIdController.value;
        this.contract_class.className = this.ClassNameController.value;
        this.contract_class.patientShare = this.PatientShareController.value;
        this.contract_class.shareType = this.ShareTypeController.value;
        this.contract_class.isActive = this.IsActiveController.value ? "Y" : "N";
        this.contract_class.visitThreshold = this.ThresholdController.value;
        this.contract_class.maxLimit = this.MaxLimitController.value;
        //Set Tamplate Data
        this.classTemplate.contract_class = this.contract_class;

        this.classTemplate.benefits = this.benefits.filter(function (obj) {
            return obj.isExcludedController.value == false;
        }).map(dep => ({
            benefitId: dep.benefitId,
            maxLimit: dep.maxLimitController.value,
            isExcluded: dep.isExcludedController.value ? 'Y' : 'N',
            contractDeptId: dep.contractDeptId,
            departmentId: dep.departmentId
        }));

        this.classTemplate.subBenefits = this.subbenefits.filter(function (obj) {
            return obj.isExcludedController.value == false;
        }).map(service => ({
            subId: service.subId,
            maxLimit: service.maxLimitController.value,
            isExcluded: service.isExcludedController.value ? 'Y' : 'N',
            contractServiceId: service.contractServiceId,
            serviceId: service.serviceId,

        }));
        //End of set data
        console.log(JSON.stringify(this.classTemplate));

        this.classService.ManipulateClass(this.classTemplate).subscribe(event => {
            if (event instanceof HttpResponse) {
                console.log(event.body);
                if (event.body != null) {
                    this.dialogService.showMessage('Success', 'Class Saved Successfully', 'success', true, 'OK');
                    this.sharedServices.loadingChanged.next(false);
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
}
