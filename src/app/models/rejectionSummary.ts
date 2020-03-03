import { Paginateable } from './paginateable';

export class RejectionSummary extends Paginateable {

    claimId:string;
    doctorId: string;
    patientName: string;
    claimRefNo: string;
    patientFileNumber: string;
    memeberId: string;
    policyNumber: string;
    claimdate: Date;
    netAmount: number;
    rejectedBy: string;
    status: string;
    statusDetails: string;
    field: string;

    constructor(body: {}) {
        super(body);
        this.claimId = body["wslGenInfo"]["claimid"];
        this.doctorId = body["wslGenInfo"]["physicianid"];
        this.patientName = (body["wslGenInfo"]["firstname"]!=null?body["wslGenInfo"]["firstname"]:"") + (body["wslGenInfo"]["lastname"]!=null?body["wslGenInfo"]["lastname"]:"");
        this.claimRefNo = body["wslGenInfo"]["claimid"];
        this.patientFileNumber = body["wslGenInfo"]["patientfilenumber"];
        this.memeberId = body["wslGenInfo"]["memberid"];
        this.policyNumber = body["wslGenInfo"]["policynumber"];
        this.claimdate = body["wslGenInfo"]["visitdate"];
        this.netAmount = body["wslGenInfo"]["net"];
        this.rejectedBy = (body["wslGenInfo"]["claimprop"]["statuscode"] == "NotAccepted") ? "Waseel" : "Payer";
        this.status = body["wslGenInfo"]["claimprop"]["statuscode"];
        this.statusDetails = body["wslGenInfo"]["claimprop"]["statusdetail"];
        this.field = "";
    }
}