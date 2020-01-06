import { Paginateable } from './paginateable';

export class PaymentClaimSummary extends Paginateable {

    claimId: number;
    providerClaimNumber: string;
    payerClaimNumber: string;
    claimStatus: string;
    requstedNetAmount: number;
    paidNetAmount: number;

    constructor(body:{}){
        super(body);
        this.claimId = body['claimId'];
        this.providerClaimNumber = body['providerClaimNumber'];
        this.payerClaimNumber = body['payerClaimNumber'];
        this.claimStatus = body['claimStatus'];
        this.requstedNetAmount = body['requstedNetAmount'];
        this.paidNetAmount = body['paidNetAmount'];
    }
}