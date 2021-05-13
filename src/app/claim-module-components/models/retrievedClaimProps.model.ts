import { GDPN } from './GDPN.model';


export class RetrievedClaimProps {


    lastSubmissionDate: Date;
    lastUpdateDate: Date;
    paymentDate: Date;
    statusCode: string;
    statusDetail: string;
    paymentReference: string;
    claimDecisionGDPN: GDPN;
    eligibilityCheck: string;

}
