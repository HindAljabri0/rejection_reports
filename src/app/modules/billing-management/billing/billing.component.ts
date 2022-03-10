import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { SearchBillingPatientDialogComponent } from '../search-billing-patient-dialog/search-billing-patient-dialog.component';
import { ContractService } from 'src/app/services/contractService/contract.service';
import { SharedServices } from 'src/app/services/shared.services';
import { FormControl } from '@angular/forms';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { PageEvent } from '@angular/material';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { BeneficiarySearch } from 'src/app/models/nphies/beneficiarySearch';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { BillTemplate } from 'src/app/models/contractModels/BillingModels/BillTemplate';

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
    billListTemplate: BillTemplate;

    constructor(
        private dialog: MatDialog,
        private sharedServices: SharedServices,
        private contractService: ContractService,
        private adminService: AdminService,
        private providerNphiesSearchService: ProviderNphiesSearchService,
        private dialogService: DialogService
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
                    console.log("Assignment");
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

    deleteBill(billToDelete) {
        this.billListTemplate = new BillTemplate();
        this.billListTemplate.billNo = billToDelete.bill_No;
        this.billListTemplate.billDate = billToDelete.bill_Date;
        this.billListTemplate.grossAmount = billToDelete.gross_Amount;
        this.billListTemplate.discountAmount = billToDelete.discount_Amount;
        this.billListTemplate.additionalDiscount = billToDelete.additional_Discount;
        this.billListTemplate.additionalDiscountPercent = billToDelete.additional_Discount_Percent;
        this.billListTemplate.netAmount = billToDelete.net_Amount;
        this.billListTemplate.isInvoiced = billToDelete.is_Invoiced;
        this.billListTemplate.isDeleted = 'Y';

        this.dialogService.openMessageDialog(
            new MessageDialogData('Delete Record?',
                `Are you sure you want to delete it?`,
                false,
                true)).subscribe(result => {
                    if (result === true) {
                        this.contractService.deleteBill(this.billListTemplate).subscribe(event => {
                            if (event instanceof HttpResponse) {
                                if (event.status === 200) {
                                    this.sharedServices.loadingChanged.next(false);
                                    this.dialogService.openMessageDialog(new MessageDialogData('',
                                        `Bill was deleted successfully.`,
                                        false));
                                    this.getBillList();
                                }
                            }
                        }, errorEvent => {
                            if (errorEvent instanceof HttpErrorResponse) {

                            }
                        });

                    }
                });
    }
}
