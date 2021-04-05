import { DeductedService } from "./detuctedServices";
import { ProviderCreditReportInformation } from "./providercreditReportInformation";
import { RejectedService } from "./rejectedServices";


export class CreditReportSummaryResponse {
    detuctedServices: DeductedService[];
    providercreditReportInformation: ProviderCreditReportInformation;
    rejectedServices: RejectedService[];
}