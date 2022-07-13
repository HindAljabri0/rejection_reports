import { Paginateable } from './paginateable';

export class ApprovalToClaimTransaction extends Paginateable {
  beneficiaryName: string;
  documentId: string;
  items: Item[];
  nphiesRequestId: string;
  payerId: string;
  preAuthRefNo: string;
  requestId: number;
  responseId: number;
  responseTimestamp: string;
  status: string;
  totalNet: number;
  transactionDate: string;
  episodeId: number;

  constructor(body: {}) {
    super(body);

    this.beneficiaryName = body["beneficiaryName"];
    this.episodeId = body["episodeId"];
    this.documentId = body["documentId"];
    this.items = body["items"];
    this.nphiesRequestId = body["nphiesRequestId"];
    this.payerId = body["payerId"];
    this.preAuthRefNo = body["preAuthRefNo"];
    this.requestId = body["requestId"];
    this.responseId = body["responseId"];
    this.responseTimestamp = body["responseTimestamp"];
    this.status = body["status"];
    this.totalNet = body["totalNet"];
    this.transactionDate = body["transactionDate"];

  }
}

class Item {
  sequence: number;
  approvedNet: number;
  itemCode: string;
  itemDescription: string;
  itemId: number;
  itemType: string;
  net: number;
  patientShare: number;
  payerSahare: number;
  status: string;
}
