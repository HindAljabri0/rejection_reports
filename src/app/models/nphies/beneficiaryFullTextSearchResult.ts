
export class BeneficiariesSearchResult {

    id: number;
    name: string;
    documentId: string;
    documentType: string;
    plans: {
        planId: string;
        payerId: string;
        payerName: string;
        expiryDate: Date;
        memberCardId: string;
        primary: boolean;
    }[];
}