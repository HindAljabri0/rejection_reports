import { Paginateable } from './paginateable';

export class RejectionSummary extends Paginateable {
    claimId: string;
    doctorId: string;
    patientName: string;
    claimRefNo: string;
    patientFileNumber: string;
    memberId: string;
    policyNumber: string;
    claimdate: Date;
    netAmount: number;
    rejectedBy: string;
    status: string;
    statusDetails: string;
    field: string;

    constructor(body: {}) {
        super(body);
        this.claimId = body['claimId'];
        this.doctorId = body['doctorId'];
        this.patientName = body['patientName'];
        this.claimRefNo = body['claimRefNo'];
        this.patientFileNumber = body['patientFileNumber'];
        this.memberId = body['memberId'];
        this.policyNumber = body['policyNumber'];
        this.claimdate = body['claimdate'];
        this.netAmount = body['netAmount'];
        this.status = body['status'];
        this.statusDetails = body['statusDetails'];
        this.rejectedBy = (this.status == 'NotAccepted') ? 'Waseel' : 'Payer';
        this.field = '';
    }
}
