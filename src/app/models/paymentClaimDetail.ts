import { PaymentServiceDetails } from './paymentServiceDetails';

export class PaymentClaimDetail {
    claimId: number;
    providerClaimNumber: string;
    patientName: string;
    policyNumber: string;
    physicianName: string;
    patientFileNumber: string;
    statusCode: string;
    statusDescription: string;
    requestedNetAmount: number;
    requestedNetAmountUnit: string;
    requestedNetVatAmount: number;
    requestedNetVatAmountUnit: string;
    paidAmount: number;
    paidAmountUnit: string;
    rejectedAmount: number;
    rejectedAmountUnit: string;

    serviceDetails: PaymentServiceDetails[];
}
