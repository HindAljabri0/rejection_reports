import { Paginateable } from './paginateable';

export class PriceListModel extends Paginateable {

  effectiveDate: string;
  name: string;
  payerNphiesId: string;
  payerName: string;
  priceListId: number;
  providerId: number;
  uploadedDate: string;
  tpaNphiesId: string;

  constructor(body: {}) {
    super(body);
    this.effectiveDate = body['effectiveDate'];
    this.name = body['name'];
    this.payerNphiesId = body['payerNphiesId'];
    this.payerName = body['payerName'];
    this.priceListId = body['priceListId'];
    this.providerId = body['providerId'];
    this.uploadedDate = body['uploadedDate'];
    this.tpaNphiesId =  body['tpaNphiesId'];
  }
}
