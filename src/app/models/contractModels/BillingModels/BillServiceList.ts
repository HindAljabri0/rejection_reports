import { FormControl } from "@angular/forms";

export class BillServiceList {

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
    //discountTypeController: FormControl;
    deptDepartmentName: string;
    deptDiscountType: string;
    deptDiscountAmount: number;
    patientShare: number;
    shareType: string;
    serviceDiscountAmount: number;
    patientShareAmount: number;
    insShareAmount: number;
    netShareAmount: number;
}