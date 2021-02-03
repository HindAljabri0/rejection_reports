import { GDPN } from './GDPN.model';


export class RetrievedClaimProps {

    errors: { code: string, description: string, fieldName: string }[];
    lastSubmissionDate: Date;
    lastUpdateDate: Date;
    paymentDate: Date;
    statusCode: string;
    statusDetail: string;
    paymentReference: string;
    claimDecisionGDPN: GDPN;
    eligibilityCheck: string;
    
}