import { Paginateable } from './paginateable';

export class RejectionSummary extends Paginateable {

    claimId: string;
    payerId: string;
    visitDate: Date;
    rejectDate: Date;
    provClaimNo: string;
    payerClaimRefNo: string;
    batchid: string;
    policyHolderCode: string;
    status: string;

    constructor(body: {}) {
        super(body);
        this.payerId = body["payerId"];
        this.claimId = body["claimId"];
        this.visitDate = body["visitDate"];
        this.rejectDate = body["rejectDate"];
        this.provClaimNo = body["provClaimNo"];
        this.payerClaimRefNo = body["payerClaimRefNo"];
        this.batchid = body["batchid"];
        this.policyHolderCode = body["policyHolderCode"];
        this.status = body["status"];

    }
}