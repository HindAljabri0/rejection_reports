import { Paginateable } from './paginateable';

export class BatchSummaryModel extends Paginateable {
    provclaimno: string;
    memberid: string;
    idnumber: string;
    patientfilenumber: string;
    visitdate: string;
    net: number;
    netvatamount: number;
    claimid: number;
    physicianname: string;

    constructor(body: {}) {
        super(body);
        this.provclaimno = body['provclaimno'];
        this.memberid = body['memberid'];
        this.idnumber = body['idnumber'];
        this.patientfilenumber = body['patientfilenumber'];
        this.visitdate = body['visitdate'];
        this.net = body['net'];
        this.netvatamount = body['netvatamount'];
        this.claimid = body['claimid'];
        this.physicianname = body['physicianname'];
    }
}
