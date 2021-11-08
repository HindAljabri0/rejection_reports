import { Paginateable } from './paginateable';

export class CommunicationRequest extends Paginateable {
  communicationId: number;
  category: string;
  requestId: number;
  reasonCode: string;
  payerNphiesId: number;
  notificationId: number;
  notificationStatus: string;

  constructor(body: {}) {
    super(body);
    this.communicationId = body['communicationId'];
    this.category = body['category'];
    this.requestId = body['requestId'];
    this.reasonCode = body['reasonCode'];
    this.payerNphiesId = body['payerNphiesId'];
    this.notificationId = body['notificationId'];
    this.notificationStatus = body['notificationStatus'];
  }
}
