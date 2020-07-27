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
        this.serviceType = 'NA';
    }

    static fromResponse(response): { service: Service, decision: ServiceDecision, used: boolean }[] {
        let services: { service: Service, decision: ServiceDecision, used: boolean }[] = [];

        if (response instanceof HttpResponse) {
            const body = response.body;
            const serviceResponse = body['serviceResponse'];
            if (serviceResponse != null && serviceResponse instanceof Array) {
                serviceResponse.forEach(res => {
                    let service = new Service();
                    let decision = new ServiceDecision();

                    const serviceCT = res['service'];
                    const serviceDecisionCT = res['serviceDecision'];

                    service.serviceCode = serviceCT['serviceCode'];
                    service.serviceDescription = serviceCT['serviceDescription'];
                    service.serviceDate = new Date(serviceCT['serviceDate']);
                    if (serviceCT['toothNumber'] != null)
                        service.toothNumber = `${Number.parseInt(serviceCT['toothNumber'].split('_')[1]) - 1}`;
                    console.log(service.toothNumber);
                    service.serviceNumber = serviceCT['serviceNumber']
                    if (serviceCT['unitPrice'] != null)
                        service.unitPrice = serviceCT['unitPrice'];
                    service.requestedQuantity = Number.parseInt(serviceCT['requestedQuantity']);
                    if (serviceCT['serviceGDPN'] != null) {
                        const gdpn = serviceCT['serviceGDPN'];
                        if (gdpn['net'] != null)
                            service.serviceGDPN.net = gdpn['net'];
                        if (gdpn['netVATamount'] != null)
                            service.serviceGDPN.netVATamount = gdpn['netVATamount'];
                        if (gdpn['netVATrate'] != null)
                            service.serviceGDPN.netVATrate = gdpn['netVATrate'];
                        if (gdpn['discount'] != null)
                            service.serviceGDPN.discount = gdpn['discount'];
                        if (gdpn['gross'] != null)
                            service.serviceGDPN.gross = gdpn['gross'];
                        if (gdpn['patientShare'] != null)
                            service.serviceGDPN.patientShare = gdpn['patientShare'];
                        if (gdpn['patientShareVATamount'] != null)
                            service.serviceGDPN.patientShareVATamount = gdpn['patientShareVATamount'];
                        if (gdpn['patientShareVATrate'] != null)
                            service.serviceGDPN.patientShareVATrate = gdpn['patientShareVATrate'];
                        if (gdpn['rejection'] != null)
                            service.serviceGDPN.rejection = gdpn['rejection'];
                        if (gdpn['priceCorrection'] != null)
                            service.serviceGDPN.priceCorrection = gdpn['priceCorrection'];
                    }

                    decision.approvedQuantity = Number.parseInt(serviceDecisionCT['approvedQuantity']);
                    if (serviceDecisionCT['unitPrice'] != null)
                        decision.unitPrice = serviceDecisionCT['unitPrice'];
                    if (serviceDecisionCT['serviceGDPN'] != null) {
                        const gdpn = serviceDecisionCT['serviceGDPN'];
                        if (gdpn['net'] != null)
                            decision.serviceGDPN.net = gdpn['net'];
                        if (gdpn['netVATamount'] != null)
                            decision.serviceGDPN.netVATamount = gdpn['netVATamount'];
                        if (gdpn['netVATrate'] != null)
                            decision.serviceGDPN.netVATrate = gdpn['netVATrate'];
                        if (gdpn['discount'] != null)
                            decision.serviceGDPN.discount = gdpn['discount'];
                        if (gdpn['gross'] != null)
                            decision.serviceGDPN.gross = gdpn['gross'];
                        if (gdpn['patientShare'] != null)
                            decision.serviceGDPN.patientShare = gdpn['patientShare'];
                        if (gdpn['patientShareVATamount'] != null)
                            decision.serviceGDPN.patientShareVATamount = gdpn['patientShareVATamount'];
                        if (gdpn['patientShareVATrate'] != null)
                            decision.serviceGDPN.patientShareVATrate = gdpn['patientShareVATrate'];
                        if (gdpn['rejection'] != null)
                            decision.serviceGDPN.rejection = gdpn['rejection'];
                        if (gdpn['priceCorrection'] != null)
                            decision.serviceGDPN.priceCorrection = gdpn['priceCorrection'];
                    }
                    services.push({ service: service, decision: decision, used: false });
                });
            }
        }

        return services;
    }

}