import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { SearchBillingPatientDialogComponent } from '../search-billing-patient-dialog/search-billing-patient-dialog.component';
import { ProvidersBeneficiariesService } from 'src/app/services/providersBeneficiariesService/providers.beneficiaries.service.service';
import { ContractService } from 'src/app/services/contractService/contract.service';
import { SharedServices } from 'src/app/services/shared.services';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-billing',
    templateUrl: './billing.component.html',
    styles: []
})
export class BillingComponent implements OnInit {
    departmentList = [];
    doctorList = [];
    billList = [];
    selectedDepartment: string;
    selectedDoctor: string;
    dialogRef: MatDialog;

    constructor(
        private dialog: MatDialog,
        private sharedServices: SharedServices,
        private contractService: ContractService,
        private beneficiaryService: ProvidersBeneficiariesService,
    ) { }

    length = 100;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 50, 100];
    showFirstLastButtons = true;

    billingControllerDepartment: FormControl = new FormControl();
    billingControllerDoctor: FormControl = new FormControl();

    ngOnInit() {
        this.getDepartmentList();
        this.getBillList();
        this.getDoctorList();
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
        this.contractService.getDoctorsByProviderId(this.sharedServices.providerId).subscribe(event => {
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

}
