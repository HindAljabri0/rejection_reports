import { BillServiceList } from "./BillServiceList";


export class BillTemplate {

    billNo: number;
    billDate: Date;
    grossAmount: number;
    discountAmount: number;
    additionalDiscount: number;
    additionalDiscountPercent: number;
    netAmount: number;
    isInvoiced: string;
    billServices: Array<BillServiceList>;
}