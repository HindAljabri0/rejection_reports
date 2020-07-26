import { Amount, GDPN } from './GDPN.model';

export class ServiceDecision {
    approvedQuantity:number;
    unitPrice:Amount;
    serviceGDPN:GDPN;

    constructor(){
        this.unitPrice = new Amount(0, 'SAR');
        this.serviceGDPN = new GDPN();
    }
}