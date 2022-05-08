import { Paginateable } from './paginateable';

export class PriceDetailModel extends Paginateable {

  code: string;
  factor: number;
  display: string;
  itemType: string;
  nonStandardCode: string;
  nonStandardDescription: string;
  unitPrice: number;

  constructor(body: {}) {
    super(body);

    this.code = body['code'];
    this.factor = body['factor'];
    this.display = body['display'];
    this.itemType = body['itemType'];
    this.nonStandardCode = body['nonStandardCode'];
    this.nonStandardDescription = body['nonStandardDescription'];
    this.unitPrice = body['unitPrice'];
  }
}
