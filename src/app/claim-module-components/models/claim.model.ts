import { ClaimIdentifier } from './claimIdentifier.model';
import { Member } from './member.model';
import { VisitInfo } from './visitInfo.model';
import { CaseDescription } from './caseDescription.model';
import { GDPN } from './GDPN.model';
import { Invoice } from './invoice.model';
import { Admission } from './admission.model';
import { AttachmentRequest } from './attachmentRequest.model';
import { CaseInfo } from './caseInfo.model';

export class Claim {

    claimIdentities: ClaimIdentifier;
    member: Member;
    visitInformation: VisitInfo;
    caseInformation: CaseInfo;
    claimGDPN: GDPN;
    invoice: Invoice[];
    comment: {
        commentDate: Date;
        commentText: string;
        commentType: 'PAYER' | 'PROVIDER';
    }[];
    admission: Admission;
    attachment: AttachmentRequest[];

    constructor(claimType:string, providerClaimNumber:string){
        this.caseInformation = new CaseInfo('OUTPATINET');
        this.claimIdentities = new ClaimIdentifier(providerClaimNumber);
        this.member = new Member();
        this.visitInformation = new VisitInfo(claimType);
        this.claimGDPN = new GDPN();
        this.invoice = [new Invoice()];
        this.comment = [];
        this.admission = new Admission();
        this.attachment = [];
    }
}