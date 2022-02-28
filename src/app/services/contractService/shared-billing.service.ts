import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class SharedBillingService {

    constructor() { }

    public username: string;

    public invoiceServices: {
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
        //discountTypeController: FormControl,
        deptDepartmentName: string;
        deptDiscountType: string;
        deptDiscountAmount: number;
        patientShare: number;
        shareType: string;
        serviceDiscountAmount: number;
        patientShareAmount: number;
        insShareAmount: number;
        netShareAmount: number;
    }[];


    set setUser(val: string) {
        this.username = val;
    }

    set setInvoiceServices(val: {
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
        //discountTypeController: FormControl,
        deptDepartmentName: string;
        deptDiscountType: string;
        deptDiscountAmount: number;
        patientShare: number;
        shareType: string;
        serviceDiscountAmount: number;
        patientShareAmount: number;
        insShareAmount: number;
        netShareAmount: number;
    }[]) {
        this.invoiceServices = val;
    }

    get getUser(): string {
        return this.username;
    }

    get getInvoiceServices(): {
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
        //discountTypeController: FormControl,
        deptDepartmentName: string;
        deptDiscountType: string;
        deptDiscountAmount: number;
        patientShare: number;
        shareType: string;
        serviceDiscountAmount: number;
        patientShareAmount: number;
        insShareAmount: number;
        netShareAmount: number;
    }[] {
        return this.invoiceServices;
    }

}
