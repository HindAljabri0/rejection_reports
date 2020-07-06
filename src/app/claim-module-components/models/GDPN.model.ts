
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
        this.net = new Amount(0, 'SAR');
        this.netVATrate = new Amount(0, 'PERCENT');
        this.netVATamount = new Amount(0, 'SAR');
        this.patientShare = new Amount(0, 'SAR');
        this.patientShareVATrate = new Amount(0, 'PERCENT');
        this.patientShareVATamount = new Amount(0, 'SAR');
        this.discount = new Amount(0, 'SAR');
        this.gross = new Amount(0, 'SAR');
        this.priceCorrection = new Amount(0, 'SAR');
        this.rejection = new Amount(0, 'SAR');
    }

}

export class Amount {
    value: number;
    type: 'PERCENT' | 'AED' | 'AFN' | 'ALL' | 'AMD' | 'ANG' | 'AOA' | 'ARS' | 'AUD' | 'AWG' | 'AZN' | 'BAM' | 'BBD' | 'BDT' | 'BGN' | 'BHD' | 'BIF' | 'BMD' | 'BND' | 'BOB' | 'BOV' | 'BRL'
    | 'BSD' | 'BTN' | 'BWP' | 'BYR' | 'BZD' | 'CAD' | 'CDF' | 'CHE' | 'CHF' | 'CHW' | 'CLF' | 'CLP' | 'CNY' | 'COP' | 'COU' | 'CRC' | 'CUP' | 'CVE' | 'CYP' | 'CZK' | 'DJF' | 'DKK' | 'DOP'
    | 'DZD' | 'EEK' | 'EGP' | 'ERN' | 'ETB' | 'EUR' | 'FJD' | 'FKP' | 'GBP' | 'GEL' | 'GHS' | 'GIP' | 'GMD' | 'GNF' | 'GTQ' | 'GYD' | 'HKD' | 'HNL' | 'HRK' | 'HTG' | 'HUF' | 'IDR' | 'ILS'
    | 'INR' | 'IQD' | 'IRR' | 'ISK' | 'JMD' | 'JOD' | 'JPY' | 'KES' | 'KGS' | 'KHR' | 'KMF' | 'KPW' | 'KRW' | 'KWD' | 'KYD' | 'KZT' | 'LAK' | 'LBP' | 'LKR' | 'LRD' | 'LSL' | 'LTL' | 'LVL'
    | 'LYD' | 'MAD' | 'MDL' | 'MGA' | 'MKD' | 'MMK' | 'MNT' | 'MOP' | 'MRO' | 'MTL' | 'MUR' | 'MVR' | 'MWK' | 'MXN' | 'MXV' | 'MYR' | 'MZN' | 'NAD' | 'NGN' | 'NIO' | 'NOK' | 'NPR' | 'NZD'
    | 'OMR' | 'PAB' | 'PEN' | 'PGK' | 'PHP' | 'PKR' | 'PLN' | 'PYG' | 'QAR' | 'RON' | 'RSD' | 'RUB' | 'RWF' | 'SAR' | 'SBD' | 'SCR' | 'SDG' | 'SEK' | 'SGD' | 'SHP' | 'SKK' | 'SLL' | 'SOS'
    | 'SRD' | 'STD' | 'SYP' | 'SZL' | 'THB' | 'TJS' | 'TMM' | 'TND' | 'TOP' | 'TRY' | 'TTD' | 'TWD' | 'TZS' | 'UAH' | 'UGX' | 'USD' | 'USN' | 'USS' | 'UYU' | 'UZS' | 'VEB' | 'VND' | 'VUV'
    | 'WST' | 'XAF' | 'XAG' | 'XAU' | 'XBA' | 'XBB' | 'XBC' | 'XBD' | 'XCD' | 'XDR' | 'XFO' | 'XFU' | 'XOF' | 'XPD' | 'XPF' | 'XPT' | 'XTS' | 'XXX' | 'YER' | 'ZAR' | 'ZMK' | 'ZWD' | 'SR';

    constructor(value, type){
        this.value = value;
        this.type = type;
    }
}