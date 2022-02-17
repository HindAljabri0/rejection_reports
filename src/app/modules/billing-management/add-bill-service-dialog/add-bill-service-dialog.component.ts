import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, throwMatDuplicatedDrawerError } from '@angular/material';
import { ServiceSearchModel } from 'src/app/models/contractModels/BillingModels/ServiceSearchModel';
import { ContractService } from 'src/app/services/contractService/contract.service';
import { SharedServices } from 'src/app/services/shared.services';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-add-bill-service-dialog',
    templateUrl: './add-bill-service-dialog.component.html',
    styles: []
})
export class AddBillServiceDialogComponent implements OnInit {
    data: any;
    serviceSearchModel: ServiceSearchModel[] = [];
    selectedService: string;
    closeStatus: boolean = false;
    constructor(
        private dialogRef: MatDialogRef<AddBillServiceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,
        private sharedServices: SharedServices,
        private contractService: ContractService) {
        this.data = dialogData;
    }
    length = 100;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 50, 100];
    showFirstLastButtons = true;

    addBillServiceController: FormControl = new FormControl();

    errors = {
        ServiceCode: "",
    }

    ngOnInit() {
        //this.serviceSearchModel = <ServiceSearchModel[]>[];
        this.searchServiceList();
    }
    addServiceAndCloseDialog() {
        if (this.checkError()) { return }
        this.closeStatus = true;

        var selectedServiceFromPopup = this.serviceSearchModel.filter(obj => {
            return obj.serviceId === parseInt(this.selectedService);
        })
        //alert("filterObj  " + JSON.stringify(selectedServiceFromPopup));
        this.dialogRef.close(selectedServiceFromPopup);
    }

    closeDialog() {
        this.dialogRef.close();
    }

    checkError() {
        let thereIsError = false;
        this.errors.ServiceCode = "";

        if (this.addBillServiceController == null || this.addBillServiceController.value == null) {
            this.errors.ServiceCode = "Service must be selected"
            thereIsError = true;
        }
        return thereIsError;
    }

    searchServiceList() {
        this.contractService.servicesListSearch(this.sharedServices.providerId, this.data).subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (body instanceof Array) {
                    this.serviceSearchModel = body;
                }
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        })
    }

    searchServices() {
        //this.serviceSearchModel.find(service => service.serviceName == this.addBillServiceController.value);
        //alert(this.serviceSearchModel.find(service => service.serviceName == this.addBillServiceController.value));
        //console.log("data :: "+JSON.stringify(this.serviceSearchModel))
        //this.serviceSearchModel;
    }

}
