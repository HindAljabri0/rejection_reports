import { Service } from './service.model';
import { GDPN } from './GDPN.model';


export class ServiceView extends Service {

    serviceDecision: {
        invoiceNumber: string;
        serviceNumber: number;
        serviceStatusCode: string;
        serviceStatusDescription: string;
        gdpn: GDPN;
        approvedQuantity: number;
        serviceDenialCode: string;
        decisionComment: string;
    };
}
