
export class TransactionLog {

    providerTransactionId: number;
    nphiesTransactionId: number;

    requestDate: Date;
    responseDate: Date;

    providerId: string;
    payerNphiesId: number;
    memberCardId: string;

    waseelResponseStatusCode: number;

    transactionType: string;

    providerRequest: string;
    waseelRequest: string;
    nphiesResponse: string;
    waseelResponse: string;

}