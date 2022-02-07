import { DateFormatterFn } from "ngx-bootstrap/chronos/types";

export class BillTemplate {

    billNo: number;
    billDate: Date;
    grossAmount: number;
    discountAmount: number;
    additionalDiscount: number;
    additionalDiscountPercent: number;
    netAmount: number;
    isInvoiced: string;
}