export class InvoiceDetail {
    status: number;
    billId: number;
    details: string;
    amount: number;
    serviceIds: number[] = [];
    paymentNo: string;
    paymentType: number;
    paymentDate: Date;
    paymentId: string;
}