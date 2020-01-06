import { Paginateable } from './paginateable';

export class PaymentRefernceDetail extends Paginateable {

    paymentDate: Date;
    paymentReference: string;
    totalNumberOfClaims: number;
    totalPaidAmount: number;
    totalPaidVatAmount: number;
    payerId: string;

    constructor(body: {}) {
        super(body);
        this.payerId = body["payerId"];
        this.paymentDate= body["paymentDate"];
        this.paymentReference= body["paymentReference"];
        this.totalNumberOfClaims= body["totalNumberOfClaims"];
        this.totalPaidAmount= body["totalPaidAmount"];
        this.totalPaidVatAmount= body["totalPaidVatAmount"];
    }
}