export class GDPN {
    net: Amount;
    netVATrate: Amount;
    netVATamount: Amount;
    patientShare: Amount;
    patientShareVATrate: Amount;
    patientShareVATamount: Amount;
    discount: Amount;
    gross: Amount;
    priceCorrection?: Amount;
    rejection?: Amount;

    constructor() {
        
        this.net = new Amount(0, localStorage.getItem('currencyCode') != null && localStorage.getItem('currencyCode') != undefined ? localStorage.getItem('currencyCode') : "SAR");
        this.netVATrate = new Amount(0, 'PERCENT');
        this.netVATamount = new Amount(0, localStorage.getItem('currencyCode') != null && localStorage.getItem('currencyCode') != undefined ? localStorage.getItem('currencyCode') : "SAR");
        this.patientShare = new Amount(0, localStorage.getItem('currencyCode') != null && localStorage.getItem('currencyCode') != undefined ? localStorage.getItem('currencyCode') : "SAR");
        this.patientShareVATrate = new Amount(0, 'PERCENT');
        this.patientShareVATamount = new Amount(0, localStorage.getItem('currencyCode') != null && localStorage.getItem('currencyCode') != undefined ? localStorage.getItem('currencyCode') : "SAR");
        this.discount = new Amount(0, localStorage.getItem('currencyCode') != null && localStorage.getItem('currencyCode') != undefined ? localStorage.getItem('currencyCode') : "SAR");
        this.gross = new Amount(0, localStorage.getItem('currencyCode') != null && localStorage.getItem('currencyCode') != undefined ? localStorage.getItem('currencyCode') : "SAR");
        this.priceCorrection = new Amount(0, localStorage.getItem('currencyCode') != null && localStorage.getItem('currencyCode') != undefined ? localStorage.getItem('currencyCode') : "SAR");
        this.rejection = new Amount(0, localStorage.getItem('currencyCode') != null && localStorage.getItem('currencyCode') != undefined ? localStorage.getItem('currencyCode') : "SAR");
    }

}

export class Amount {
    value: number;
    type: String;

    constructor(value, type) {
        this.value = value;
        this.type = type;
    }
}
