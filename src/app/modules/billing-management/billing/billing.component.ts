import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { SearchBillingPatientDialogComponent } from '../search-billing-patient-dialog/search-billing-patient-dialog.component';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { ContractService } from 'src/app/services/contractService/contract.service';
import { SharedServices } from 'src/app/services/shared.services';
import { FormControl } from '@angular/forms';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { PageEvent } from '@angular/material';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { BeneficiarySearch } from 'src/app/models/nphies/beneficiarySearch';

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styles: []
})
export class BillingComponent implements OnInit {
    departmentList = [];
    doctorList = [];
    billList = [];
    beneficiaries = [];
    selectedDepartment: string;
    selectedPatient: string;
    selectedDoctor: string;
    dialogRef: MatDialog;

    constructor(
        private dialog: MatDialog,
        private sharedServices: SharedServices,
        private contractService: ContractService,
        private beneficiaryService: ProvidersBeneficiariesService,
        private adminService: AdminService,
        private providerNphiesSearchService: ProviderNphiesSearchService
    ) { }

    length = 100;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 50, 100];
    showFirstLastButtons = true;

    billingControllerDepartment: FormControl = new FormControl();
    billingControllerDoctor: FormControl = new FormControl();
    billingControllerPatient: FormControl = new FormControl();

    ngOnInit() {
        this.getDepartmentList();
        this.getBillList();
        this.getDoctorList();
        this.getBeneList();
    }

    handlePageEvent(event: PageEvent) {

        this.length = event.length;
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;

        localStorage.setItem('pagesize', event.pageSize + '');
        this.getBillList();

    }

    openSearchPatientDialog() {
        const dialogRef = this.dialog.open(SearchBillingPatientDialogComponent, {
            panelClass: ['primary-dialog', 'dialog-lg']
        })
    }


    getBillList() {
        this.contractService.getBillList(this.sharedServices.providerId).subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (body instanceof Array) {
                    this.billList = body;
                }
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        });
    }

    getDepartmentList() {
        this.contractService.getDeparmentsByProviderId(this.sharedServices.providerId).subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (body instanceof Array) {
                    this.departmentList = body;
                }
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        });
    }

    getDoctorList() {
        this.adminService.getPractitionerList(this.sharedServices.providerId).subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (body instanceof Array) {
                    this.doctorList = body;
                }
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        });
    }

    getBeneList() {
        this.providerNphiesSearchService.NphisBeneficiarySearchByCriteria(this.sharedServices.providerId, null, null, null, null, null, 0, 10).subscribe(event => {
            if (event instanceof HttpResponse) {
                if (event.body != null && event.body instanceof Array)
                    this.beneficiaries = [];

                this.beneficiaries = event.body["content"] as BeneficiarySearch[];
                this.length = event.body["totalElements"]
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        });
    }
}
