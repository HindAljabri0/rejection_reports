import { GDPN, Amount } from './GDPN.model';
import { Period } from './period.type';
import { HttpResponse } from '@angular/common/http';
import { ServiceDecision } from './serviceDecision.model';

export class Service {
    serviceNumber?: number;
    serviceDate: Date;
    serviceType: string;
    serviceCode: string;
    serviceDescription: string;
    serviceComment?: string;
    toothNumber: string;
    requestedQuantity: number;
    unitPrice: Amount;
    serviceGDPN: GDPN;
    drugUse?: {
        dosage: { value: number, unit: string },
        doseTimes: { value: number, qualifier: string },
        durationOfTreatment: Period
    };

    constructor() {
        this.requestedQuantity = 0;
        this.unitPrice = new Amount(0, 'SAR');
        this.serviceGDPN = new GDPN();
        this.serviceType = 'N/A';
    }

    static fromResponse(response): { service: Service, decision: ServiceDecision, used: boolean }[] {
        const services: { service: Service, decision: ServiceDecision, used: boolean }[] = [];

        if (response instanceof HttpResponse) {
            const body = response.body;
            const serviceResponse = body['serviceResponse'];
            if (serviceResponse != null && serviceResponse instanceof Array) {
                serviceResponse.forEach(res => {
                    const service = new Service();
                    const decision = new ServiceDecision();

                    const serviceCT = res['service'];
                    const serviceDecisionCT = res['serviceDecision'];

                    service.serviceCode = serviceCT['serviceCode'];
                    service.serviceDescription = serviceCT['serviceDescription'];
                    service.serviceDate = new Date(serviceCT['serviceDate']);
                    if (serviceCT['toothNumber'] != null) {
                        service.toothNumber = `${Number.parseInt(serviceCT['toothNumber'].split('_')[1], 10) - 1}`;
                    }
                    service.serviceNumber = serviceCT['serviceNumber'];
                    if (serviceCT['unitPrice'] != null) {
                        service.unitPrice = serviceCT['unitPrice'];
                    }
                    service.requestedQuantity = Number.parseInt(serviceCT['requestedQuantity'], 10);


                    decision.approvedQuantity = Number.parseInt(serviceDecisionCT['approvedQuantity'], 10);
                    if (serviceDecisionCT['unitPrice'] != null) {
                        decision.unitPrice = serviceDecisionCT['unitPrice'];
                    }
                    if (serviceDecisionCT['serviceGDPN'] != null) {
                        const gdpn = serviceDecisionCT['serviceGDPN'];
                        if (gdpn['rejection'] != null) {
                            decision.serviceGDPN.rejection = gdpn['rejection'];
                        }
                        if (gdpn['priceCorrection'] != null) {
                            decision.serviceGDPN.priceCorrection = gdpn['priceCorrection'];
                        }
                    }
                    services.push({ service: service, decision: decision, used: false });
                });
            }
        }
        return services;
    }
}
