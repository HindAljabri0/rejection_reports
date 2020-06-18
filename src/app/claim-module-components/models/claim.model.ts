import { ClaimIdentifier } from './claimIdentifier.model';
import { Member } from './member.model';
import { VisitInfo } from './visitInfo.model';
import { CaseDescription } from './caseDescription.model';
import { GDPN } from './GDPN.model';
import { Invoice } from './invoice.model';
import { Admission } from './admission.model';
import { AttachmentRequest } from './attachmentRequest.model';

export class Claim {

    claimIdentities: ClaimIdentifier;
    member: Member;
    visitInformation: VisitInfo;
    caseInformation: CaseDescription;
    claimGDPN: GDPN;
    invoice: Invoice[];
    comment: {
        commentDate: Date;
        commentText: string;
        commentType: 'PAYER' | 'PROVIDER';
    }[];
    admission: Admission;
    attachment: AttachmentRequest[];

    constructor(){}
}