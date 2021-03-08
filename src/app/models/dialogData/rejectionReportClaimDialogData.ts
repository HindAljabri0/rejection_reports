export class RejectionReportClaimDialogData {
    claimStatus: string;
    providerClaimId: string;
    patientName: string;
    drName: string;
    policyNumber: string;
    patientFileNumber: string;
    netAmount: number;
    netVatAmount: number;
    netAmountUnit: string;
    netvatAmountUnit: string;
    claimDate: Date;

    statusDescription: string;

    services?: {
        invoiceNmber: string;
        code: string;
        description: string;
        requestedNA: number;
        requestedNAUnit: string;
        requestedNAVat: number;
        requestedNAVatUnit: string;
        differentInComputation: string;
        rejectedAmount: number;
        rejectedAmountUnit: string;
        status: string;
        statusDetails: string;
    }[];

    claimErrors?: {
        status: string;
        feildName: string;
        description: string;
    }[];

}
