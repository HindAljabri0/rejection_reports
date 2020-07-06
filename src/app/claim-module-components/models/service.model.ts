import { GDPN, Amount } from './GDPN.model';
import { Period } from './period.type';

export class Service {

    serviceNumber?: number;
    serviceDate: Date;
    serviceType?: string;
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
        this.unitPrice = new Amount(0,'SAR');
        this.serviceGDPN = new GDPN();
    }

}