import { GDPN, Amount } from './GDPN.model';
import { Period } from './period.type';
import { HttpResponse } from '@angular/common/http';

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

    static fromResponse(response): Service[] {
        let services: Service[] = [];
        if (response instanceof HttpResponse) {
            const body = response.body;
            const serviceResponse = body['serviceResponse'];
            if (serviceResponse != null && serviceResponse instanceof Array) {
                serviceResponse.forEach(res => {
                    let service = new Service();
                    const serviceCT = res['service'];
                    const serviceDecisionCT = res['serviceDecision'];

                    service.serviceCode = serviceCT['serviceCode'];
                    service.serviceDescription = serviceCT['serviceDescription'];
                    service.serviceDate = new Date(serviceCT['serviceDate']);
                    service.toothNumber = serviceCT['toothNumber'];
                    service.serviceNumber = serviceCT['serviceNumber']
                    if (serviceCT['unitPrice'] != null)
                        service.unitPrice = serviceCT['unitPrice'];
                    service.requestedQuantity = Number.parseInt(serviceDecisionCT['approvedQuantity']);
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
                    if (serviceDecisionCT['serviceGDPN'] != null) {
                        const gdpn = serviceDecisionCT['serviceGDPN'];
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
                    services.push(service);
                });
            }
        }

        return services;
    }

}