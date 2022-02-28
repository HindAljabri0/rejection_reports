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
import { AdminService } from 'src/app/services/adminService/admin.service';
import { ProviderNphiesSearchService } from 'src/app/services/providerNphiesSearchService/provider-nphies-search.service';
import { BeneficiarySearch } from 'src/app/models/nphies/beneficiarySearch';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BillSearchModel } from 'src/app/models/contractModels/BillingModels/BillSearchModel';
import { SEVEN } from '@angular/cdk/keycodes';
import { SelectionModel } from '@angular/cdk/collections';
import { BillServiceList } from 'src/app/models/contractModels/BillingModels/BillServiceList';
import { SharedBillingService } from 'src/app/services/contractService/shared-billing.service';

@Component({
    selector: 'app-bill-details',
    templateUrl: './bill-details.component.html',
    styles: []
})
export class BillDetailsComponent implements OnInit {

    departmentList = [];
    doctorList = [];
    beneficiaries = [];
    selectedDepartment: string;
    selectedDoctor: string;
    selectedPatient: string;
    serviceSearchModel: ServiceSearchModel[] = [];
    billTemplate: BillTemplate;
    tableGrossAmount: number = 0;
    tableDiscountAmount: number = 0;
    tableInsShareAmount: number = 0;
    tablePatientShareAmount: number = 0;
    tableNetAmount: number = 0;
    //serviceSearchModel2 = [];
    selectedService: string
    updateBillNo: number;


    /*_services: {
        serviceId: number;
        isActiveServiceList: boolean;
        cashAmount: number;
        grossAmount: number;
        departmentId: number;
        serviceName: string;
        providerId: number;
        serviceCode: string;
        insServiceCode: string;
        insServiceName: string;
        insDiscountAmount: number;
        insDiscountType: string;
        quantity: FormControl;
        discountTypeController: FormControl;
        deptDepartmentName: string;
        deptDiscountType: string;
        deptDiscountAmount: number;
        patientShare: number;
        shareType: string;
        serviceDiscountAmount: number;
        patientShareAmount: number;
        insShareAmount: number;
        netShareAmount: number;
    }[] = [];*/

    /*_generateInvoiceServices: {
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
    }[] = [];*/

    serviceListModel: BillServiceList[] = [];
    selectedServicesForInvoice: BillServiceList[] = [];

    //selectedServicesForInvoice = new SelectionModel<BillServiceList>(true, []);

    messageError = "";

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private sharedServices: SharedServices,
        private contractService: ContractService,
        private dialogService: DialogService,
        private adminService: AdminService,
        private providerNphiesSearchService: ProviderNphiesSearchService,
        private sharedBilling: SharedBillingService
    ) { }

    length = 100;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [10, 50, 100];
    showFirstLastButtons = true;

    billingDetailsControllerDepartment: FormControl = new FormControl();
    billingDetailsControllerDoctor: FormControl = new FormControl();
    billingDetailsControllerPatient: FormControl = new FormControl();

    param: BillSearchModel = new BillSearchModel();

    addMode: boolean = false;
    EditMode: boolean = false;
    generateInvoice: boolean = false;

    ngOnInit() {



        this.param.billId = this.activatedRoute.snapshot.paramMap.get("billId")
        var url = this.router.url;

        //console.log("Contract Id= "+this.param.contractId);

        if (url.endsWith('add') || this.param.billId == null) {
            this.addMode = true;
            this.getDepartmentList();
            this.getDoctorList();
            this.getBeneList();
        }
        else if (url.includes('generate-bill-invoice')) {
            this.generateInvoice = true;
            this.getDepartmentList();
            this.getDoctorList();
            this.getBeneList();
            this.selectedServicesForInvoice = this.sharedBilling.getInvoiceServices;
            this.calculateTableAmounts(this.selectedServicesForInvoice);
            alert('generate-bill-invoice ');
        }
        else if (url.includes('edit')) {
            this.getBillDetails(this.param)
            this.EditMode = true;
            this.getDepartmentList();
            this.getDoctorList();
            this.getBeneList();
        }
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
                if (this.serviceListModel.find(x => x.serviceId === result[0].serviceId)) {
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
                    this.serviceListModel.push(result[0]);
                    if (this.addMode || this.EditMode) {
                        this.calculateTableAmounts(this.serviceListModel);
                    } else {
                        this.calculateTableAmounts(this.selectedServicesForInvoice);
                    }

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


    calculateTableAmounts(model) {

        this.tableGrossAmount = 0;
        this.tableDiscountAmount = 0;
        this.tableInsShareAmount = 0;
        this.tablePatientShareAmount = 0;
        this.tableNetAmount = 0;

        model.forEach(element => {
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

    calculateAllPrices(e, serviceId, model) {

        for (let service of model) {
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
        if (this.addMode || this.EditMode) {
            this.calculateTableAmounts(this.serviceListModel);
        } else {
            this.calculateTableAmounts(this.selectedServicesForInvoice);
        }
        //this.calculateTableAmounts();

    }

    calculatePercentage(obtained, total) {
        //Number.parseFloat(discount.toPrecision(discount.toFixed().length + 2))
        const intermediatePercentage = obtained / 100 * total;
        return Number.parseFloat(intermediatePercentage.toPrecision(intermediatePercentage.toFixed().length + 2));
    }


    createOrUpdateBill() {

        if (this.param.billId != null) {
            this.updateBillNo = Number(this.param.billId);

        }
        this.billTemplate = new BillTemplate();

        this.billTemplate.billDate = new Date();
        this.billTemplate.grossAmount = this.tableGrossAmount;
        this.billTemplate.netAmount = this.tableNetAmount;
        this.billTemplate.isInvoiced = 'N';
        this.billTemplate.discountAmount = this.tableDiscountAmount;
        this.billTemplate.additionalDiscount = 0;
        this.billTemplate.additionalDiscountPercent = 0;


        this.billTemplate.billServices = this.serviceListModel.filter(function (obj) {
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
            //discountTypeController: 'aaa0',
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

        this.billTemplate.departmentNo = this.billingDetailsControllerDepartment.value;
        this.billTemplate.patientId = this.billingDetailsControllerPatient.value;
        this.billTemplate.doctorId = this.billingDetailsControllerDoctor.value;

        if (this.updateBillNo != null) {
            this.billTemplate.billNo = this.updateBillNo;

            console.log("Inside his.updateBillNo != null ");

            this.contractService.updateBill(this.billTemplate).subscribe(event => {
                if (event instanceof HttpResponse) {
                    console.log(event.body);
                    if (event.body != null) {
                        this.dialogService.openMessageDialog({
                            title: '',
                            message: `Bill Updated successfully`,
                            isError: false
                        }).subscribe(event => { window.location.reload(); });
                        this.sharedServices.loadingChanged.next(false);
                    }
                }
            }
                , err => {

                    if (err instanceof HttpErrorResponse) {
                        if (err.status == 500) {
                            this.messageError = "could not reach server for Update Please try again later "

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
        } else {
            console.log("Inside his.updateBillNo != null else");

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

    getBillDetails(param: BillSearchModel) {
        this.contractService.getBillDetailsByBillId(this.param.billId).subscribe(event => {
            if (event instanceof HttpResponse) {
                const body = event.body;
                if (event.body != null) {
                    this.fillEditData(body);
                }
            }
        }, errorEvent => {
            if (errorEvent instanceof HttpErrorResponse) {

            }
        });
    }

    fillEditData(result) {

        this.serviceListModel = result.billServiceList.map(serv => ({
            serviceId: serv.serviceId,
            isActiveServiceList: serv.isActiveServiceList,
            quantity: serv.quantity,
            cashAmount: serv.cashAmount,
            grossAmount: serv.grossAmount,
            departmentId: serv.departmentId,
            serviceName: serv.serviceName,
            providerId: serv.providerId,
            serviceCode: serv.serviceCode,
            insServiceCode: serv.insServiceCode,
            insServiceName: serv.insServiceName,
            insDiscountAmount: serv.insDiscountAmount,
            insDiscountType: serv.insDiscountType,
            deptDepartmentName: serv.deptDepartmentName,
            deptDiscountType: serv.deptDiscountType,
            deptDiscountAmount: serv.deptDiscountAmount,
            patientShare: serv.patientShare,
            shareType: serv.shareType,
            serviceDiscountAmount: serv.serviceDiscountAmount,
            patientShareAmount: serv.patientShareAmount,
            insShareAmount: serv.insShareAmount,
            netShareAmount: serv.netShareAmount,

        }));
        if (this.addMode || this.EditMode) {
            this.calculateTableAmounts(this.serviceListModel);
        } else {
            this.calculateTableAmounts(this.selectedServicesForInvoice);
        }
        //this.calculateTableAmounts();
        console.log("Do you work ?");
    }

    deleteServiceFromBill(index: number) {
        this.serviceListModel.splice(index, 1);
        if (this.addMode || this.EditMode) {
            this.calculateTableAmounts(this.serviceListModel);
        } else {
            this.calculateTableAmounts(this.selectedServicesForInvoice);
        }
        //this.calculateTableAmounts();
    }

    selectService(e, i: number, sev) {

        console.log("Reached Method selectService");

        console.log("index " + index);

        if (e.checked) {
            this.selectedServicesForInvoice.push(sev);
        } else {
            for (var index in this.selectedServicesForInvoice) {
                console.log(index); // prints indexes: 0, 1, 2, 

                if (this.selectedServicesForInvoice[index].serviceId === sev.serviceId) {
                    this.selectedServicesForInvoice.splice(parseInt(index), 1);
                }
            }
        }
        console.log("Exit Method selectService");
        this.sharedBilling.setInvoiceServices = this.selectedServicesForInvoice;
    }



}
