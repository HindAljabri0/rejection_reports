import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import {
    FieldError,
    getInvoicesErrors,
    getSelectedPayer,
    getDepartmentCode,
    getVisitDate,
    getSelectedTab,
    getDepartments,
    ClaimPageMode,
    getPageMode,
    getClaim,
    getRetrievedClaimProps
} from '../store/claim.reducer';
import { Store } from '@ngrx/store';
import {
    updateInvoices_Services,
    selectGDPN,
    saveInvoices_Services,
    openSelectServiceDialog,
    addRetrievedServices,
    makeRetrievedServiceUnused
} from '../store/claim.actions';
import { FormControl, FormArray } from '@angular/forms';
import { Service, PbmServiceError } from '../models/service.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AdminService } from 'src/app/services/adminService/admin.service';
import { SharedServices } from 'src/app/services/shared.services';
import { Actions, ofType } from '@ngrx/effects';
import { DatePipe } from '@angular/common';
import { ServiceDecision } from '../models/serviceDecision.model';
import { map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Claim } from '../models/claim.model';
import { RetrievedClaimProps } from '../models/retrievedClaimProps.model';
import { ClaimStatus } from 'src/app/models/claimStatus';
import { parse } from 'querystring';
import { Subject } from 'rxjs';
import { log } from 'console';

@Component({
    selector: 'claim-invoices-services',
    templateUrl: './invoices-services.component.html',
    styles: []
})
export class InvoicesServicesComponent implements OnInit, OnDestroy {

    isRetrievedClaim = false;

    claimGDPNNeedsRecalculation = false;
    controllers: {
        invoice: Invoice,
        invoiceNumber: FormControl,
        invoiceDate: FormControl,
        invoiceDepartment: FormControl,
        needsRecalculation: boolean,
        services: {
            retrieved: boolean,
            statusCode?: string,
            statusDescription?: string,
            acutalDeductedAmount?: number,
            acutalPaidVatAmount?: number,
            serviceNumber: number,
            serviceId?: number,
            serviceDate: FormControl,
            serviceCode: FormControl,
            serviceDescription: FormControl,
            unitPrice: FormControl,
            quantity: FormControl,
            patientShare: FormControl,
            serviceDiscount: FormControl,
            serviceDiscountUnit: String;
            toothNumber: FormControl,
            netVatRate: FormControl,
            netVatAmount: number;
            patientShareVatRate: FormControl,
            patientShareVatAmount: number,
            priceCorrection: number,
            rejection: number,
            isOpen: boolean,
            serviceType: FormControl,
            daysOfSupply: FormControl,
            pbmServiceError: PbmServiceError[],
            pbmServiceStatus: string,
            gross: number,
            net: number
        }[]
    }[] = [];
    expandedInvoice = -1;
    expandedService = -1;

    priceListExist = true;
    servicesOptions: string[] = [];
    emptyOptions = false;
    serviceCodeSearchError;
    searchServicesController: FormControl = new FormControl();
    payerId: string;
    currencyCode = "SAR";
    claimType: string;
    visitDate: Date;
    departments: any[] = [];

    dentalDepartmentCode: string;
    opticalDepartmentCode: string;

    errors: FieldError[] = [];

    pageMode: ClaimPageMode;

    allServiceTypes = [
        { key: 'N/A', value: 'N/A' },
        { key: 'LABORATORY', value: 'LABORATORY' },
        { key: 'MEDICATION', value: 'MEDICATION' },
        { key: 'CONSULTATION', value: 'CONSULTATION' },
        { key: 'PROCEDURE', value: 'PROCEDURE' },
        { key: 'HOSPITLIZATION', value: 'HOSPITLIZATION' },
        { key: 'DENTAL', value: 'DENTAL' },
        { key: 'SUPPLY', value: 'SUPPLY' },
        { key: 'RADIOLOGY', value: 'RADIOLOGY' },
    ];
    claimProps: RetrievedClaimProps;
    isPBMValidationVisible = false;
    selectedInvoiceIndex: any;
    serviceTypeParIndex: any;
    serviceTypeChildIndex: any;

    invoicesPaginationControl: { page: number, size: number } = { page: 0, size: 10 };
    departmentCode = '';
    constructor(
        private store: Store,
        private actions: Actions,
        private adminService: AdminService,
        private sharedServices: SharedServices,
        private datePipe: DatePipe) { }

    _onDestroy = new Subject<void>();

    ngOnInit() {
        this.currencyCode = localStorage.getItem('currencyCode') != null && localStorage.getItem('currencyCode') != undefined ? localStorage.getItem('currencyCode') : "SAR";
        this.store.select(getPageMode).pipe(
            takeUntil(this._onDestroy),
            withLatestFrom(this.store.select(getClaim)),
            withLatestFrom(this.store.select(getRetrievedClaimProps)),
            map(values => ({ mode: values[0][0], claim: values[0][1], claimProps: values[1] }))
        ).subscribe(({ mode, claim, claimProps }) => {
            this.departmentCode = claim.visitInformation.departmentCode;
            this.pageMode = mode;
            if (mode == 'VIEW') {
                this.setData(claim, claimProps);
                this.toggleEdit(false);
            } else if (mode == 'EDIT') {
                this.setData(claim, claimProps);
                this.toggleEdit(true);
            }
            this.claimProps = claimProps;
            this.getPBMValidation();
        });
        this.store.select(getInvoicesErrors).pipe(takeUntil(this._onDestroy)).subscribe(errors => this.errors = errors || []);
        this.store.select(getDepartments)
            .pipe(takeUntil(this._onDestroy))
            .subscribe(departments => {
                if (departments != null && departments.length > 0) {
                    this.dentalDepartmentCode = departments.find(department => department.name == 'Dental').departmentId + '';
                    this.opticalDepartmentCode = departments.find(department => department.name == 'Optical').departmentId + '';
                }
                this.departments = departments;
                this.store.select(getClaim).pipe(takeUntil(this._onDestroy)).subscribe(claim => {
                    claim.invoice.map((invoice, index) => {
                        this.controllers[index].invoiceDepartment.setValue(invoice.invoiceDepartment);
                    });
                });

                if (this.controllers.length == 0) {
                    this.addInvoice();
                }
            });
        this.store.select(getDepartmentCode).pipe(takeUntil(this._onDestroy)).subscribe(type => this.claimType = type);
        this.store.select(getVisitDate).pipe(takeUntil(this._onDestroy)).subscribe(date => this.visitDate = date);
        this.store.select(getSelectedPayer).pipe(takeUntil(this._onDestroy)).subscribe(payerId => {
            this.payerId = payerId;
            this.priceListExist = true;
            this.searchServicesController.setValue('');
        });

        if (this.pageMode == 'CREATE' || this.pageMode == 'CREATE_FROM_RETRIEVED') {
            this.expandedInvoice = 0;
            this.expandedService = 0;
        }

        this.store.select(getSelectedTab).pipe(takeUntil(this._onDestroy)).subscribe(tab => {
            if (tab == 'INVOICES_SERVICES') {
                this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
            } else {
                this.store.dispatch(selectGDPN({}));
            }
        });

        this.actions.pipe(
            takeUntil(this._onDestroy),
            ofType(saveInvoices_Services)
        ).subscribe(() => {
            for (let i = 0; i < this.controllers.length; i++) {
                this.createInvoiceFromControl(i);
            }
        });

        this.actions.pipe(takeUntil(this._onDestroy), ofType(addRetrievedServices)).subscribe(data => {
            if (data.serviceIndex != null) {
                const service = data.services[0].service;
                const decision = data.services[0].decision;
                this.editService(service, decision, data.invoiceIndex, data.serviceIndex);
            } else {
                data.services.forEach(s => {
                    this.addService(data.invoiceIndex);
                    this.editService(s.service, s.decision, data.invoiceIndex, this.controllers[data.invoiceIndex].services.length - 1);
                });
            }
        });
    }
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }
    invoiceHasDuplicateService(invoice: Invoice) {
        let invoicesHasDuplicateService = this.errors.filter(x => Number(x.code) == invoice.invoiceId && x.error.includes('We found duplicate services in Invoice'));
        return invoicesHasDuplicateService.length > 0 ? 'Duplicate services in Invoice' : false
    }
    ListDuplicateService: Number[] = [];
    invoiceHasError(invoice: Invoice) {
        //  console.log("DepartmentCode For cliam " +  this.departmentCode);
        let check = 0;
        let invoicesError = this.errors.filter(x => Number(x.code) == invoice.invoiceId);
        if (invoicesError.length > 0) {
            let invoiceshasuplicate = this.errors.filter(x => Number(x.code) == invoice.invoiceId && x.error.includes('We found duplicate services in Invoice'));
            if (invoiceshasuplicate.length > 0) {

                for (var i = 0; i < invoice.service.length; i++) {
                    for (var j = i + 1; j < invoice.service.length; j++) {

                        if (this.departmentCode.includes('4')) {
                            if (invoice.service[i].serviceCode + invoice.service[i].toothNumber == invoice.service[j].serviceCode + invoice.service[j].toothNumber) {

                                this.ListDuplicateService.push(invoice.service[i].serviceId);
                                this.ListDuplicateService.push(invoice.service[j].serviceId);
                            }
                        }
                        else {
                            if (invoice.service[i].serviceCode == invoice.service[j].serviceCode) {

                                this.ListDuplicateService.push(invoice.service[i].serviceId);
                                this.ListDuplicateService.push(invoice.service[j].serviceId);
                            }
                        }
                    }
                }

            }
            check++;
            return true
        } else {
            this.errors.forEach(x => {
                var serviceId = Number(x.code.replace(/\D+/g, ''))
                for (let service of invoice.service) {

                    if (service.serviceId == serviceId) {
                        check++;
                        return true;
                    }
                }
            })
        }
        return check == 1 ? true : false
    }

    serviceHasError(service) {
        let iaHasError = false;
        this.errors.forEach(x => {
            var serviceId = Number(x.code.replace(/\D+/g, ''))
            if (service.serviceId == serviceId) {

                iaHasError = true;
            }


        });

        if (this.ListDuplicateService.includes(service.serviceId)) {
            iaHasError = true
        }

        return iaHasError;
    }

    invoice: Invoice[] = [];
    setData(claim: Claim, claimProps: RetrievedClaimProps) {
        this.invoice = [];
        this.controllers = [];
        this.store.select(getInvoicesErrors).pipe(takeUntil(this._onDestroy)).subscribe(errors => this.errors = errors || []);

        this.invoice = claim.invoice.slice().sort((inv1, inv2) => {

            if (this.invoiceHasError(inv2) && !this.invoiceHasError(inv1)) {
                return 1;
            } else if (!this.invoiceHasError(inv2) && this.invoiceHasError(inv1)) {
                return -1;
            } else {
                return 0;
            }
        });

        this.invoice.forEach(invoice => {
            this.addInvoice(false);
            const index = this.controllers.length - 1;
            this.controllers[index].invoice = invoice;
            this.controllers[index].invoiceDate.setValue(this.datePipe.transform(invoice.invoiceDate, 'yyyy-MM-dd'));
            this.controllers[index].invoiceNumber.setValue(invoice.invoiceNumber);
            this.controllers[index].invoiceDepartment.setValue(invoice.invoiceDepartment);
            console.log(invoice.invoiceDepartment);
            invoice.service.forEach(service => {
                this.addService(index, false);
                const serviceIndex = this.controllers[index].services.length - 1;
                if (service.hasOwnProperty('serviceDecision') && service['serviceDecision'] != null) {
                    const decision = service['serviceDecision'];
                    this.controllers[index].services[serviceIndex].statusCode = decision.serviceStatusCode;
                    this.controllers[index].services[serviceIndex].statusDescription = decision.decisioncomment;
                    this.controllers[index].services[serviceIndex].acutalDeductedAmount =
                        (decision.gdpn.rejection != null ? decision.gdpn.rejection.value : 0);
                    this.controllers[index].services[serviceIndex].acutalPaidVatAmount =
                        (decision.gdpn.netVATamount != null ? decision.gdpn.netVATamount.value : 0);

                }
                this.controllers[index].services[serviceIndex].serviceNumber = service.serviceNumber;
                this.controllers[index].services[serviceIndex].serviceId = service.serviceId;
                this.controllers[index].services[serviceIndex].serviceDate.setValue(this.datePipe.transform(service.serviceDate, 'yyyy-MM-dd'));
                this.controllers[index].services[serviceIndex].serviceCode.setValue(service.serviceCode);
                this.controllers[index].services[serviceIndex].serviceDescription.setValue(service.serviceDescription);
                this.controllers[index].services[serviceIndex].serviceType.setValue(service.serviceType);
                this.controllers[index].services[serviceIndex].daysOfSupply.setValue(service.daysOfSupply === null ? 0 : service.daysOfSupply);
                this.controllers[index].services[serviceIndex].pbmServiceError = service.pbmServiceError;
                this.controllers[index].services[serviceIndex].pbmServiceStatus = service.pbmServiceStatus;
                this.controllers[index].services[serviceIndex].quantity.setValue(service.requestedQuantity);
                if (service.unitPrice != null) {
                    this.controllers[index].services[serviceIndex].unitPrice.setValue(service.unitPrice.value);
                }

                if (service.serviceGDPN.discount != null) {
                    this.controllers[index].services[serviceIndex].serviceDiscount.setValue(service.serviceGDPN.discount.value);
                }
                this.controllers[index].services[serviceIndex].serviceDiscountUnit =
                    (service.serviceGDPN.discount != null && service.serviceGDPN.discount.type == 'PERCENT') ? 'PERCENT' : this.currencyCode;

                if (service.serviceGDPN.netVATrate != null) {
                    this.controllers[index].services[serviceIndex].netVatRate.setValue(service.serviceGDPN.netVATrate.value);
                } else if (service.serviceGDPN.netVATamount != null) {
                    this.controllers[index].services[serviceIndex].netVatRate.setValue(
                        this.toTwoDecimalPoints(service.serviceGDPN.netVATamount.value / service.serviceGDPN.net.value * 100)
                    );
                } else {
                    this.controllers[index].services[serviceIndex].netVatRate.setValue('');
                }
                if (service.serviceGDPN.netVATamount != null) {
                    this.controllers[index].services[serviceIndex].netVatAmount = service.serviceGDPN.netVATamount.value;
                }

                if (service.serviceGDPN.patientShare != null) {
                    this.controllers[index].services[serviceIndex].patientShare.setValue(service.serviceGDPN.patientShare.value);
                } else {
                    service = { ...service, serviceGDPN: { ...service.serviceGDPN, patientShare: { value: 0, type: this.currencyCode } } };
                    this.controllers[index].services[serviceIndex].patientShare.setValue('');
                }

                if (service.serviceGDPN.patientShareVATrate != null) {
                    this.controllers[index].services[serviceIndex].patientShareVatRate.setValue(service.serviceGDPN.patientShareVATrate.value);
                } else if (service.serviceGDPN.patientShareVATamount != null &&
                    service.serviceGDPN.patientShare != null &&
                    service.serviceGDPN.patientShare.value > 0) {
                    this.controllers[index].services[serviceIndex].patientShareVatRate.setValue(
                        this.toTwoDecimalPoints(service.serviceGDPN.patientShareVATamount.value / service.serviceGDPN.patientShare.value * 100)
                    );
                } else {
                    this.controllers[index].services[serviceIndex].patientShareVatRate.setValue('');
                }
                if (service.serviceGDPN.patientShareVATamount != null) {
                    this.controllers[index].services[serviceIndex].patientShareVatAmount = service.serviceGDPN.patientShareVATamount.value;
                }

                if (service.serviceGDPN.net != null) {
                    this.controllers[index].services[serviceIndex].net = service.serviceGDPN.net.value;
                }

                if (service.serviceGDPN.gross != null) {
                    this.controllers[index].services[serviceIndex].gross = service.serviceGDPN.gross.value;
                }

                if (service.serviceGDPN.priceCorrection != null) {
                    this.controllers[index].services[serviceIndex].priceCorrection = service.serviceGDPN.priceCorrection.value;
                } else {
                    this.controllers[index].services[serviceIndex].priceCorrection = null;
                }
                if (service.serviceGDPN.rejection != null) {
                    this.controllers[index].services[serviceIndex].rejection = service.serviceGDPN.rejection.value;
                } else {
                    this.controllers[index].services[serviceIndex].rejection = null;
                }
                this.controllers[index].services[serviceIndex].toothNumber.setValue(service.toothNumber);
            });
        });
        if (this.controllers.length > 0 && this.expandedInvoice == -1) {
            this.toggleInvoice(0);
        }
    }

    toggleEdit(allowEdit: boolean, enableForNulls?: boolean) {
        this.controllers.forEach(invoiceControllers => {
            if (this.pageMode === 'EDIT') {
                invoiceControllers.invoiceDate.enable();
                invoiceControllers.invoiceNumber.enable();
                invoiceControllers.invoiceDepartment.enable();
            } else {
                invoiceControllers.invoiceDate.disable();
                invoiceControllers.invoiceNumber.disable();
                invoiceControllers.invoiceDepartment.disable();
            }
            invoiceControllers.services.forEach(servicesControllers => {
                if (allowEdit) {
                    servicesControllers.netVatRate.enable();
                    servicesControllers.patientShare.enable();
                    servicesControllers.patientShareVatRate.enable();
                    servicesControllers.quantity.enable();
                    servicesControllers.serviceCode.enable();
                    servicesControllers.serviceDate.enable();
                    servicesControllers.serviceDescription.enable();
                    servicesControllers.serviceType.enable();
                    servicesControllers.daysOfSupply.enable();
                    servicesControllers.serviceDiscount.enable();
                    servicesControllers.toothNumber.enable();
                    servicesControllers.unitPrice.enable();
                } else {
                    servicesControllers.netVatRate.disable();
                    servicesControllers.patientShare.disable();
                    servicesControllers.patientShareVatRate.disable();
                    servicesControllers.quantity.disable();
                    servicesControllers.serviceCode.disable();
                    servicesControllers.serviceDate.disable();
                    servicesControllers.serviceDescription.disable();
                    servicesControllers.serviceType.disable();
                    servicesControllers.daysOfSupply.disable();
                    servicesControllers.serviceDiscount.disable();
                    servicesControllers.toothNumber.disable();
                    servicesControllers.unitPrice.disable();
                }

                if (enableForNulls) {
                    if (this.isControlNull(servicesControllers.netVatRate)) {
                        servicesControllers.netVatRate.enable();
                    }
                    if (this.isControlNull(servicesControllers.patientShare)) {
                        servicesControllers.patientShare.enable();
                    }
                    if (this.isControlNull(servicesControllers.patientShareVatRate)) {
                        servicesControllers.patientShareVatRate.enable();
                    }
                    if (this.isControlNull(servicesControllers.quantity)) {
                        servicesControllers.quantity.enable();
                    }
                    if (this.isControlNull(servicesControllers.serviceCode)) {
                        servicesControllers.serviceCode.enable();
                    }
                    if (this.isControlNull(servicesControllers.serviceDate)) {
                        servicesControllers.serviceDate.enable();
                    }
                    if (this.isControlNull(servicesControllers.serviceDescription)) {
                        servicesControllers.serviceDescription.enable();
                    }
                    if (this.isControlNull(servicesControllers.serviceType)) {
                        servicesControllers.serviceType.enable();
                    }
                    if (this.isControlNull(servicesControllers.serviceDiscount)) {
                        servicesControllers.serviceDiscount.enable();
                    }
                    if (this.isControlNull(servicesControllers.toothNumber)) {
                        servicesControllers.toothNumber.enable();
                    }
                    if (this.isControlNull(servicesControllers.unitPrice)) {
                        servicesControllers.unitPrice.enable();
                    }
                    if (this.isControlNull(servicesControllers.daysOfSupply)) {
                        servicesControllers.daysOfSupply.enable();
                    }
                }
            });
        });
    }

    addInvoice(withService?: boolean) {
        this.controllers.push({
            invoice: new Invoice(), invoiceDate: new FormControl(), invoiceNumber: new FormControl(),
            services: [], invoiceDepartment: new FormControl(), needsRecalculation: false
        });
        if (this.departments.length > 0) {
            this.controllers[this.controllers.length - 1].invoice.invoiceDepartment = `${this.departments[0].departmentId}`;
        }
        if (withService == null || withService) {
            this.addService(this.controllers.length - 1);
        }
        this.claimGDPNNeedsRecalculation = true;
    }

    addService(invoiceIndex, updateClaim?: boolean) {
        this.controllers[invoiceIndex].services.push({
            retrieved: false,
            serviceNumber: null,
            serviceDate: new FormControl(),
            serviceCode: new FormControl(),
            serviceDescription: new FormControl(),
            unitPrice: new FormControl(0),
            quantity: new FormControl(0),
            patientShare: new FormControl(0),
            serviceDiscount: new FormControl(0),
            serviceDiscountUnit: 'PERCENT',
            toothNumber: new FormControl(),
            netVatRate: new FormControl(0),
            netVatAmount: 0,
            patientShareVatRate: new FormControl(0),
            patientShareVatAmount: 0,
            priceCorrection: 0,
            rejection: 0,
            isOpen: false,
            serviceType: new FormControl(),
            statusCode: '',
            acutalDeductedAmount: 0,
            daysOfSupply: new FormControl(0),
            pbmServiceError: [],
            pbmServiceStatus: '',
            net: 0,
            gross: 0
        });
        this.controllers[invoiceIndex].needsRecalculation = true;
        if (updateClaim == null || updateClaim) {
            this.updateClaim();
        }
    }

    editService(service: Service, decision: ServiceDecision, i: number, j: number) {
        this.controllers[i].services[j].retrieved = true;
        this.controllers[i].services[j].serviceNumber = service.serviceNumber;
        this.controllers[i].services[j].serviceId = service.serviceId;
        this.controllers[i].services[j].serviceDate.setValue(this.datePipe.transform(service.serviceDate, 'yyyy-MM-dd'));
        this.controllers[i].services[j].serviceDate.disable();
        this.controllers[i].services[j].serviceCode.setValue(service.serviceCode);
        this.controllers[i].services[j].serviceCode.disable();
        this.controllers[i].services[j].serviceDescription.setValue(service.serviceDescription);
        this.controllers[i].services[j].serviceDescription.disable();
        this.controllers[i].services[j].serviceType.setValue(service.serviceType);
        this.controllers[i].services[j].serviceType.disable();
        this.controllers[i].services[j].unitPrice.setValue(service.unitPrice.value);
        this.controllers[i].services[j].unitPrice.disable();
        this.controllers[i].services[j].quantity.setValue(decision.approvedQuantity);
        this.controllers[i].services[j].quantity.disable();
        this.controllers[i].services[j].patientShare.setValue(service.serviceGDPN.patientShare.value);
        this.controllers[i].services[j].serviceDiscount.setValue(service.serviceGDPN.discount.value);
        this.controllers[i].services[j].serviceDiscountUnit = (service.serviceGDPN.discount != null
            && service.serviceGDPN.discount.type == 'PERCENT') ? 'PERCENT' : this.currencyCode;
        this.controllers[i].services[j].toothNumber.setValue(service.toothNumber);
        this.controllers[i].services[j].daysOfSupply.setValue(service.daysOfSupply);
        this.controllers[i].services[j].daysOfSupply.disable();
        this.controllers[i].services[j].pbmServiceError = service.pbmServiceError;
        this.controllers[i].services[j].pbmServiceStatus = service.pbmServiceStatus;
        if (service.toothNumber != null) {
            this.controllers[i].services[j].toothNumber.disable();
        }
        this.controllers[i].services[j].netVatRate.setValue(service.serviceGDPN.netVATrate.value);
        this.controllers[i].services[j].patientShareVatRate.setValue(service.serviceGDPN.patientShareVATrate.value);
        this.controllers[i].services[j].priceCorrection = decision.serviceGDPN.priceCorrection.value;
        this.controllers[i].services[j].rejection = decision.serviceGDPN.rejection.value;
        this.createInvoiceFromControl(i);
    }

    toggleInvoice(i: number) {
        if (this.expandedInvoice == -1) {
            this.expandedInvoice = i;
            this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
        } else if (this.expandedInvoice == i) {
            this.expandedInvoice = -1;
            this.expandedService = -1;
            this.createInvoiceFromControl(i);
            this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
        } else {
            this.expandedInvoice = i;
            this.createInvoiceFromControl(i);
            this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
        }

        if (this.selectedInvoiceIndex !== undefined && this.selectedInvoiceIndex < this.controllers.length) {
            this.createInvoiceFromControl(this.selectedInvoiceIndex);
        }

        this.selectedInvoiceIndex = i;
    }

    toggleServiceExpansion(event, i, j) {
        event.stopPropagation();
        if (this.controllers[i].services[j].isOpen) {
            this.expandedService = -1;
            this.controllers[i].services[j].isOpen = false;
        } else {
            this.controllers[i].services.forEach(element => {
                element.isOpen = false;
            });
            this.controllers[i].services[j].isOpen = true;
            this.expandedService = j;
        }
        this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
    }

    fieldHasError(fieldName, code) {
        return this.errors.findIndex(error => error.fieldName == fieldName && error.code == code) != -1;
    }

    getFieldError(fieldName, code) {
        const index = this.errors.findIndex(error => error.fieldName == fieldName && error.code == code);
        if (index > -1) {
            return this.errors[index].error || '';
        }
        return '';
    }


    createInvoiceFromControl(i: number) {
        const invoice: Invoice = new Invoice();

        if (this.controllers[i].invoice != null) {

            invoice.invoiceId = this.controllers[i].invoice.invoiceId;
        }
        invoice.invoiceNumber = this.controllers[i].invoiceNumber.value;
        invoice.invoiceDate = this.controllers[i].invoiceDate.value == null ? null : new Date(this.controllers[i].invoiceDate.value);
        invoice.invoiceDepartment = this.controllers[i].invoice.invoiceDepartment;

        invoice.service = this.controllers[i].services.map((service) => this.createServiceFromControl(service));
        if (this.controllers[i].needsRecalculation) {
            const GDPN = invoice.invoiceGDPN;
            GDPN.discount.value = invoice.service.map(service => {
                if (service.serviceGDPN.discount != null && service.serviceGDPN.discount.type == 'PERCENT') {
                    let discount =
                        (service.serviceGDPN.gross.value * (service.serviceGDPN.discount.value / 100));
                    discount = Number.parseFloat(discount.toPrecision(discount.toFixed().length + 2));
                    return discount;
                } else if (service.serviceGDPN.discount != null) {
                    return service.serviceGDPN.discount.value;
                } else {
                    return 0;
                }
            }).reduce((pre, cur) => pre + cur);
            GDPN.discount.type = this.currencyCode;
            GDPN.gross.value = invoice.service.map(service => service.serviceGDPN.gross.value).reduce((pre, cur) => pre + cur);
            GDPN.net.value = invoice.service.map(service => service.serviceGDPN.net.value).reduce((pre, cur) => pre + cur);
            GDPN.netVATamount.value = invoice.service.map(service => service.serviceGDPN.netVATamount.value).reduce((pre, cur) => pre + cur);
            GDPN.netVATrate.value = invoice.service.map(service => service.serviceGDPN.netVATrate.value).reduce((pre, cur) => pre + cur);
            GDPN.patientShare.value = invoice.service.map(service => service.serviceGDPN.patientShare.value).reduce((pre, cur) => pre + cur);
            GDPN.patientShareVATamount.value = invoice.service.map(
                service => service.serviceGDPN.patientShareVATamount.value).reduce((pre, cur) => pre + cur
                );
            GDPN.patientShareVATrate.value = invoice.service.map(
                service => service.serviceGDPN.patientShareVATrate.value).reduce((pre, cur) => pre + cur
                );
        } else {
            invoice.invoiceGDPN = this.controllers[i].invoice.invoiceGDPN;
        }
        this.controllers[i].invoice = invoice;
        this.updateClaim();
    }

    createServiceFromControl(service) {
        const gross = this.calcGross(service);
        const net = this.calcNet(service, gross);
        const netVat = this.calcNetVat(service, net);
        const patientShareVATamount = this.calcPatientVatRate(service);
        const newService: Service = {

            serviceId: service.serviceId,

            serviceNumber: service.serviceNumber,
            serviceType: service.serviceType.value,
            serviceDate: service.serviceDate.value == null ? null : new Date(service.serviceDate.value),
            serviceCode: service.serviceCode.value,
            serviceDescription: service.serviceDescription.value,
            unitPrice: { value: service.unitPrice.value, type: this.currencyCode },
            requestedQuantity: service.quantity.value,
            toothNumber: service.toothNumber.value,
            daysOfSupply: service.daysOfSupply.value,
            serviceGDPN: {
                patientShare: { value: this.getAsNumber(service.patientShare.value), type: this.currencyCode },
                discount: { value: this.getAsNumber(service.serviceDiscount.value), type: this.currencyCode },
                netVATrate: { value: this.getAsNumber(service.netVatRate.value), type: 'PERCENT' },
                patientShareVATrate: { value: this.getAsNumber(service.patientShareVatRate.value), type: 'PERCENT' },
                gross: { value: this.getAsNumber(gross), type: this.currencyCode },
                net: { value: this.getAsNumber(net), type: this.currencyCode },
                netVATamount: { value: this.getAsNumber(netVat), type:this.currencyCode },
                patientShareVATamount: { value: this.getAsNumber(patientShareVATamount), type:this.currencyCode },

            },
        };
        console.log("Service Data"+JSON.stringify(newService));
        return newService;
    }

    getAsNumber(value): number {
        try {
            value = Number.parseFloat(value);
        } catch (e) {
            value = 0;
        }
        return value;
    }

    calcGross(service) {
        if (service.gross != null) {
            return service.gross;
        }
        let gross = service.unitPrice.value * service.quantity.value;
        gross = Number.parseFloat(gross.toPrecision(gross.toFixed().length + 2));
        return gross;
    }

    calcNet(service, gross?) {
        if (service.net != null) {
            return service.net;
        }
        if (gross == null) {
            gross = this.calcGross(service);
        }
        let net = gross;
        if (service.serviceDiscountUnit == 'PERCENT') {
            net -= (net * (service.serviceDiscount.value / 100));
        } else {
            net -= service.serviceDiscount.value;
        }
        net -= service.patientShare.value;
        net += service.priceCorrection;
        net -= service.rejection;
        net = Number.parseFloat(net.toPrecision(net.toFixed().length + 2));
        return net;
    }

    calcNetVat(service, net?) {
        if (net == null) {
            net = this.calcNet(service);
        }
        if (service.netVatAmount != null) {
            return service.netVatAmount;
        }
        let netVat = (net * (service.netVatRate.value / 100));
        netVat = Number.parseFloat(netVat.toPrecision(netVat.toFixed().length + 2));
        return netVat;
    }

    calcDiscountValue(service) {
        if (service.serviceDiscountUnit != 'PERCENT') {
            return service.serviceDiscount.value;
        } else {
            const gross = this.calcGross(service);
            if (gross != null && service.serviceDiscount.value != null) {
                return this.calcGross(service) * service.serviceDiscount.value / 100
            }
        }
        return 0;
    }

    calcPatientVatRate(service) {
        if (service.patientShareVatAmount != null) {
            return service.patientShareVatAmount;
        }
        let patientShareVATamount = (service.patientShare.value * (service.patientShareVatRate.value / 100));
        patientShareVATamount = Number.parseFloat(patientShareVATamount.toPrecision(patientShareVATamount.toFixed().length + 2));
        return patientShareVATamount;
    }

    updateInvoiceDepartment(i, event) {
        this.controllers[i].invoice = { ...this.controllers[i].invoice, invoiceDepartment: event.value };
    }

    updateServiceToothNumber(i, j, event) {
        this.controllers[i].services[j].toothNumber.setValue(event.target.value);

    }

    updateClaim() {
        if (this.pageMode == 'VIEW') {
            return;
        }
        this.emptyOptions = false;
        this.serviceCodeSearchError = null;
        this.store.dispatch(updateInvoices_Services({ invoices: this.controllers.map(control => control.invoice), recalculateClaimGDPN: this.controllers.some(control => control.needsRecalculation) || this.claimGDPNNeedsRecalculation }));
        this.claimGDPNNeedsRecalculation = false;
    }

    onSelectRetrievedServiceClick(event, invoiceIndex, serviceIndex) {
        event.stopPropagation();
        event.preventDefault();
        this.createInvoiceFromControl(this.expandedInvoice);
        this.store.dispatch(openSelectServiceDialog({
            invoiceIndex,
            invoiceNumber: this.controllers[invoiceIndex].invoiceNumber.value,
            invoiceDate: this.controllers[invoiceIndex].invoiceDate.value != null ?
                new Date(this.controllers[invoiceIndex].invoiceDate.value) :
                null,
            serviceIndex,
        }));
    }

    onAddInvoiceClick() {
        this.addInvoice();
        this.expandedInvoice = this.controllers.length - 1;
        this.expandedService = 0;
        this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
    }

    onAddRetrievedServiceClick(invoiceIndex) {
        this.createInvoiceFromControl(this.expandedInvoice);
        this.store.dispatch(openSelectServiceDialog({
            invoiceIndex,
            invoiceNumber: this.controllers[invoiceIndex].invoiceNumber.value,
            invoiceDate: this.controllers[invoiceIndex].invoiceDate.value != null ?
                new Date(this.controllers[invoiceIndex].invoiceDate.value) :
                null,
            serviceIndex: -1,
        }));
    }

    onAddServiceClick(invoiceIndex) {
        this.addService(invoiceIndex);
        this.expandedService = this.controllers[invoiceIndex].services.length - 1;
        this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
    }

    onDeleteInvoiceClick(i) {
        this.controllers[i].services.forEach(s => {
            if (s.retrieved) {
                this.store.dispatch(makeRetrievedServiceUnused({ serviceNumber: s.serviceNumber }));
            }
        });
        this.controllers.splice(i, 1);
        this.claimGDPNNeedsRecalculation = true;
        this.updateClaim();
        this.emptyOptions = false;
        this.serviceCodeSearchError = null;
        this.expandedInvoice = -1;
        this.store.dispatch(selectGDPN({ invoiceIndex: this.expandedInvoice }));
    }

    onDeleteServiceClick(event, i, j) {
        event.stopPropagation();
        if (this.controllers[i].services[j].retrieved) {
            this.store.dispatch(makeRetrievedServiceUnused({ serviceNumber: this.controllers[i].services[j].serviceNumber }));
        }
        this.controllers[i].services.splice(j, 1);
        this.controllers[i].needsRecalculation = true;
        this.createInvoiceFromControl(i);
        this.emptyOptions = false;
        this.expandedService = -1;
        this.serviceCodeSearchError = null;
    }

    searchServices() {
        this.servicesOptions = [];
        this.serviceCodeSearchError = null;
        this.emptyOptions = false;
        const query: string = this.searchServicesController.value;
        const serviceType = this.controllers[this.serviceTypeParIndex].services[this.serviceTypeChildIndex].serviceType.value;
        if (query != null && query != '') {
            this.adminService.searchServiceCode(query.toUpperCase(), this.sharedServices.providerId, this.payerId, this.visitDate, serviceType).subscribe(
                event => {
                    if (event instanceof HttpResponse) {
                        if (event.body instanceof Object) {
                            // this.priceListExist = event.body['content'].length > 0;
                            this.emptyOptions = event.body['empty'];
                            this.servicesOptions = [];
                            Object.keys(event.body['content']).forEach(key => {
                                this.servicesOptions.push(
                                    `${event.body['content'][key]['code']} | ${event.body['content'][key]['description']}`.toUpperCase()
                                );
                            });
                        }
                    }
                },
                error => {
                    if (error instanceof HttpErrorResponse) {
                        this.serviceCodeSearchError = error.message;
                    }
                }
            );
        }
    }

    selectService(option: string) {
        const code = option.split('|')[0];
        const des = option.split('|')[1];
        this.controllers[this.expandedInvoice].services[this.expandedService].serviceCode.setValue(code.trim());
        this.controllers[this.expandedInvoice].services[this.expandedService].serviceDescription.setValue(des);
        this.searchServicesController.setValue('');
        this.emptyOptions = false;
        this.serviceCodeSearchError = null;
    }

    invoiceHasErrors(index) {
        return this.errors.findIndex(error => error.fieldName.split(':')[1] == index) != -1;
    }

    serviceHasErrors(invoiceIndex, serviceIndex) {
        return this.errors.findIndex(error => error.fieldName.includes(`:${invoiceIndex}:${serviceIndex}`)) != -1;
    }

    selectTooth(number) {
        this.controllers[this.expandedInvoice].services[this.expandedService].toothNumber.setValue(number);
    }

    formatDate(date: any) {
        if (date != null) {
            if (date instanceof Date) {
                return date.toLocaleDateString();
            } else {
                return new Date(date).toLocaleDateString();
            }
        }
        return '';
    }

    isControlNull(control: FormControl) {
        return control.value == null || control.value == '';
    }

    toTwoDecimalPoints(num: number) {
        return Number.parseFloat(num.toPrecision(num.toFixed().length + 2));
    }

    getStatusColor(status: string) {
        return this.sharedServices.getCardAccentColor(status);
    }
    getStatusText(status: string) {
        return this.sharedServices.statusToName(status);
    }
    getPBMValidation() {
        this.adminService.checkIfPBMValidationIsEnabled(this.sharedServices.providerId, '101').subscribe((event: any) => {
            if (event instanceof HttpResponse) {
                const body = event['body'];
                this.isPBMValidationVisible = body.value === '1'
                    && (this.claimProps.statusCode.toLowerCase() === ClaimStatus.Accepted.toLowerCase()
                        || this.claimProps.statusCode.toLowerCase() === ClaimStatus.Downloadable.toLowerCase()) ? true : false;
            }
        }, err => {
            console.log(err);
        });

    }

    showFirstInvoicePage() {
        this.invoicesPaginationControl.page = 0;
    }
    showNextInvoicesPage() {
        if ((this.invoicesPaginationControl.page + 1) < this.totalInvoicesPages) {
            this.invoicesPaginationControl.page++;
        }
    }
    showPreviousInvoicesPage() {
        if (this.invoicesPaginationControl.page > 0) {
            this.invoicesPaginationControl.page--;
        }
    }
    showLastInvoicePage() {
        this.invoicesPaginationControl.page = this.totalInvoicesPages;
    }

    get currentInvoicesPage() {
        return this.invoicesPaginationControl.page;
    }

    get currentInvoicesSize() {
        return this.invoicesPaginationControl.size;
    }

    get totalInvoicesPages() {
        return Math.ceil(this.controllers.length / this.invoicesPaginationControl.size);
    }

    _isInvalidDate(date: Date) {
        if (date != null && !(date instanceof Date)) {
            date = new Date(date);
        }
        return date == null || Number.isNaN(date.getTime()) || Number.isNaN(date.getFullYear()) || Number.isNaN(date.getMonth())
            || Number.isNaN(date.getDay()) || date.getTime() > Date.now();
    }
    setServiceTypeIndex(pindex: any, cindex: any) {
        this.serviceTypeParIndex = pindex;
        this.serviceTypeChildIndex = cindex;
    }

}