
export class PaymentServiceDetails {
    invoiceNumber: string;
    serviceCode: string;
    serviceDescription: string;
    serviceStatus: string;
    decisionComment: string;
    requestedNetAmount: number;
    requestedNetAmountUnit: string;
    requestedNetVatAmount: number;
    requestedNetVatAmountVat: string;
    paidAmount: number;
    paidAmountUnit: string;
    rejectedAmount: number;
    rejectedAmountUnit: string;
    serviceDate: Date;
}
