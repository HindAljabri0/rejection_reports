import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ContractService } from 'src/app/services/contractService/contract.service';
import { SharedServices } from 'src/app/services/shared.services';
import { FormControl } from '@angular/forms';
import { AddBillServiceDialogComponent } from '../add-bill-service-dialog/add-bill-service-dialog.component';
import { ServiceSearchModel } from 'src/app/models/contractModels/BillingModels/ServiceSearchModel';
import { BillTemplate } from 'src/app/models/contractModels/BillingModels/BillTemplate';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';

@Component({
    selector: 'app-bill-details',
    templateUrl: './bill-details.component.html',
    styles: []
})
export class BillDetailsComponent implements OnInit {

    departmentList = [];
    selectedDepartment: string;
    serviceSearchModel: ServiceSearchModel[] = [];
    billTemplate: BillTemplate;
    tableGrossAmount: number = 0;
    tableDiscountAmount: number = 0;
    tableInsShareAmount: number = 0;
    tablePatientShareAmount: number = 0;
    tableNetAmount: number = 0;
    //serviceSearchModel2 = [];
    selectedService: string

    _services: {
        serviceId: number;
        isActiveServiceList: boolean;
        cashAmount: number;
        grossAmount: number,
        departmentId: number;
        serviceName: string;
        providerId: number;
        serviceCode: string;
        insServiceCode: string;
        insServiceName: string;
        insDiscountAmount: number;
        insDiscountType: string;
        quantity: FormControl,
        discountTypeController: FormControl,
        deptDepartmentName: string;
        deptDiscountType: string;
        deptDiscountAmount: number;
        patientShare: number;
        shareType: string;
        serviceDiscountAmount: number;
        patientShareAmount: number;
        insShareAmount: number;
        netShareAmount: number;
    }[] = [];

    messageError = "";

    constructor(
        private dialog: MatDialog,
        private sharedServices: SharedServices,
        private contractService: ContractService,
        private dialogService: DialogService
    ) { }

    length = 100;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 50, 100];
    showFirstLastButtons = true;

    billingDetailsController: FormControl = new FormControl();

    ngOnInit() {
        this.getDepartmentList();
    }

    openAddServiceDialog() {

        //var serviceSearchModelLocal: ServiceSearchModel[];
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = ['primary-dialog'];
        dialogConfig.data = {
            policyNo: 'P0587',
            classId: 3,
            departmentId: 2,
            //item: serviceSearchModelLocal
        };

        const dialogRef = this.dialog.open(AddBillServiceDialogComponent, dialogConfig);

        //dialogRef.beforeClosed().subscribe(result => alert("Before CLosed :: " + JSON.stringify(result)));

        dialogRef.afterClosed().subscribe(result => {
            //alert("after closed " + JSON.stringify(result));
            //alert("serviceSearchModel " + JSON.stringify(this.serviceSearchModel));
            //() => console.log('serviceSearchModel ' + JSON.stringify(this.serviceSearchModel));
            if (result) {
                //() => console.log('serviceExists ' + (typeof result[0].serviceId));
                //() => console.log('serviceExists ' + (typeof this.serviceSearchModel[0].serviceId));
                if (this._services.find(x => x.serviceId === result[0].serviceId)) {
                    //() => console.log('typeof ' + (typeof this.serviceSearchModel));

                    //alert("serviceExists");
                    this.dialogService.openMessageDialog({
                        title: '',
                        message: `Service Already Existing in Table`,
                        isError: true
                    });
                } else {
                    //alert("PUSHING " + JSON.stringify(this.serviceSearchModel));
                    //() => console.log('Push ' + JSON.stringify(this.serviceSearchModel));
                    //this.serviceSearchModel.push(result[0]);
                    this._services.push(result[0]);
                    this.calculateTableAmounts();
                }
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


    calculateTableAmounts() {

        this.tableGrossAmount = 0;
        this.tableDiscountAmount = 0;
        this.tableInsShareAmount = 0;
        this.tablePatientShareAmount = 0;
        this.tableNetAmount = 0;

        this._services.forEach(element => {
            // this.tableGrossAmount = Number((element.grossAmount + this.tableGrossAmount).toPrecision(2));
            // this.tableDiscountAmount = Number((element.serviceDiscountAmount + this.tableDiscountAmount).toPrecision(2));
            // this.tableInsShareAmount = Number((element.insShareAmount + this.tableInsShareAmount).toPrecision(2));
            // this.tablePatientShareAmount = Number((element.patientShareAmount + this.tablePatientShareAmount).toPrecision(2));
            // this.tableNetAmount = Number((element.netShareAmount + this.tableNetAmount).toPrecision(2));
            //element.quantity = new FormControl(element.quantity);

            this.tableGrossAmount = Number.parseFloat(element.grossAmount.toPrecision(element.grossAmount.toFixed().length + 2)) + Number.parseFloat(this.tableGrossAmount.toPrecision(this.tableGrossAmount.toFixed().length + 2));
            this.tableDiscountAmount = Number.parseFloat(element.serviceDiscountAmount.toPrecision(element.serviceDiscountAmount.toFixed().length + 2)) + Number.parseFloat(this.tableDiscountAmount.toPrecision(this.tableDiscountAmount.toFixed().length + 2));
            this.tableInsShareAmount = Number.parseFloat(element.insShareAmount.toPrecision(element.insShareAmount.toFixed().length + 2)) + Number.parseFloat(this.tableInsShareAmount.toPrecision(this.tableInsShareAmount.toFixed().length + 2));
            this.tablePatientShareAmount = Number.parseFloat(element.patientShareAmount.toPrecision(element.patientShareAmount.toFixed().length + 2)) + Number.parseFloat(this.tablePatientShareAmount.toPrecision(this.tablePatientShareAmount.toFixed().length + 2));
            this.tableNetAmount = Number.parseFloat(element.netShareAmount.toPrecision(element.netShareAmount.toFixed().length + 2)) + Number.parseFloat(this.tableNetAmount.toPrecision(this.tableNetAmount.toFixed().length + 2));


            //Number.parseFloat(discount.toPrecision(discount.toFixed().length + 2))
            Number.parseFloat(this.tableGrossAmount.toPrecision(this.tableGrossAmount.toFixed().length + 2))
            Number.parseFloat(this.tableDiscountAmount.toPrecision(this.tableDiscountAmount.toFixed().length + 2))
            Number.parseFloat(this.tableInsShareAmount.toPrecision(this.tableInsShareAmount.toFixed().length + 2))
            Number.parseFloat(this.tablePatientShareAmount.toPrecision(this.tablePatientShareAmount.toFixed().length + 2))
            Number.parseFloat(this.tableNetAmount.toPrecision(this.tableNetAmount.toFixed().length + 2))

            //console.log("typeof  :: " + typeof (element.quantity));

            if (element.quantity == null || element.quantity == undefined) {
                element.quantity = new FormControl(1);
            } else {
                if (typeof (element.quantity) == 'number' || typeof (element.quantity) == 'string') {
                    element.quantity = new FormControl(element.quantity);
                }
            }
        });
    }

    calculateAllPrices(e, serviceId) {

        for (let service of this._services) {
            //type == null? service.discountTypeController.value : type;
            //Number.parseFloat(discount.toPrecision(discount.toFixed().length + 2))
            if (serviceId == service.serviceId) {
                //console.log("Inside serviceId == service.serviceId " + JSON.stringify(serviceId));
                //console.log(Number.parseFloat(service.cashAmount.toPrecision(service.cashAmount.toFixed().length + 2)));
                service.grossAmount = 0;
                service.serviceDiscountAmount = 0;
                service.netShareAmount = 0;
                service.patientShareAmount = 0;
                service.insShareAmount = 0;

                //service.grossAmount = Number.parseFloat(service.cashAmount.toPrecision(service.cashAmount.toFixed().length + 2)) * Number.parseFloat(service.quantity.value);
                service.grossAmount = Number.parseFloat(service.cashAmount.toPrecision(service.cashAmount.toFixed().length + 2)) * Number.parseInt(service.quantity.value);
                service.grossAmount = Number.parseFloat(service.grossAmount.toPrecision(service.grossAmount.toFixed().length + 2))

                service.quantity = service.quantity.value;

                //New Calculations
                if (service.insDiscountType == '%') {
                    service.serviceDiscountAmount = this.calculatePercentage(service.insDiscountAmount, service.grossAmount);
                } else {
                    service.serviceDiscountAmount = Number.parseFloat(service.grossAmount.toPrecision(service.grossAmount.toFixed().length + 2)) - (Number.parseFloat(service.insDiscountAmount.toPrecision(service.insDiscountAmount.toFixed().length + 2)) * Number.parseFloat(service.quantity.value));
                }

                //service.netShareAmount = Number.parseFloat(service.grossAmount.toPrecision(service.grossAmount.toFixed().length + 2)) - Number.parseFloat(service.serviceDiscountAmount.toPrecision(service.serviceDiscountAmount.toFixed().length + 2));
                service.netShareAmount = service.grossAmount - service.serviceDiscountAmount;
                service.netShareAmount = Number.parseFloat(service.netShareAmount.toPrecision(service.netShareAmount.toFixed().length + 2))


                if (service.shareType == "%") {
                    service.patientShareAmount = this.calculatePercentage(service.patientShare, service.netShareAmount);
                } else {
                    service.patientShareAmount = Number.parseFloat(service.netShareAmount.toPrecision(service.netShareAmount.toFixed().length + 2)) - Number.parseFloat(service.patientShare.toPrecision(service.patientShare.toFixed().length + 2));
                }

                //service.insShareAmount = Number.parseFloat(service.netShareAmount.toPrecision(service.netShareAmount.toFixed().length + 2)) - Number.parseFloat(service.patientShareAmount.toPrecision(service.patientShareAmount.toFixed().length + 2));
                //console.log("Inside insShareAmount :: service.netShareAmount" + JSON.stringify(service.netShareAmount));
                //console.log("Inside insShareAmount :: service.patientShareAmount" + JSON.stringify(service.patientShareAmount));
                service.insShareAmount = service.netShareAmount - service.patientShareAmount;
                service.insShareAmount = Number.parseFloat(service.insShareAmount.toPrecision(service.insShareAmount.toFixed().length + 2))

            }
        }
        this.calculateTableAmounts();

    }

    calculatePercentage(obtained, total) {
        //Number.parseFloat(discount.toPrecision(discount.toFixed().length + 2))
        const intermediatePercentage = obtained / 100 * total;
        return Number.parseFloat(intermediatePercentage.toPrecision(intermediatePercentage.toFixed().length + 2));
    }


    createBill() {
        this.billTemplate = new BillTemplate();

        this.billTemplate.billDate = new Date();
        this.billTemplate.grossAmount = this.tableGrossAmount;
        this.billTemplate.netAmount = this.tableNetAmount;
        this.billTemplate.isInvoiced = 'N';
        this.billTemplate.discountAmount = this.tableDiscountAmount;
        this.billTemplate.additionalDiscount = 0;
        this.billTemplate.additionalDiscountPercent = 0;


        this.billTemplate.billServices = this._services.filter(function (obj) {
            return obj.quantity.value != null;
        }).map(service => ({
            serviceId: service.serviceId,
            isActiveServiceList: service.isActiveServiceList,
            cashAmount: service.cashAmount,
            grossAmount: service.grossAmount,
            departmentId: service.departmentId,
            serviceName: service.serviceName,
            providerId: service.providerId,
            serviceCode: service.serviceCode,
            insServiceCode: service.insServiceCode,
            insServiceName: service.insServiceName,
            insDiscountAmount: service.insDiscountAmount,
            insDiscountType: service.insDiscountType,
            quantity: service.quantity.value,
            deptDepartmentName: service.deptDepartmentName,
            deptDiscountType: service.deptDiscountType,
            deptDiscountAmount: service.deptDiscountAmount,
            patientShare: service.patientShare,
            shareType: service.shareType,
            serviceDiscountAmount: service.serviceDiscountAmount,
            patientShareAmount: service.patientShareAmount,
            insShareAmount: service.insShareAmount,
            netShareAmount: service.netShareAmount
        }));

        console.log("Yes");
        this.contractService.createBill(this.billTemplate).subscribe(event => {
            if (event instanceof HttpResponse) {
                console.log(event.body);
                if (event.body != null) {
                    this.dialogService.openMessageDialog({
                        title: '',
                        message: `Bill Saved successfully`,
                        isError: false
                    }).subscribe(event => { window.location.reload(); });
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

                    this.dialogService.openMessageDialog({
                        title: '',

                        message: this.messageError,
                        isError: true
                    });
                    this.sharedServices.loadingChanged.next(false);
                }
            });
    }

}
