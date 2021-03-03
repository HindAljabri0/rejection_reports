import { Paginateable } from './paginateable';

export class SubmittedInvoiceSummary extends Paginateable {
    claimId: string;
    payerId: string;
    visitDate: Date;
    submissionDate: Date;
    provClaimNo: string;
    payerClaimRefNo: string;
    batchid: string;
    policyHolderCode: string;
    status: string;

    constructor(body: {}) {
        super(body);
        this.payerId = body['payerId'];
        this.claimId = body['claimId'];
        this.visitDate = body['visitDate'];
        this.submissionDate = body['submissionDate'];
        this.provClaimNo = body['provClaimNo'];
        this.payerClaimRefNo = body['payerClaimRefNo'];
        this.batchid = body['batchid'];
        this.policyHolderCode = body['policyHolderCode'];
        this.status = body['status'];

    }
}
